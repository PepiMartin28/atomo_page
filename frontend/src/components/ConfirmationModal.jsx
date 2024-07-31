import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text } from '@chakra-ui/react';

export function ConfirmationModal({ textHeader, textBody, isOpen, onClose, onClick, type }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{textHeader}</ModalHeader>
                <ModalBody>
                    <Text>{textBody}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme={type === 'delete' ? 'red' : 'blue'} onClick={onClick}>
                        Confirmar
                    </Button>
                    <Button onClick={onClose} ml={3}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
