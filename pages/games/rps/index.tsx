import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Flex, Button, Heading } from '@chakra-ui/react';
import { navHeight } from 'global-variables'
import NextLink from 'next/link'
import { brandButtonStyle } from 'theme/simple'
import ValidateGate from 'components/validate-gate'

const OptionButton = ({ message, href }: { message: string, href: string }) => {
  return (
    <NextLink href={href} passHref>
      <Button as="a" {...brandButtonStyle} mt='10px' w='350px' mb='10px' h='50px'>
        {message}
      </Button>
    </NextLink>
  )
}
const Home: NextPage = () => {
  const router = useRouter()
  const query = router.query;
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        {query?.completed === "true" && <Heading variant='brand' mb='20px'>Game is completed</Heading>}
        <OptionButton message={"Create a new game"} href="/games/rps/new-game" />
        <OptionButton message="Join an active game involving you" href='/games/rps/active-games' />
      </Flex>
    </ValidateGate>
  )
}

export default Home
