import React, { useState} from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Box } from '@chakra-ui/react';

export function AddStateEmployeeModal({ isOpen, onClose, onSave }) {
    const [stateName, setStateName] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!stateName) {
            setError('Debe completar el nombre')
            return
        }
        onSave({ state_name: stateName });
        handleClose();
    };

    const handleClose = () => {
        setStateName('');
        setError('')
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Añadir estado de empleado</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Nombre del estado</FormLabel>
                        <Input
                            type="stateName"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                        />
                    </FormControl>
                    {error && <Box color="red.300" fontWeight="bold" mt={2}>{error}</Box>}
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleSave}
                    >
                        Guardar
                    </Button>
                    <Button variant="ghost" onClick={handleClose}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
