import Logo from './logo';
import { useState } from 'react';
import NextLink from 'next/link';
import '@fontsource/jetbrains-mono';
import { navHeight } from '../global-variables';

import {
  Box,
  Flex,
  Text,
  Icon,
  Link,
  HStack,
} from '@chakra-ui/react';


import { FaGithub } from 'react-icons/fa';

export default function Navbar() {
  const [logoHover, setLogoHover] = useState<boolean>(false);
  return (
    <Flex
      position="sticky"
      top="0"
      zIndex='docked'
      bg="white"
      borderBottom={1}
      borderStyle='solid'
      borderColor='black'
      h={navHeight}
      align='center'
      justify='space-between'
    >
      {/* Logo */}
      <NextLink href="/" passHref>
        <Link
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <HStack>
            <Text fontFamily='JetBrains Mono' fontWeight='bold' fontSize='xl' position='relative' left='10px' bg='white' zIndex='1' borderRightRadius='full'>
              adaplays
            </Text>
            <Logo/>
          </HStack>
          {/* <Logo logoHover={logoHover} /> */}
        </Link>
      </NextLink>
      <HStack mr='10px'>
        <NextLink href='https://www.github.com/sourabhxyz' passHref>
          <Box 
            borderColor='white'  // to hide it
            borderBottomWidth='2px'
            cursor='pointer'
            _hover={{
              borderColor:'black', borderBottomWidth: '2px'
            }}
            >
            <Icon pt='10px' height='36px' width='36px' as={FaGithub}></Icon>
          </Box>
        </NextLink>
      </HStack>
    </Flex>
  );
}

