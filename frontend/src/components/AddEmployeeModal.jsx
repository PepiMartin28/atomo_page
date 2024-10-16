import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';

export function AddEmployeeModal({ isOpen, onClose, onSave, groups }) {
    const [email, setEmail] = useState('');
    const [group_id, setGroup_id] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [emailError, setEmailError] = useState('');

    // Regex para validar el formato de un email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        const isEmailValid = emailRegex.test(email);
        setIsFormValid(isEmailValid && group_id !== '');
        setEmailError(isEmailValid ? '' : 'Por favor ingrese un correo electrónico válido');
    }, [email, group_id]);

    const handleSave = () => {
        if (isFormValid) {
            onSave({ email, group_id });
            handleClose();
        }
    };

    const handleClose = () => {
        setEmail('');
        setGroup_id('');
        setEmailError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Añadir empleado</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired isInvalid={email && emailError}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                    </FormControl>

                    <FormControl isRequired mt={4}>
                        <FormLabel>Grupo</FormLabel>
                        <Select
                            placeholder="Seleccione un grupo"
                            value={group_id}
                            onChange={(e) => setGroup_id(e.target.value)}
                        >
                            {groups.map((group) => (
                                <option key={group.group_id} value={group.group_id}>
                                    {group.group_name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleSave}
                        isDisabled={!isFormValid} 
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
