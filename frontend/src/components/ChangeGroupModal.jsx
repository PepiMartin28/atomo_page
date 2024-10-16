import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Select } from '@chakra-ui/react';

export function ChangeGroupModal({ isOpen, onClose, onSave, groups, currentGroup }) {
    const [selectedGroup, setSelectedGroup] = useState(currentGroup);

    const handleSave = () => {
        onSave(selectedGroup);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cambiar grupo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        {groups.map((group) => (
                            <option key={group.group_id} value={group.group_id}>
                                {group.group_name}
                            </option>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSave}>
                        Guardar
                    </Button>
                    <Button onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
