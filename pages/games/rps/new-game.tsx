import {
  Flex,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { navHeight } from 'global-variables'
import * as yup from "yup";
import { Field, Form, Formik } from 'formik';
import { brandButtonStyle } from 'theme/simple'
import ValidateGate from 'components/validate-gate'
import { Constr, Data, PolicyId, Unit, utf8ToHex, UTxO, Lovelace } from 'lucid-cardano'
import type { MintingPolicy, Lucid } from 'lucid-cardano'
import { getMintingPolicy } from 'utils/lucid/minting-policy'
import { generateKey, generateRandomString, encrypt } from 'utils/cryptography/utils'
import { validatorAddress, moves } from 'constants/games/rps/constants';
import { getLucid, getDesiredUtxo } from 'utils/lucid/lucid';
import { NextRouter, useRouter } from 'next/router';
import type { Move } from 'types/games/rps/types'

const createGame = async (lucid: Lucid, router: NextRouter, playerBAddress: string, stake: number, move: Move, password: string) => {
  let desiredUtxo: UTxO
  try {
    // 1. Find suitable UTxO to consume from user's wallet.
    desiredUtxo = await getDesiredUtxo(lucid)
    // 2. Setup minting policy
    const mintingPolicy: MintingPolicy = getMintingPolicy(desiredUtxo.txHash, desiredUtxo.outputIndex, "RPS")
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
    const moveByteString = (await window.crypto.subtle.digest("SHA-256", encoder.encode(nonce + move)))
    const lovelace: Lovelace = BigInt(stake * 1000000)
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
        new Uint8Array(moveByteString),  // gFirstMove
        new Constr(1, []),  // gSecondMove
        new Constr(1, [])  // gMatchResult
      ])
    )
    const tx = await lucid
      .newTx()
      .collectFrom([desiredUtxo])
      .mintAssets({ [unit]: 1n }, Data.to(new Constr(0, [])))
      .attachMintingPolicy(mintingPolicy)
      .payToContract(validatorAddress, { inline: Datum }, { lovelace, [unit]: 1n })
      .complete()
    const signedTx = await tx.sign().complete()
    await signedTx.submit()  // maybe some use can be made for txhash.
    router.push({
      pathname: '/games/rps/game',
      query: {
        policyId,
        player: 'A',
      }
    })
  } catch (e) {
    alert("Game could not be created. Kindly retry.")
    console.log(e)
  }
}

const NewGame: NextPage = () => {
  const { data } = useSession()
  const router = useRouter()
  const createGameSchema = yup.object().shape({
    playerB: yup.string().required("Please enter other player's address"),
    stake: yup.number().required("Please enter stake Ada amount").integer().min(3, "Atleast 3 Ada must be staked"),
    move: yup.string().required("Please enter your move").oneOf(moves)
  })
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Formik
          initialValues={{ playerB: '', stake: 3, move: '' }}
          validationSchema={createGameSchema}
          onSubmit={async (values, actions) => {
            const lucid: Lucid = await getLucid(data!.user.wallet)
            await createGame(lucid, router, values.playerB, values.stake, values.move as Move, data!.user.password)
            actions.resetForm()
          }}
        >
          {(props) => (
            <Form>
              <FormControl isInvalid={!!props.errors.playerB && props.touched.playerB} borderColor='black'>
                <FormLabel textAlign='center' fontWeight='bold'>Enter the address of second player</FormLabel>
                <Field as={Input} name='playerB' type='text' placeholder='addr...' />
                <FormErrorMessage>{props.errors.playerB}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!props.errors.stake && props.touched.stake} mt='18px' borderColor='black'>
                <FormLabel textAlign='center' fontWeight='bold'>Enter Ada stake amount</FormLabel>
                <Field as={Input} name='stake' type='number' />
                <FormErrorMessage>{props.errors.stake}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!props.errors.move && props.touched.move} mt='18px' borderColor='black'>
                <FormLabel textAlign='center' fontWeight='bold'>Enter your move</FormLabel>
                <Field as={RadioGroup} name='move'>
                  <Flex justify='space-evenly' >
                    {moves.map((elem, ix) => (<Field as={Radio} key={ix} value={elem} borderColor='black' _checked={{ bg: 'black' }} >{elem}</Field>))}
                  </Flex>
                </Field>
                <FormErrorMessage>{props.errors.move}</FormErrorMessage>
              </FormControl>
              <Flex justify='center'>
                <Button
                  mt={'18px'}
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
