import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, ModalHeader, Button, Text } from '@chakra-ui/react';

export function TextModal({ textHeader, textBody, isOpen, onClose, onClick}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{textHeader}</ModalHeader>
                <ModalBody>
                    <Text>{textBody}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClick}>
                        Aceptar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
