import {
  Heading,
  Flex,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState, useRef } from 'react';
import { navHeight } from 'global-variables'
import * as yup from "yup";
import { Field, Form, Formik } from 'formik';
import { brandButtonStyle } from 'theme/simple'
import ValidateGate from 'components/validate-gate'
import { Address, applyParamsToScript, Constr, Data, PolicyId, Unit, utf8ToHex, UTxO, Lovelace } from 'lucid-cardano'
import type { MintingPolicy, Lucid } from 'lucid-cardano'
import SimpleAlert from 'components/simple-alert'
import { getMintingPolicy } from 'utils/lucid/minting-policy'
import generateKey from 'utils/cryptography/generate-key';
import { generateRandomString } from 'utils/cryptography/generate-random-string';
import encrypt from 'utils/cryptography/encrypt';
import { arrayBufferToHexString } from 'utils/cryptography/helpers'
import { validatorAddress } from 'constants/games/rps/constants';
import { getLucid } from 'utils/lucid/lucid';
import { NextRouter, useRouter } from 'next/router';
type Move = "Rock" | "Paper" | "Scissors"

const getDesiredUtxo = async (lucid: Lucid) => {
  const playerAAdress = await lucid.wallet.address()
  const aUtxos = await lucid.utxosAt(playerAAdress)
  if (aUtxos.length === 0) {
    throw "Wallet is empty!"
  } else {
    let desiredUtxo: UTxO = aUtxos[0]
    let currentDesiredAssetsLen = Object.keys(desiredUtxo.assets).length
    for (let i = 1; i < aUtxos.length; i++) {
      let currentAssetsLen = Object.keys(aUtxos[i].assets).length
      if (currentAssetsLen > currentDesiredAssetsLen) continue;
      if (currentAssetsLen === currentDesiredAssetsLen && aUtxos[i].assets['lovelace'] > desiredUtxo.assets['lovelace']) {
        desiredUtxo = aUtxos[i]
        continue
      } else if (currentAssetsLen < currentDesiredAssetsLen) {
        currentDesiredAssetsLen = currentAssetsLen
        desiredUtxo = aUtxos[i]
      }
    }
    console.log(desiredUtxo)
    return desiredUtxo
  }
}

const createGame = async (lucid: Lucid, router: NextRouter, playerBAddress: string, stake: number, move: Move, password: string) => {
  let desiredUtxo: UTxO
  try {
    // 1. Find suitable UTxO to consume from user's wallet.
    desiredUtxo = await getDesiredUtxo(lucid)
    // 2. Setup minting policy
    const mintingPolicy: MintingPolicy = getMintingPolicy(desiredUtxo, "RPS")
    // 3. Create a locking transaction
    const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy)
    const unit: Unit = policyId + utf8ToHex("RPS")
    const { paymentCredential: APaymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
    const { paymentCredential: BPaymentCredential } = lucid.utils.getAddressDetails(playerBAddress)
    // Create our datum.
    // Need to generate cryptography credentials.
    const keyData = await generateKey(password)
    const nonce = generateRandomString()
    const encryptedNonceData = await encrypt(nonce, keyData.key)
    const encoder = new TextEncoder()
    const moveByteString = arrayBufferToHexString(await window.crypto.subtle.digest("SHA-256", encoder.encode(nonce + move)))
    const lovelace: Lovelace = BigInt(stake * 1000)
    const Datum = Data.to(
      new Constr(0, [
        // GameParams
        new Constr(0, [
          APaymentCredential!.hash,  // gPlayerA
          BPaymentCredential!.hash,  // gPlayerB
          lovelace,  // gStake
          BigInt(Date.now()),  // gStartTime
          180000n,  // gMoveDuration
          new Constr(0, [  // gToken
            policyId,
            utf8ToHex("RPS")
          ]),
          new Constr(0, [  // gTokenORef
            new Constr(0, [
              desiredUtxo.txHash
            ]),
            BigInt(desiredUtxo.outputIndex)
          ]),
          keyData.iv,  // gPbkdf2Iv
          BigInt(keyData.iter),  // gPbkdf2Iter
          new Uint8Array(encryptedNonceData.encrypted),  // gEncryptedNonce
          encryptedNonceData.iv  // gEncryptIv
        ]),
        moveByteString,  // gFirstMove
        new Constr(1, []),  // gSecondMove
        new Constr(1, [])  // gMatchResult
      ])
    )
    const tx = await lucid
      .newTx()
      .collectFrom([desiredUtxo])
      .mintAssets({ [unit]: 1n }, Data.to(new Constr(0, [])))
      .attachMintingPolicy(mintingPolicy)
      .payToContract(validatorAddress, { inline: Datum }, { lovelace })
      .complete()
    const signedTx = await tx.sign().complete()
    const txHash = await signedTx.submit()
    router.push({
      pathname: '/games/rps/game',
      query: {
        policyId,
        player: 0,  // 0 for playerA and 1 for playerB
      }
    })
  } catch (e) {
    alert("Game could not be created: " + e) 
  }
}

const burn = async (lucid: Lucid) => {
  const mintingPolicy: MintingPolicy = {
    type: "PlutusV2",
    script: applyParamsToScript(
      "59092759092401000032332232323232332232323232323232323232323232322232232232325335330063333573466e1d40112002212200223333573466e1d40152000212200123263201c33573803a0380340326666ae68cdc39aab9d5002480008cc8848cc00400c008c8c8c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa018900011999999999999111111111110919999999999980080680600580500480400380300280200180119a80c00c9aba1500c33501801935742a01666a0300346ae854028ccd54071d7280d9aba150093335501c75ca0366ae854020cd4060084d5d0a803999aa80e0113ad35742a00c6464646666ae68cdc39aab9d5002480008cc8848cc00400c008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8163ad35742a004605a6ae84d5d1280111931901899ab9c03203102f135573ca00226ea8004d5d0a8011919191999ab9a3370e6aae754009200023322123300100300233502c75a6ae854008c0b4d5d09aba2500223263203133573806406205e26aae7940044dd50009aba135744a004464c6405a66ae700b80b40ac4d55cf280089baa00135742a00a66a030eb8d5d0a802199aa80e00f10009aba150033335501c75c40026ae854008c080d5d09aba2500223263202933573805405204e26ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae854008c040d5d09aba2500223263201b3357380380360322034264c6403466ae712401035054350001a135573ca00226ea80044d55ce9baa0013232322232325335004130014800454cd54cd4ccd54c07448004c8c848cc00488ccd401488008008004008d40048800448cc004894cd4008407040040648c94cd4ccd5cd19b8f3500122002350092200201b01a1333573466e1cd400488004d40248800406c0684068d400488008d5400888888888888803040644cd5ce2481115554784f206e6f742070726573656e742e000181300148008406094cd4ccd5cd19b87323232300100332001355022223350014800088d4008894cd4ccd5cd19b8f0020070210201300d0011300600335004223333500123263201f3357389201024c680001f200123263201f3357389201024c680001f23263201f3357389201024c680001f3550022222222222220080010190181019133573892011257726f6e67206d696e7420616d6f756e742e00018135001220023200135501b223350014800088d4008894cd4ccd5cd19b8f00200701a019100113006003375c00460140042464460046eb0004c8004d5405c88cccd55cf8009280c919a80c18021aba1002300335744004028464646666ae68cdc39aab9d5002480008cc8848cc00400c008c028d5d0a80118029aba135744a004464c6402866ae700540500484d55cf280089baa0012323232323333573466e1cd55cea8022400046666444424666600200a0080060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008c04cd5d0a80119a8068091aba135744a004464c6403266ae7006806405c4d55cf280089baa00135742a008666aa010eb9401cd5d0a8019919191999ab9a3370ea0029002119091118010021aba135573ca00646666ae68cdc3a80124004464244460020086eb8d5d09aab9e500423333573466e1d400d20002122200323263201b33573803803603203002e26aae7540044dd50009aba1500233500975c6ae84d5d1280111931900a99ab9c016015013135744a00226ae8940044d55cf280089baa0011335500175ceb44488c88c008dd5800990009aa80a11191999aab9f00225017233501633221233001003002300635573aa004600a6aae794008c010d5d100180909aba100112232323333573466e1d4005200023212230020033005357426aae79400c8cccd5cd19b8750024800884880048c98c8048cd5ce00980900800789aab9d500113754002464646666ae68cdc3a800a400c46424444600800a600e6ae84d55cf280191999ab9a3370ea004900211909111180100298049aba135573ca00846666ae68cdc3a801a400446424444600200a600e6ae84d55cf280291999ab9a3370ea00890001190911118018029bae357426aae7940188c98c8048cd5ce00980900800780700689aab9d500113754002464646666ae68cdc39aab9d5002480008cc8848cc00400c008c014d5d0a8011bad357426ae8940088c98c8038cd5ce00780700609aab9e5001137540024646666ae68cdc39aab9d5001480008dd71aba135573ca004464c6401866ae700340300284dd5000919191919191999ab9a3370ea002900610911111100191999ab9a3370ea004900510911111100211999ab9a3370ea00690041199109111111198008048041bae35742a00a6eb4d5d09aba2500523333573466e1d40112006233221222222233002009008375c6ae85401cdd71aba135744a00e46666ae68cdc3a802a400846644244444446600c01201060186ae854024dd71aba135744a01246666ae68cdc3a8032400446424444444600e010601a6ae84d55cf280591999ab9a3370ea00e900011909111111180280418071aba135573ca018464c6402a66ae7005805404c04804404003c0380344d55cea80209aab9e5003135573ca00426aae7940044dd50009191919191999ab9a3370ea002900111999110911998008028020019bad35742a0086eb4d5d0a8019bad357426ae89400c8cccd5cd19b875002480008c8488c00800cc020d5d09aab9e500623263200e33573801e01c01801626aae75400c4d5d1280089aab9e500113754002464646666ae68cdc3a800a400446424460020066eb8d5d09aab9e500323333573466e1d400920002321223002003375c6ae84d55cf280211931900599ab9c00c00b009008135573aa00226ea8004488c8c8cccd5cd19b87500148010848880048cccd5cd19b875002480088c84888c00c010c018d5d09aab9e500423333573466e1d400d20002122200223263200c33573801a01801401201026aae7540044dd50009191999ab9a3370ea0029001100291999ab9a3370ea0049000100291931900419ab9c009008006005135573a6ea8004488008488005261200149103505431003200135500322112225335001135003220012213335005220023004002333553007120010050040011122002122122330010040031123230010012233003300200200101",
      new Constr(0, [new Constr(0, ["9517d184c01e68c97b1605ccb009591e259c020841ee28640fba688077bf35fb"]), BigInt(39)]),
      utf8ToHex("RPS")
    ),
  };
  // 3. Create a locking transaction
  const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy)
  console.log(policyId)
  const unit: Unit = policyId + utf8ToHex("RPS")
  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: -1n }, Data.to(new Constr(1, [])))
    .attachMintingPolicy(mintingPolicy)
    .complete()
  const signedTx = await tx.sign().complete()
  const txHash = await signedTx.submit()
  console.log(txHash)
}

const NewGame: NextPage = () => {
  const { data } = useSession()
  const router = useRouter()
  const moves: Move[] = ["Rock", "Paper", "Scissors"]
  const createGameSchema = yup.object().shape({
    playerB: yup.string().required("Please enter other player's address"),
    stake: yup.number().required("Please enter stake ada amount").integer().min(2, "Atleast 2 ada must be staked"),
    move: yup.string().required("Please enter your move").oneOf(moves)
  })
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Formik
          initialValues={{ playerB: '', stake: 2, move: '' }}
          validationSchema={createGameSchema}
          onSubmit={async (values, actions) => {
            const lucid: Lucid = await getLucid(data!.user.wallet)
            await createGame(lucid, router, values.playerB, values.stake, values.move as Move, data!.user.password)
            console.log(values)
            actions.resetForm()
          }}
        >
          {(props) => (
            <Form>
              <FormControl isInvalid={!!props.errors.playerB && props.touched.playerB} mt='7px' borderColor='black'>
                <FormLabel>Enter the address of second player</FormLabel>
                <Field as={Input} name='playerB' type='text' />
                <FormErrorMessage>{props.errors.playerB}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!props.errors.stake && props.touched.stake} mt='7px' borderColor='black'>
                <FormLabel>Enter ada stake amount</FormLabel>
                <Field as={Input} name='stake' type='number' />
                <FormErrorMessage>{props.errors.stake}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!props.errors.move && props.touched.move} mt='7px' borderColor='black'>
                <FormLabel>Enter your move</FormLabel>
                <Field as={RadioGroup} name='move'>
                  <HStack>
                    {moves.map((elem, ix) => (<Field as={Radio} key={ix} value={elem}>{elem}</Field>))}
                  </HStack>
                </Field>
                <FormErrorMessage>{props.errors.move}</FormErrorMessage>
              </FormControl>
              <Flex justify='center'>
                <Button
                  mt={4}
                  {...brandButtonStyle}
                  isLoading={props.isSubmitting}
                  type='submit'
                >
                  Submit
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </ValidateGate>
  )
}

export default NewGame
