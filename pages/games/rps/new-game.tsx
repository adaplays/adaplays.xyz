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
  NumberInput,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useState, useContext, useRef } from 'react';
import { navHeight } from 'global-variables'
import * as yup from "yup";
import { Field, Form, Formik } from 'formik';
import { LucidContext } from 'context/LucidContext'
import { brandButtonStyle } from 'theme/simple'
import ValidateGate from 'components/validate-gate'

const NewGame: NextPage = () => {
  const lucidContext = useContext(LucidContext)
  type Move = "Rock" | "Paper" | "Scissors"
  const moves: Move[] = ["Rock", "Paper", "Scissors"]
  const createGameSchema = yup.object().shape({
    playerB: yup.string().required("Please enter other player's address"),
    stake: yup.number().required("Please enter stake ada amount").integer().min(2, "Atleast 2 ada must be staked"),
    move: yup.string().required("Please enter your move").oneOf(moves)
  })
  return (
    <ValidateGate>
      <Flex direction='column' justify='center' h={`calc(100vh - ${navHeight})`} align='center'>
        <Formik
          initialValues={{ playerB: '', stake: '', move: '' }}
          validationSchema={createGameSchema}
          onSubmit={async (values, actions) => {
            console.log(values)
            // const walletAddress = await lucidContext!.lucid!.wallet.address()
            // const cred: User = { id: walletAddress, password: values.password }
            // spread is used because: https://bobbyhadz.com/blog/typescript-index-signature-for-type-is-missing-in-type
            actions.resetForm()
          }}
        >
          {(props) => (
            <Form>
              <FormControl isInvalid={!!props.errors.playerB && props.touched.playerB} mt='7px' borderColor='black'>
                <FormLabel>Enter the address of second player</FormLabel>
                <Field as={Input} name='playerB' type='text' />
                <FormErrorMessage>{props.errors.playerB}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!props.errors.stake && props.touched.stake} mt='7px' borderColor='black'>
                <FormLabel>Enter ada stake amount</FormLabel>
                <Field as={Input} name='stake' type='number' />
                <FormErrorMessage>{props.errors.stake}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!props.errors.move && props.touched.move} mt='7px' borderColor='black'>
                <FormLabel>Enter your move</FormLabel>
                <Field as={RadioGroup} name='move'>
                  <HStack>
                    {moves.map((elem, ix) => (<Field as={Radio} key={ix} value={elem}>{elem}</Field>))}
                  </HStack>
                </Field>
                <FormErrorMessage>{props.errors.move}</FormErrorMessage>
              </FormControl>
              <Flex justify='center'>
                <Button
                  mt={4}
                  {...brandButtonStyle}
                  isLoading={props.isSubmitting}
                  type='submit'
                >
                  Submit
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </ValidateGate>
  )
}

export default NewGame
