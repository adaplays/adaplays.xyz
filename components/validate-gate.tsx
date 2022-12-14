import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { Heading, Flex, Spinner } from '@chakra-ui/react';
import { navHeight } from 'constants/global'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const ValidateGate: NextPage<Props> = ({ children }) => {

  const { status } = useSession()

  if (status === 'unauthenticated')
    return (
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Heading variant='brand'>
          Restricted: Kindly connect first.
        </Heading>
      </Flex>
    );
  else if (status === 'loading')
    return (
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Heading variant='brand'>
          <Spinner />
        </Heading>
      </Flex>
    );
  else {
    return (
      <>{children}</>
    );
  }
}

export default ValidateGate
