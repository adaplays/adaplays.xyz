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
import { useState, useContext, useRef } from 'react';
import { navHeight } from 'global-variables'
import * as yup from "yup";
import { Field, Form, Formik } from 'formik';
import { LucidContext } from 'context/LucidContext'
import { brandButtonStyle } from 'theme/simple'
import ValidateGate from 'components/validate-gate'
import { Address, applyParamsToScript, Constr, Data } from 'lucid-cardano'
import type { MintingPolicy, Lucid } from 'lucid-cardano'


const JoinGame: NextPage = () => {
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Heading variant='brand'>
          Work in progress 👷.
        </Heading>
      </Flex>
    </ValidateGate>
  )
}

export default JoinGame
