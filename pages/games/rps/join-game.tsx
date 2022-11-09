import {
  Heading,
  Flex,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react'
import { navHeight } from 'global-variables'
import * as yup from "yup";
import { Field, Form, Formik } from 'formik';
import { brandButtonStyle } from 'theme/simple'
import ValidateGate from 'components/validate-gate'
import { Address, applyParamsToScript, Constr, Data, Blockfrost, Lucid, WalletApi } from 'lucid-cardano'
import type { MintingPolicy } from 'lucid-cardano'

import { validatorRefUtxo } from 'constants/games/rps/constants'
import { getLucid } from 'utils/lucid/lucid';

const JoinGame: NextPage = () => {
  // const { data } = useSession()
  // const getUtxos = async () => {
  //   const lucid = await getLucid(data!.user.wallet)
  //   console.log(await lucid.wallet.address())
  // }
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Heading variant='brand'>
          Work in progress 👷.
        </Heading>
        {/* <Button onClick={() => getUtxos()}> */}
        {/*   see your utxos */}
        {/* </Button> */}
      </Flex>
    </ValidateGate>
  )
}

export default JoinGame
