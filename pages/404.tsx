import { Container, Heading, Flex } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Navbar from '../components/navbar'
import { navHeight } from '../global-variables'

const FourOhFour: NextPage = () => {
  return (
    <Container maxWidth='container.md'>
      <Navbar/>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Heading fontSize='xl'> 
          404 | This page could not be found
        </Heading>
      </Flex>
    </Container>
  )
}

export default FourOhFour
