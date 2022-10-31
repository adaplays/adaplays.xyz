import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { Text } from '@chakra-ui/react';

const Home: NextPage = () => {
  const { data, status } = useSession()

  if (status === 'unauthenticated') 
    return (
      <Text>
        Aye, kindly connect first!
      </Text>
    ); 
  else if (status === 'loading') 
    return (
      <Text>
        Loading
      </Text>
    );
  return (<Text>Welcome boss</Text>);
}

export default Home
