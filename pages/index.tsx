import { Container, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Navbar from '../components/navbar'

const Home: NextPage = () => {
  return (
    <Container maxWidth='container.md'>
      <Navbar></Navbar>
    </Container>
  )
}

export default Home
