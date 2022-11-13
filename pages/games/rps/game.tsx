import { useRouter } from 'next/router'
import ValidateGate from 'components/validate-gate'
import {
  Button, Flex, Grid, GridItem, Heading, Spinner, Icon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { navHeight } from 'global-variables'
import { getLucid } from 'utils/lucid/lucid'
import { useSession } from 'next-auth/react'
import { validatorAddress, validatorRefUtxo, moves, moveToInt } from 'constants/games/rps/constants';
import { Lucid, UTxO, Data, PlutusData, Constr, utf8ToHex, hexToUtf8 } from 'lucid-cardano'
import { useEffect, useState, useCallback } from 'react'
import { addDatumMatchResult, addDatumMoveA, addDatumMoveB, getGameFirstMove, getGameMatchResultIndex, getGameMatchResultValue, getGameMoveDuration, getGamePolicyId, getGameSecondMoveIndex, getGameSecondMoveValue, getGameStake, getGameStartTime, getGameTokenName, getGameTxHash, getGameTxIx, getMatchResult, getMove, getOriginalRandomString } from 'utils/games/rps/utils'
import { MatchResult, Move } from 'types/games/rps/types'
import { FaHandPaper, FaHandRock, FaHandScissors, FaQuestion } from 'react-icons/fa';
import { IconType } from 'react-icons'
import { Timer } from 'components/timer'
import { brandButtonStyle } from 'theme/simple'
import { getMintingPolicy } from 'utils/lucid/minting-policy'
import * as yup from "yup";
import { Field, Form, Formik } from 'formik';

// When we reach this page, it is assumed that the currency symbol given is a valid NFT as the path to reach this page checks for that. And if somebody is crazy enough to play by mentioning url itself, then they harm themself.

// Hack to have bigint's play nice with JSON.stringify(), source: https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() }

const Game = () => {
  const [waiting, setWaiting] = useState<boolean>(true)
  const [invalid, setInvalid] = useState<boolean>(false)
  const [utxo, setUtxo] = useState<UTxO | null>(null)

  const { status, data } = useSession()

  const router = useRouter()
  const query = router.query;

  const moveIconMap: Record<Move, IconType> = { "Rock": FaHandRock, "Paper": FaHandPaper, "Scissors": FaHandScissors }

  const winString: string = "You won! Get pool funds"
  const drawString: string = "Its draw! Get your funds back"
  const loseString: string = ":( You lost"
  const timerDoneString: string = ":( Timer is done"

  // Four hooks for `Timer` component
  const [timerDone, setTimerDone] = useState<boolean>(false)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerDone || deadline === null) {
        clearInterval(interval)
      } else {
        const timeRemaining = deadline - Date.now()
        if (timeRemaining <= 0) {
          setTimerDone(true)
          clearInterval(interval)
        }
        setTime(Math.max(timeRemaining, 0))
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, setTimerDone, timerDone]);

  // Two hooks for player A specifically
  const [moveA, setMoveA] = useState<Move | null>(null)
  useEffect(() => {
    const interval = setInterval(() => {
      if (query?.player === 'B') {
        clearInterval(interval)
      } else if (query?.player === 'A' && data?.user && utxo) {
        clearInterval(interval)  // TODO test putting it above creates any issue or not
        getMove(data!.user.password, Data.from(utxo!.datum!))
          .then((move: Move) => setMoveA(move))
          .catch((e) => { setInvalid(true); console.log(e) })
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [data, query, utxo])

  const gameCompleted = useCallback(() => {
    router.push({
      pathname: '/games/rps',
      query: {
        completed: "true",
      }
    })
  }, [router])

  const getDesiredGameUtxo = useCallback(async () => {
    const lucid: Lucid = await getLucid(data!.user.wallet)
    const utxos: UTxO[] = await lucid.utxosAt(validatorAddress)
    const queryPolicyId: string = query.policyId as string;
    for (let i = 0; i < utxos.length; i++) {
      // datum not present
      if (!(utxos[i].datum)) {
        continue;
      }
      // we want only two assets, lovelace & nft
      if (Object.keys(utxos[i].assets).length !== 2) {
        continue;
      }
      // nft amount is different than 1 (or not present)
      if (utxos[i].assets[queryPolicyId + utf8ToHex("RPS")] !== 1n) {
        continue;
      }
      return utxos[i]
    }
    return null
  }, [data, query])

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log('running timer instance')
      if (status === 'authenticated') {
        const _utxo = await getDesiredGameUtxo()
        if (_utxo) {
          if (!utxo || (JSON.stringify(utxo) !== JSON.stringify(_utxo))) {  // their is no utxo yet or we have an updated one
            setUtxo(_utxo)
            setTimerDone(false)
            // setDeadline(null)
            setWaiting(false)
          }
        } else if (utxo) {  // that means we already have utxo set but now we are unable to find it, that means game got completed
          gameCompleted()
        }

      }
    }, 12 * 1000)
    return () => clearInterval(interval)
  }, [status, utxo, getDesiredGameUtxo, gameCompleted])

  // Once a move has been made, we wait for a new UTxO.
  const Waiting = () => (
    <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
      <Spinner size='xl' />
      <Heading variant='brand' textAlign='center' mt='30px' w='400px'>
        Waiting, it will take some time till the move is reflected on blockchain.
      </Heading>
    </Flex>
  )

  const MoveComponent = (icon: IconType | null, other: boolean) => {
    return (
      <Flex direction='column' justify='flex-end' align='center' h='full'>
        {icon ? <Icon as={icon} h='50%' w='50%' /> : <Flex w='50%' h='50%' align='center' justify='center'><Spinner /></Flex>
        }
        <Heading variant='brand' mt='30px'>
          {other ? "Other players move" : "Your move"}
        </Heading>
      </Flex>
    )
  }

  // First player options.
  const PlayerA = () => {

    console.log('playera renderre')
    const getFundsBackA = async () => {

      const _utxo = await getDesiredGameUtxo()

      if (JSON.stringify(_utxo) !== JSON.stringify(utxo)) {

        setUtxo(_utxo)
        setTimerDone(false)  // this repeated pattern must be isolated or this if thing be removed
        // setDeadline(null)
        alert("Other player made a move in nick of time!")

      } else {
        const lucid: Lucid = await getLucid(data!.user.wallet)
        const datum: PlutusData = Data.from(utxo!.datum!)
        const startTime = getGameStartTime(datum)
        const duration = getGameMoveDuration(datum)
        const _deadline = Number(startTime + duration)
        const policyId = getGamePolicyId(datum)
        const tokenName = getGameTokenName(datum)
        const unit = policyId + tokenName
        const mintingPolicy = getMintingPolicy(getGameTxHash(datum), Number(getGameTxIx(datum)), hexToUtf8(tokenName))
        const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
        const tx = await lucid
          .newTx()
          .readFrom([validatorRefUtxo])
          .collectFrom([utxo!], Data.to(new Constr(2, [])))
          .addSignerKey(paymentCredential!.hash)
          .validFrom(_deadline + 1000)  // adding 1 second, though with 1 milisecond it should work but somehow doesnt... got best at 0.2 second which also felt as unreliable.
          .mintAssets({ [unit]: -1n }, Data.to(new Constr(1, [])))
          .attachMintingPolicy(mintingPolicy)
          .complete()
        const signedTx = await tx.sign().complete()
        try {
          await signedTx.submit()  // maybe some use can be made for txhash.
          gameCompleted()
        } catch (e) {
          alert("Their was an error, kindly retry. Error could have been caused by system clock not being accurate enough")
          console.log(e)
        }
      }
    }
    const playerAWin = async () => {

      const lucid: Lucid = await getLucid(data!.user.wallet)
      const datum: PlutusData = Data.from(utxo!.datum!)
      const nonce: string = await getOriginalRandomString(data!.user.password, datum)
      const policyId = getGamePolicyId(datum)
      const tokenName = getGameTokenName(datum)
      const startTime = getGameStartTime(datum)
      const duration = getGameMoveDuration(datum)
      const _deadline = Number(startTime + 2n * duration)
      const unit = policyId + tokenName
      const mintingPolicy = getMintingPolicy(getGameTxHash(datum), Number(getGameTxIx(datum)), hexToUtf8(tokenName))
      const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
      const tx = await lucid
        .newTx()
        .readFrom([validatorRefUtxo])
        .collectFrom([utxo!], Data.to(new Constr(1, [utf8ToHex(nonce), new Constr(moveToInt[moveA!], [])])))
        .addSignerKey(paymentCredential!.hash)
        .validFrom(Number(startTime) + 1000)
        .validTo(_deadline - 1000)
        .mintAssets({ [unit]: -1n }, Data.to(new Constr(1, [])))
        .attachMintingPolicy(mintingPolicy)
        .complete()
      const signedTx = await tx.sign().complete()
      try {
        await signedTx.submit()  // maybe some use can be made for txhash.
        gameCompleted()
      } catch (e) {
        alert("Their was an error, kindly retry. Error could have been caused by system clock not being accurate enough")
        console.log(e)
      }

    }

    const playerADraw = async () => {

      const lucid: Lucid = await getLucid(data!.user.wallet)
      const datum: PlutusData = Data.from(utxo!.datum!)
      const nonce: string = await getOriginalRandomString(data!.user.password, datum)
      const policyId = getGamePolicyId(datum)
      const tokenName = getGameTokenName(datum)
      const startTime = getGameStartTime(datum)
      const duration = getGameMoveDuration(datum)
      const _deadline = Number(startTime + 2n * duration)
      const unit = policyId + tokenName
      const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
      const datumWithMove = addDatumMoveA(datum, moveA!)
      const datumWithMatchResult = addDatumMatchResult(datumWithMove, "Draw")
      const tx = await lucid
        .newTx()
        .readFrom([validatorRefUtxo])
        .collectFrom([utxo!], Data.to(new Constr(1, [utf8ToHex(nonce), new Constr(moveToInt[moveA!], [])])))
        .payToContract(validatorAddress, { inline: Data.to(datumWithMatchResult) }, { lovelace: getGameStake(datum), [unit]: 1n })
        .addSignerKey(paymentCredential!.hash)
        .validFrom(Number(startTime) + 1000)
        .validTo(_deadline - 1000)
        .complete()
      const signedTx = await tx.sign().complete()
      try {
        await signedTx.submit()  // maybe some use can be made for txhash.
        gameCompleted()
      } catch (e) {
        alert("Their was an error, kindly retry. Error could have been caused by system clock not being accurate enough")
        console.log(e)
      }

    }
    // Need to see current datum
    // Their are only two cases of interest
    // When second player has not made a move, datum says the move to be Nothing
    // When second player has made a move, datum giving move.
    try {
      const datum = Data.from(utxo!.datum!);
      if (getGameSecondMoveIndex(datum) === 1) {  // we are in nothing case
        const startTime = getGameStartTime(datum)
        const duration = getGameMoveDuration(datum)
        const _deadline = Number(startTime + duration)
        if (deadline !== _deadline) setDeadline(_deadline)
        return (
          <Grid
            templateAreas={`"moveA moveB"
                            "choice choice"`}
            gridTemplateColumns={'1fr 1fr'}
            gridTemplateRows={'3fr 1fr'}
            h={`calc(100vh - ${navHeight})`}
          >
            <GridItem area={'moveA'} >
              {MoveComponent(moveA ? moveIconMap[moveA] : null, false)}
            </GridItem>
            <GridItem area={'moveB'}>
              <Flex direction='column' justify='flex-end' align='center' h='full'>
                <Heading variant='brand' mb='25px'>Time remaining</Heading>
                {Timer(time)}
                {
                  timerDone
                    ? <Heading variant='brand' textAlign='center' mt='25px'>
                      Second player timed out
                    </Heading>
                    :
                    <Heading variant='brand' textAlign='center' mt='25px'>
                      Waiting for second player to make move
                    </Heading>
                }
              </Flex>
            </GridItem>
            <GridItem area='choice'>
              {
                timerDone && (
                  <Flex justify='center' h='full' align='center'>
                    <Button {...brandButtonStyle} onClick={() => getFundsBackA()}>
                      Get your funds back
                    </Button>

                  </Flex>
                )
              }
            </GridItem>
          </Grid>
        )
      } else {  // second player has made a move
        const moveB: Move = getGameSecondMoveValue(datum)
        const startTime = getGameStartTime(datum)
        const duration = getGameMoveDuration(datum)
        const _deadline = Number(startTime + 2n * duration)
        if (deadline !== _deadline) setDeadline(_deadline)
        return (
          <Grid
            templateAreas={`"moveA moveB"
                            "choice choice"`}
            gridTemplateColumns={'1fr 1fr'}
            gridTemplateRows={'3fr 1fr'}
            h={`calc(100vh - ${navHeight})`}
          >
            <GridItem area={'moveA'} >
              {MoveComponent(moveA ? moveIconMap[moveA] : null, false)}
            </GridItem>
            <GridItem area={'moveB'}>
              {MoveComponent(moveIconMap[moveB], true)}
            </GridItem>
            <GridItem area='choice'>
              {
                !moveA
                  ? null
                  : getMatchResult(moveA!, moveB) === 'WinB'
                    ? <Heading variant='brand' textAlign='center' mt='15px'>
                      {loseString}
                    </Heading>
                    : timerDone
                      ? <Heading variant='brand' textAlign='center' mt='15px'>{timerDoneString}</Heading>
                      :
                      <Flex justify='space-between' h='full' align='center'>
                        <VStack>
                          <Heading variant='brand'>
                            Time remaining
                          </Heading>
                          <HStack>{Timer(time)}</HStack>
                        </VStack>
                        {
                          getMatchResult(moveA!, moveB) === 'WinA'
                            ? <Button {...brandButtonStyle} onClick={() => playerAWin()}>
                              {winString}
                            </Button>
                            : <Button {...brandButtonStyle} onClick={() => playerADraw()}>
                              {drawString}
                            </Button>
                        }
                      </Flex>
              }
            </GridItem>
          </Grid>
        )
      }
    } catch {
      setInvalid(true)
      return null
    }
  }

  // Second player options.
  const PlayerB = () => {

    const radioSchema = yup.object().shape({
      move: yup.string().required("Please enter your move").oneOf(moves)
    })

    const reset = () => {
      // setTimerDone(false)  // should be not required to do here if we are doing it when getting new utxo
      setWaiting(true)
    }

    const makeMoveB = async (move: Move) => {

      const lucid: Lucid = await getLucid(data!.user.wallet)
      const datum: PlutusData = Data.from(utxo!.datum!)
      const policyId = getGamePolicyId(datum)
      const tokenName = getGameTokenName(datum)
      const unit = policyId + tokenName
      const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
      // following check is not required as it is assumed but still doing
      if (utxo!.assets['lovelace'] !== getGameStake(datum)) throw "Stake amount doesn't match with that in datum"
      const startTime = getGameStartTime(datum)
      const duration = getGameMoveDuration(datum)
      const _deadline = Number(startTime + duration)
      const tx = await lucid
        .newTx()
        .readFrom([validatorRefUtxo])
        .collectFrom([utxo!], Data.to(new Constr(0, [new Constr(moveToInt[move], [])])))
        .payToContract(validatorAddress, { inline: Data.to(addDatumMoveB(datum, move)) }, { lovelace: 2n * utxo!.assets['lovelace'], [unit]: 1n })
        .addSignerKey(paymentCredential!.hash)
        .validFrom(Number(startTime) + 1000)
        .validTo(_deadline - 1000)
        .complete()
      const signedTx = await tx.sign().complete()
      try {
        await signedTx.submit()  // maybe some use can be made for txhash.
        reset()
      } catch (e) {
        alert("Their was an error, kindly retry. Error could have been caused by system clock not being accurate enough.")
        console.log(e)
      }
    }
    try {
      const datum = Data.from(utxo!.datum!);
      if (getGameSecondMoveIndex(datum) === 1) {  // We are waiting for second player to make a move
        const startTime = getGameStartTime(datum)
        const duration = getGameMoveDuration(datum)
        const _deadline = Number(startTime + duration)
        if (deadline !== _deadline) setDeadline(_deadline)
        console.log('rererere')
        return (
          <Grid
            templateAreas={`"moveA moveB"
                            "choice choice"`}
            gridTemplateColumns={'1fr 1fr'}
            gridTemplateRows={'3fr 1fr'}
            h={`calc(100vh - ${navHeight})`}
          >
            <GridItem area={'moveA'} >
              {MoveComponent(FaQuestion, true)}
            </GridItem>
            <GridItem area={'moveB'}>
              <Flex direction='column' justify='flex-end' align='center' h='full'>
                <Heading variant='brand' mb='25px'>Time remaining</Heading>
                {Timer(time)}
              </Flex>
            </GridItem>
            <GridItem area='choice'>
              <Flex justify='center' h='full' align='center'>
                {
                  timerDone
                    ?
                    <Heading variant='brand' textAlign='center'>
                      {timerDoneString}
                    </Heading>
                    :
                    <Formik
                      initialValues={{ move: '' }}
                      validationSchema={radioSchema}
                      onSubmit={async (values, actions) => {
                        await makeMoveB(values.move as Move)
                        actions.resetForm()
                      }}
                    >
                      {(props) => (
                        <Form>
                          <FormControl isInvalid={!!props.errors.move && props.touched.move} mt='10px' borderColor='black'>
                            <FormLabel textAlign='center' fontWeight='bold'>Enter your move</FormLabel>
                            <Field as={RadioGroup} name='move'>
                              <HStack spacing='15px' >
                                {moves.map((elem, ix) => (<Field as={Radio} key={ix} value={elem} borderColor='black' _checked={{ bg: 'black' }} >{elem}</Field>))}
                              </HStack>
                            </Field>
                            <FormErrorMessage>{props.errors.move}</FormErrorMessage>
                          </FormControl>
                          <Flex justify='center'>
                            <Button
                              mt={'10px'}
                              {...brandButtonStyle}
                              isLoading={props.isSubmitting}
                              type='submit'
                              mb={'10px'}
                            >
                              Submit
                            </Button>
                          </Flex>
                        </Form>
                      )}
                    </Formik>
                }
              </Flex>
            </GridItem>
          </Grid>
        )
      } else if (getGameMatchResultIndex(datum) === 1) {  // second player has made a move and match result is not determined, thus we are waiting for first player to make a move
        const aTimeoutTakeB = async () => {

          const _utxo = await getDesiredGameUtxo()

          if (JSON.stringify(_utxo) !== JSON.stringify(utxo)) {

            setUtxo(_utxo)
            setTimerDone(false)
            // setDeadline(null)
            alert("Other player made a move in nick of time!")

          } else {
            const lucid: Lucid = await getLucid(data!.user.wallet)
            const policyId = getGamePolicyId(datum)
            const startTime = getGameStartTime(datum)
            const duration = getGameMoveDuration(datum)
            const _deadline = Number(startTime + 2n * duration)
            const tokenName = getGameTokenName(datum)
            const unit = policyId + tokenName
            const mintingPolicy = getMintingPolicy(getGameTxHash(datum), Number(getGameTxIx(datum)), hexToUtf8(tokenName))
            const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
            const tx = await lucid
              .newTx()
              .readFrom([validatorRefUtxo])
              .collectFrom([utxo!], Data.to(new Constr(3, [])))
              .addSignerKey(paymentCredential!.hash)
              .validFrom(_deadline + 1000)
              .mintAssets({ [unit]: -1n }, Data.to(new Constr(1, [])))
              .attachMintingPolicy(mintingPolicy)
              .complete()
            const signedTx = await tx.sign().complete()
            try {
              await signedTx.submit()  // maybe some use can be made for txhash.
              gameCompleted()
            } catch (e) {
              alert("Their was an error, kindly retry. Error could have been caused by system clock not being accurate enough")
              console.log(e)
            }
          }
        }

        const startTime = getGameStartTime(datum)
        const duration = getGameMoveDuration(datum)
        const _deadline = Number(startTime + 2n * duration)
        if (deadline !== _deadline) setDeadline(_deadline)
        return (
          <Grid
            templateAreas={`"moveA moveB"
                            "choice choice"`}
            gridTemplateColumns={'1fr 1fr'}
            gridTemplateRows={'3fr 1fr'}
            h={`calc(100vh - ${navHeight})`}
          >
            <GridItem area={'moveA'} >
              <Flex direction='column' justify='flex-end' align='center' h='full'>
                <Heading variant='brand' mb='25px'>Time remaining</Heading>
                {Timer(time)}
                {
                  timerDone
                    ? <Heading variant='brand' textAlign='center' mt='25px'>
                      First player timed out, you won!
                    </Heading>
                    :
                    <Heading variant='brand' textAlign='center' mt='25px'>
                      Waiting for first player to make move
                    </Heading>
                }
              </Flex>
            </GridItem>
            <GridItem area={'moveB'}>
              {MoveComponent(moveIconMap[getGameSecondMoveValue(datum)], false)}
            </GridItem>
            <GridItem area='choice'>
              {
                timerDone && (
                  <Flex justify='center' h='full' align='center'>
                    <Button {...brandButtonStyle} onClick={() => aTimeoutTakeB()}>
                      Take pool funds!
                    </Button>

                  </Flex>
                )
              }
            </GridItem>
          </Grid>
        )
      } else {  // We have made a move, first player has also replied. So it is either draw or we won as game utxo still exists
        const moveA = getGameFirstMove(datum)
        const moveB = getGameSecondMoveValue(datum)
        const matchResult: MatchResult = getGameMatchResultValue(datum)

        const bEndGame = async () => {

          const lucid: Lucid = await getLucid(data!.user.wallet)
          const policyId = getGamePolicyId(datum)
          const tokenName = getGameTokenName(datum)
          const unit = policyId + tokenName
          const mintingPolicy = getMintingPolicy(getGameTxHash(datum), Number(getGameTxIx(datum)), hexToUtf8(tokenName))
          const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
          const tx = await lucid
            .newTx()
            .readFrom([validatorRefUtxo])
            .collectFrom([utxo!], Data.to(new Constr(matchResult === "Draw" ? 4 : 5, [])))
            .addSignerKey(paymentCredential!.hash)
            .mintAssets({ [unit]: -1n }, Data.to(new Constr(1, [])))
            .attachMintingPolicy(mintingPolicy)
            .complete()
          const signedTx = await tx.sign().complete()
          try {
            await signedTx.submit()  // maybe some use can be made for txhash.
            gameCompleted()
          } catch (e) {
            alert("Their was an error, kindly retry. Error could have been caused by system clock not being accurate enough")
            console.log(e)
          }
        }
        return (
          <Grid
            templateAreas={`"moveA moveB"
                            "choice choice"`}
            gridTemplateColumns={'1fr 1fr'}
            gridTemplateRows={'3fr 1fr'}
            h={`calc(100vh - ${navHeight})`}
          >
            <GridItem area={'moveA'} >
              {MoveComponent(moveIconMap[moveA], true)}
            </GridItem>
            <GridItem area={'moveB'}>
              {MoveComponent(moveIconMap[moveB], false)}
            </GridItem>
            <GridItem area='choice'>
              <Flex justify='center' h='full' align='center'>
                <Button {...brandButtonStyle} onClick={() => bEndGame()}>
                  {matchResult === 'WinB' ? winString : drawString}
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        )
      }
    } catch {
      setInvalid(true)
      return null
    }
  }

  return (
    <ValidateGate>
      {typeof (query?.policyId) !== "string" || typeof (query?.player) !== "string" || (query.player !== 'A' && query.player !== 'B')
        ? <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
          <Heading variant='brand'>
            Restricted.
          </Heading>
        </Flex>
        : invalid
          ? <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
            <Heading variant='brand'>
              You are playing an invalid game.
            </Heading>
          </Flex>
          : waiting
            ? <Waiting />
            : query.player === 'A' ? <PlayerA /> : <PlayerB />


      }
    </ValidateGate>
  )
}

export default Game
