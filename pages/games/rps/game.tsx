import { useRouter } from 'next/router'
import ValidateGate from 'components/validate-gate'
import { Flex, Heading } from '@chakra-ui/react'
import { navHeight } from 'global-variables'

const Game = () => {
  const router = useRouter()
  const data = router.query;
  console.log(data)
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Heading variant='brand'>
          Work in progress 👷.
          Will make sure that you are able to play your game with currency symbol: {data?.policyId}
        </Heading>
        {/* <Button onClick={() => getUtxos()}> */}
        {/*   see your utxos */}
        {/* </Button> */}
      </Flex>
    </ValidateGate>
  )
}

export default Game
