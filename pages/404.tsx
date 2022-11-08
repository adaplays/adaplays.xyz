import { Heading, Flex } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { navHeight } from '../global-variables'

const FourOhFour: NextPage = () => {
  return (
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Heading variant='brand'> 
          404 | This page could not be found
        </Heading>
      </Flex>
  )
}

export default FourOhFour
