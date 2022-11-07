import type { NextPage } from 'next'
import { Flex, Button } from '@chakra-ui/react';
import { navHeight } from 'global-variables'
import NextLink from 'next/link'
import { brandButtonStyle } from 'theme/simple'
import ValidateGate from 'components/validate-gate'

const OptionButton = ({ message, href }: { message: string, href: string }) => {
  return (
    <NextLink href={href} passHref>
      <Button as="a" {...brandButtonStyle} mt='10px' w='300px' mb='10px' h='50px'>
        {message}
      </Button>
    </NextLink>
  )
}
const Home: NextPage = () => {
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <OptionButton message={"Create a new game"} href="/games/rps/new-game" />
        <OptionButton message="Join a new game" href='/games/rps/join-game' />
        <OptionButton message="Join a previous active game" href='/games/rps/active-games' />
      </Flex>
    </ValidateGate>
  )
}

export default Home
