import {
  Flex,
  Box,
  Heading,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useEffect, useState, useCallback, useRef, Fragment } from 'react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { navHeight } from 'constants/global'
import ValidateGate from 'components/validate-gate'
import type { Lucid } from 'lucid-cardano'
import { validatorAddress } from 'constants/games/rps/constants';
import { getLucid } from 'utils/lucid/lucid';
import { useRouter } from 'next/router';
import type { Game } from 'types/games/rps/types'
import { getGameDetailsAndVerify } from 'utils/games/rps/utils'

// If UTxO types (datum etc.) are invalid then user won't be able to play it anyways because our validator is typed. So even if I don't verify the types here, user won't be able to submit anyways.

const ActiveGames: NextPage = () => {
  const router = useRouter()
  const canInsert = useRef<boolean>(true)  // to prevent race conditions when using async function inside useEffect
  const { status, data } = useSession()
  const [matchDetails, setMatchDetails] = useState<Game[]>([])
  const [found, setFound] = useState<boolean>(false)
  const findGames = useCallback(async () => {
    const lucid: Lucid = await getLucid(data!.user.wallet)
    const playerAddress = await lucid.wallet.address()
    const utxos = await lucid.utxosAt(validatorAddress)
    if (canInsert.current) {
      canInsert.current = false
      for (let i = 0; i < utxos.length; i++) {
        try {
          const gameDetails = await getGameDetailsAndVerify(lucid, utxos[i], playerAddress, data!.user.password)
          setMatchDetails(_old => [..._old, gameDetails])
        } catch {
          continue
        }
      }
      setFound(true)
    }
  }, [data])
  useEffect(() => {
    if (status === 'authenticated') {
      findGames()
    }
  }, [status, findGames])
  return (
    <ValidateGate>
      <Flex direction='column' h={`calc(100vh - ${navHeight})`}>
        {
          !found ? <Flex h='full' justify='center' align='center'><Spinner size='lg' /></Flex>
            : matchDetails.length === 0
              ? <Heading variant='brand' mt='30px'>No games found. If a game is newly created, it might take some time till it is reflected on blockchain, kindly refresh later.</Heading>
              :
              <>
                <Heading variant='brand' mt='30px'>Games found: </Heading>
                {matchDetails.map(
                  (element, index) => (
                    <Box key={index} borderWidth='1px' borderColor='black' borderRadius='md' p='7px' mt='10px' mb='10px' ml='40px' _hover={{ bg: 'gray.100', cursor: 'pointer' }} transition='background 0.15s ease-out' onClick={() =>
                      router.push({
                        pathname: '/games/rps/game',
                        query: {
                          policyId: element["Game unique identifier"],
                          player: data!.user.id === element["First player's address"] ? 'A' : 'B',
                        }
                      })}>
                      {
                        Object.entries(element).map(
                          ([key, value]) => (
                            key !== 'Game unique identifier' && (
                              <Fragment key={key}>
                                <Text fontWeight='bold' display='inline'>{key}: </Text>
                                <Text wordBreak='break-word' display='inline'>{value}</Text>
                                <br />
                              </Fragment>
                            )
                          )
                        )
                      }
                    </Box>
                  )
                )}
              </>
        }
      </Flex>
    </ValidateGate>
  )
}

export default ActiveGames
