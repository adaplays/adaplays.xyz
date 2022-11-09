import {
  Box,
  Text,
  Heading,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
// import Decrypt from 'utils/decrypt'
// import Encrypt from 'utils/encrypt'
// import GenerateKey from 'utils/generate-key'
import NextLink from 'next/link'
import { brandTextBorder } from 'theme/simple'
import { AiOutlineRight } from 'react-icons/ai'

const Home: NextPage = () => {

  interface gameType {
    name: string,
    href: string,
  }
  const games: gameType[] = [
    {
      name: "Rock Paper Scissors",
      href: "/games/rps"
    }
  ]
  // async function test() {
  //   const k1 = await GenerateKey("Hello123#")
  //   const k2 = await GenerateKey("Hello123#", k1.iter, k1.iv)
  //   const e1 = await Encrypt("sourabh", k1.key)
  //   const e2 = await Encrypt("sourabh", k2.key, e1.iv)
  //   const d1 = await Decrypt(k1.key, e1.iv, e1.encrypted)
  //   const d2 = await Decrypt(k2.key, e1.iv, e1.encrypted)
  //   const d3 = await Decrypt(k2.key, e2.iv, e1.encrypted)
  //   const d4 = await Decrypt(k2.key, e2.iv, e2.encrypted)
  //   console.log(d1, d2, d3, d4)
  // }
  return (
    <>
      <Heading variant='brandUnderline' mt='30px'>
        {"⚠ Caution"}
      </Heading>
      <Text mt='10px'>
        {"Their is no guarantee that the site and the associated smart contracts are free from any security vulnerabilities. The entire code base is open source and any scrutiny is appreciated."}
      </Text>
      <Heading variant='brandUnderline' mt='30px'>
        {"🛈 Note"}
      </Heading>
      <Text mt='10px'>
        {"Currently the site is on Cardano's Preproduction test network. Kindly make sure that when interacting with this site, you are on that network."}
      </Text>
      <Box mt='30px' {...brandTextBorder} display='inline-block'>
        <Heading variant='brand' w='20px' h='28px' transform='rotate(-45deg)' display='inline-block'>
          {"🁌"}
        </Heading>
        <Heading variant='brand' display='inline' pl='4px'>
          {" Games"}
        </Heading>
      </Box>
      <List mt='10px'>
        {games.map((elem, ix) => {
          return (
            <ListItem key={ix} _hover={{ color: 'gray.600' }} >
              <ListIcon as={AiOutlineRight} />
              <NextLink href={elem.href} passHref>
                {elem.name}
              </NextLink>
            </ListItem>
          )
        })}
      </List>
    </>

  )
}

export default Home
