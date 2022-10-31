// TODO
// - Set connect button to loading whenever it is loading (can use useeffect with dependencies)
// - Need to confirm wrong network logic, but for mainnet it should be fine.


import Logo from './logo';
import { useState, useContext, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { navHeight } from '../global-variables';
// import { useHasNamiExtension } from '../hooks/has-nami-extension'
import { Blockfrost, Lucid, WalletApi } from "lucid-cardano";
import {
  Box,
  Flex,
  Text,
  Icon,
  Link,
  HStack,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  IconButton,
} from '@chakra-ui/react';


import { FaGithub } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import type { SupportedWallets } from '../types/types'
import { LucidContext } from '../context/LucidContext'

export default function Navbar() {
  const [logoHover, setLogoHover] = useState<boolean>(false);
  const [loginOrSignup, setLoginOrSignup] = useState<boolean | undefined>(undefined);

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
            <Text fontWeight='bold' fontSize='xl' position='relative' left='10px' bg='white' zIndex='1' borderRightRadius='full'>
              adaplays
            </Text>
            <Logo/>
          </HStack>
          {/* <Logo logoHover={logoHover} /> */}
        </Link>
      </NextLink>
      <HStack mr='10px'>
        <Link isExternal aria-label='Go to adaplays Github page' href='https://www.github.com/adaplays'>
          <Icon
            as={FaGithub}
            display='block'
            transition='color 0.2s'
            color='black'
            w='7'
            h='7'
            mr='8px'
            _hover={{ color: 'gray.600' }}
          />
          {/* <IconButton aria-label='Github page' icon={<FaGithub />} colorScheme='teal' variant='link' /> */}
          {/* <Box 
            borderColor='white'  // to hide it
            borderBottomWidth='2px'
            cursor='pointer'
            _hover={{
              borderColor:'black', borderBottomWidth: '2px'
            }}
            >
            <Icon pt='10px' height='36px' width='36px' as={FaGithub}></Icon>
          </Box> */}
        </Link>
        <ConnectButton />
      </HStack>
    </Flex>
  );
}

const ConnectButton = () => {
  const { data, status } = useSession()
  const lucidContext = useContext(LucidContext)
  // const hasNamiExtension = useHasNamiExtension()
  const [walletConnected, setWalletConnected] = useState<boolean>(false)

  // I have two alert setup, one fires up when selected wallet is not installed in the browser and other one when enabled wallet is on wrong network
  const walletNotFound = useDisclosure()
  const cancelRefWalletNotFound = useRef(null)
  const wrongNetwork = useDisclosure()
  const cancelRefWrongNetwork = useRef(null)

  const supportedWallets: SupportedWallets[] = ['nami', 'eternl'] 

  // useEffect(() => {
  //   async function isEnabled() {
  //     if (hasNamiExtension)
  //       setWalletConnected(await window.cardano.nami.isEnabled())
  //   }
  //   isEnabled()
  // }, [hasNamiExtension])

  const hasWalletExtension = (walletName: SupportedWallets) => {
    switch(walletName) {
      case "nami": {
        return (!!window.cardano?.nami);
      }
      case "eternl": {
        return (!!window.cardano?.eternl);
      }
    }
  }

  const connectWallet = async (walletName: SupportedWallets) => {
    if (!hasWalletExtension(walletName)) {
      walletNotFound.onOpen();
    } else {
      let api: WalletApi | undefined = undefined
      switch(walletName) {
        case "nami": {
          api = await window.cardano.nami.enable();
          break;
        }
        case "eternl": {
          api = await window.cardano.eternl.enable();
          break;
        }
      }
      const networkId = await api.getNetworkId();
      if (networkId !== 0) {
        console.log("not on right network")
        wrongNetwork.onOpen()
      } else {
        // Assumes you are in a browser environment
        console.log('hi')
        const newLucid = await Lucid.new(
          new Blockfrost("/api/blockfrost/0", ""),  // project-id header will be set by redirect
          "Preprod"
        )
        console.log('there')
        newLucid.selectWallet(api)
        lucidContext!.setLucid(newLucid)
        setWalletConnected(await window.cardano.nami.isEnabled())
      }
    }
  }
  
  if (status === 'loading') return (
    <Button isLoading>
      Connect
    </Button>
  ); else if (status === 'unauthenticated') return (
    <>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRefWalletNotFound}
        onClose={walletNotFound.onClose}
        isOpen={walletNotFound.isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Error!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            You don&apos;t have the selected wallet installed!
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRefWrongNetwork}
        onClose={wrongNetwork.onClose}
        isOpen={wrongNetwork.isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Error!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            You have selected wrong network, please switch to Preprod!
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
      <Popover>
        <PopoverTrigger>
          <Button variant='outline' borderColor='black'>
            Connect
          </Button>
        </PopoverTrigger>
          { walletConnected === false 
            ? <PopoverContent>
                <PopoverHeader>
                  Select wallet
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  {supportedWallets.map((walletName) => (
                    <Button key={walletName} onClick={() => connectWallet(walletName)}>
                      {walletName}
                    </Button>
                  ))}
                  <PopoverFooter>
                    <Box> step 1 of 2 </Box>
                  </PopoverFooter>
                </PopoverBody> 
              </PopoverContent>
            : <PopoverContent>
                <PopoverHeader>
                  Enter password
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  Hello their!
                  <PopoverFooter>
                    <Box> step 2 of 2 </Box>
                  </PopoverFooter>
                </PopoverBody> 
              </PopoverContent>
          }
      </Popover>
    </>
  ); else return (
    <Button>
      Logout
    </Button>
  );
}
