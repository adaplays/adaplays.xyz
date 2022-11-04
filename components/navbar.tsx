// TODO
// - All the preview, preprod & testnet have same id of 0, so logic should be fine only when mainnet is desired.

import type { User } from "next-auth"
import type { SupportedWallets } from '../types/types'

import { useState, useContext, useRef } from 'react';
import NextLink from 'next/link';
import { navHeight } from '../global-variables';
import { Blockfrost, Lucid, WalletApi } from "lucid-cardano";
import {
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
  VStack,
  FormControl,
  FormErrorMessage,
  Input
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LucidContext } from '../context/LucidContext'
import SimpleAlert from './simple-alert';
import { Field, Form, Formik } from 'formik';
import Logo from './logo';
import * as yup from "yup";
import YupPassword from 'yup-password'
YupPassword(yup)

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
            <Text fontWeight='bold' fontSize='xl' position='relative' left='10px' bg='white' zIndex='1' borderRightRadius='full'>
              adaplays
            </Text>
            <Logo />
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
  const { status } = useSession()
  const lucidContext = useContext(LucidContext)
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [selectWalletTapped, setSelectWalletTapped] = useState<boolean>(false)
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false)

  // I have two alert setup, one fires up when selected wallet is not installed in the browser and other one when enabled wallet is on wrong network
  const walletNotFound = useDisclosure()
  const cancelRefWalletNotFound = useRef(null)
  const wrongNetwork = useDisclosure()
  const cancelRefWrongNetwork = useRef(null)

  const resetStatus = () => {
    // why setTimeout? Well because there is a slight delay in closing of Popover.
    setTimeout(() => {
      setWalletConnected(false);
      setSelectWalletTapped(false);
    }, 200)
  }
  const supportedWallets: SupportedWallets[] = ['nami', 'eternl']

  const createPasswordSchema = yup.object().shape({
    password: yup
      .string()
      .required('Please enter your password')
      .min(10, "Must be atleast 10 characters")  // following recommendation from: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
      .max(32, "Must be atmost 32 characters")
      .minLowercase(1, "Must contain atleast 1 lowercase character")
      .minUppercase(1, "Must contain atleast 1 uppercase character")
      .minNumbers(1, "Must contain atleast 1 number")
      .minSymbols(1, "Must contain atleast 1 special case character"),
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

  const hasWalletExtension = (walletName: SupportedWallets) => {
    switch (walletName) {
      case "nami": {
        return (!!window.cardano?.nami);
      }
      case "eternl": {
        return (!!window.cardano?.eternl);
      }
    }
  }

  const disconnecting = async () => {
    setIsDisconnecting(true);
    resetStatus();
    await signOut({ redirect: false });  
    setIsDisconnecting(false);
  }

  const connectWallet = async (walletName: SupportedWallets) => {
    if (!hasWalletExtension(walletName)) {
      walletNotFound.onOpen();
    } else {
      try {
        let api: WalletApi | undefined = undefined
        switch (walletName) {
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
          wrongNetwork.onOpen()
        } else {
          // Assumes you are in a browser environment
          const newLucid = await Lucid.new(
            new Blockfrost("/api/blockfrost/0", ""),  // project-id header will be set by redirect
            "Preprod"
          )
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
      <SimpleAlert {...{ isOpen: walletNotFound.isOpen, onClose: walletNotFound.onClose, cancelRef: cancelRefWalletNotFound, message: "You don't have the selected wallet installed." }} />
      <SimpleAlert {...{ isOpen: wrongNetwork.isOpen, onClose: wrongNetwork.onClose, cancelRef: cancelRefWrongNetwork, message: "You have selected wrong network, please switch to Preprod." }} />
      <Popover onClose={resetStatus}>
        <PopoverTrigger>
          <Button {...connectbuttonStyle}>
            Connect
          </Button>
        </PopoverTrigger>
        {walletConnected === false
          ? <PopoverContent>
            <PopoverHeader {...popoverHeaderStyle}>
              Select wallet
            </PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <VStack>
                {supportedWallets.map((walletName) => (
                  <Button key={walletName} onClick={() => { setSelectWalletTapped(true); connectWallet(walletName) }} variant='link' colorScheme='black' isLoading={selectWalletTapped}>
                    {walletName[0].toUpperCase() + walletName.slice(1)}
                  </Button>
                ))}
              </VStack>
              <PopoverFooter {...popoverFooterStyle}>
                <Text align='center'> ✤ step 1 of 2 ✤ </Text>
              </PopoverFooter>
            </PopoverBody>
          </PopoverContent>
          : <PopoverContent>
            <PopoverHeader {...popoverHeaderStyle}>
              Create session password
            </PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              {"🛈 Some games require the generation of secret numbers. For the convenience of user, instead of writing down all your secret numbers, they'll be effectively encrypted with the help of your password. Also, in case such a game couldn't be completed, say due to power outage, your password will be later used to recover it."}
              <br />
              {"⚠ We don't store your password. If you specify a different password for this session then you won't be able to recover any previous unfinished games that require the use of password."}
              <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={createPasswordSchema}
                onSubmit={async (values, actions) => {
                  const walletAddress = await lucidContext!.lucid!.wallet.address()
                  const cred: User = { id: walletAddress, password: values.password }
                  // spread is used because: https://bobbyhadz.com/blog/typescript-index-signature-for-type-is-missing-in-type
                  await signIn('credentials', { ...cred, redirect: false })
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
                <Text align='center'> ✤ step 2 of 2 ✤ </Text>
              </PopoverFooter>
            </PopoverBody>
          </PopoverContent>
        }
      </Popover>
    </>
  ); else return (
    <Button {...connectbuttonStyle} onClick={() =>  disconnecting()} isLoading={isDisconnecting} >
      Disconnect
    </Button>
  );
}
