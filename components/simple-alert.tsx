import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { MutableRefObject } from 'react';

export type SimpleAlertProps = {
  isOpen: boolean,
  onClose: () => void,
  cancelRef: MutableRefObject<null>,
  message: string
}

const SimpleAlert = ({ isOpen, onClose, cancelRef, message }: SimpleAlertProps) => {
  return (
    <AlertDialog
      motionPreset='slideInBottom'
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent pb='10px'>
        <AlertDialogHeader>Error</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          {message}
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SimpleAlert
