// TODO
// - Set connect button to loading whenever it is loading (can use useeffect with dependencies)
// - Need to confirm wrong network logic, but for mainnet it should be fine.


import Logo from './logo';
import { useState, useContext, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { navHeight } from '../global-variables';
import type { User } from "next-auth"
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
  VStack,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input
} from '@chakra-ui/react';


import { FaGithub } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { SupportedWallets } from '../types/types'
import { LucidContext } from '../context/LucidContext'

import * as yup from "yup";
// import { useFormik } from 'formik'
import { Field, Form, Formik } from 'formik';

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
  const [ signUp, setSignUp] = useState<boolean>(false)
  const [ step3, setStep3 ] = useState<boolean>(false)
  const [ selectWalletTapped, setSelectWalletTapped ] = useState<boolean>(false)
  // I have two alert setup, one fires up when selected wallet is not installed in the browser and other one when enabled wallet is on wrong network
  const walletNotFound = useDisclosure()
  const cancelRefWalletNotFound = useRef(null)
  const wrongNetwork = useDisclosure()
  const cancelRefWrongNetwork = useRef(null)
  
  const resetStatus = () => {
    // why setTimeout? Well because there is a slight delay in closing of Popover.
    setTimeout(() => {
      setWalletConnected(false);
      setStep3(false);
      setSignUp(false);
      setSelectWalletTapped(false);
    }, 200)
  }
  const supportedWallets: SupportedWallets[] = ['nami', 'eternl'] 

  const createPasswordSchema = yup.object().shape({
    password: yup
      .string()
      .required('Please enter your password')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required('Please confirm your password')
  })

  const connectbuttonStyle = {
    variant: 'outline',
    borderColor: 'black',
  }

  const popoverHeaderStyle = {
    align: 'center', 
    fontWeight: 'bold',
    borderColor: 'black'
  }

  const popoverFooterStyle = {
    borderColor: 'black', 
    mt: '10px',
  }

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
      try {
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
        // In case the above connection fails, the whole component fails so I guess nothing to worry.
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
      } catch (e) {
        console.log(e);
        resetStatus();
      }
    }
  }
  
  if (status === 'loading') return (
    <Button isLoading {...connectbuttonStyle}>
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
      <Popover onClose={ resetStatus }>
        <PopoverTrigger>
          <Button {...connectbuttonStyle}>
            Connect
          </Button>
        </PopoverTrigger>
          { walletConnected === false 
            ? <PopoverContent>
                <PopoverHeader {...popoverHeaderStyle}>
                  Select wallet
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <VStack>
                    {supportedWallets.map((walletName) => (
                      <Button key={walletName} onClick={() => {setSelectWalletTapped(true);  connectWallet(walletName)}} variant='link' colorScheme='black' isLoading={selectWalletTapped}>
                        {walletName[0].toUpperCase() + walletName.slice(1)}
                      </Button>
                    ))}
                  </VStack>
                  <PopoverFooter {...popoverFooterStyle}>
                    <Text align='center'> ✤ step 1 of 3 ✤ </Text>
                  </PopoverFooter>
                </PopoverBody> 
              </PopoverContent>
            : step3 === false 
              ? <PopoverContent>
                  <PopoverHeader {...popoverHeaderStyle}>
                    Enter password
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <VStack>
                      <Button variant='link' colorScheme='black' onClick={() => { setStep3(true) }}>
                        I already have password
                      </Button>
                      <Button variant='link' colorScheme='black' onClick={() => { setStep3(true); setSignUp(true); }}>
                        Create password
                      </Button>
                    </VStack>
                    <PopoverFooter {...popoverFooterStyle}>
                      <Text align='center'> ✤ step 2 of 3 ✤ </Text>
                    </PopoverFooter>
                  </PopoverBody> 
                </PopoverContent>
              : signUp === true 
                ? <PopoverContent>
                    <PopoverHeader {...popoverHeaderStyle}>
                      Create password
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      🛈 Some games require the generation of random numbers which we store in database by encrypting it with your password (so that you can recover old games). This is the sole reason why password is required.
                      <br />
                      ⚠ Since we don&apos;t store your password but only its hash, we cannot recover it in case you lose it.
                      <Formik
                        initialValues={{ password: '', confirmPassword: '' }}
                        validationSchema={createPasswordSchema}
                        onSubmit={async (values, actions) => {
                          const walletAddress = await lucidContext!.lucid!.wallet.address()
                          const cred: User = {id: walletAddress, password: values.password}
                          // spread is used because: https://bobbyhadz.com/blog/typescript-index-signature-for-type-is-missing-in-type
                          const res = await signIn('credentials', { ...cred, redirect: false })
                          console.log(res)
                          alert(JSON.stringify({ address: walletAddress, password: values.password }, null, 2))
                          actions.resetForm()
                        }}
                      >
                        {(props) => (
                          <Form>
                            <FormControl isInvalid={!!props.errors.password && props.touched.password} mt='7px' borderColor='black'>
                              {/* <FormLabel>Enter password</FormLabel> */}
                              <Field as={Input} name='password' type='password' placeholder='Enter password' />
                              <FormErrorMessage>{props.errors.password}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!props.errors.confirmPassword && props.touched.confirmPassword} mt='7px' borderColor='black'>
                              {/* <FormLabel>Confirm password</FormLabel> */}
                              <Field as={Input} name='confirmPassword' type='password' placeholder='Confirm password' />
                              <FormErrorMessage>{props.errors.confirmPassword}</FormErrorMessage>
                            </FormControl>
                            <Flex justify='center'>
                              <Button
                                mt={4}
                                {...connectbuttonStyle}
                                isLoading={props.isSubmitting}
                                type='submit'
                              >
                                Submit
                              </Button>
                            </Flex>
                          </Form>
                        )}
                      </Formik>
                      <PopoverFooter {...popoverFooterStyle}>
                        <Text align='center'> ✤ step 3 of 3 ✤ </Text>
                      </PopoverFooter>
                    </PopoverBody> 
                  </PopoverContent>
                : <PopoverContent>
                    <PopoverHeader {...popoverHeaderStyle}>
                      Enter password
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <PopoverFooter {...popoverFooterStyle}>
                        <Text align='center'> ✤ step 3 of 3 ✤ </Text>
                      </PopoverFooter>
                    </PopoverBody> 
                  </PopoverContent>
          }
      </Popover>
    </>
  ); else return (
    <Button {...connectbuttonStyle} onClick={() => { resetStatus(); signOut({redirect: false})}}>
      Disconnect
    </Button>
  );
}
