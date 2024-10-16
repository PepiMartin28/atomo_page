import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Checkbox, CheckboxGroup, Stack, Spinner } from '@chakra-ui/react';
import { getUnassociatedProtocols } from '../api/protocol/category_functions/getUnassociatedProtocols';
import { associateProtocols } from '../api/protocol/category_functions/associateProtocols';

export function AssociateProtocolsModal({ isOpen, onClose, categoryId, onProtocolsAssociated }) {
    const [unassociatedProtocols, setUnassociatedProtocols] = useState([]);
    const [selectedProtocols, setSelectedProtocols] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchProtocols = async () => {
                setLoading(true);
                try {
                    const response = await getUnassociatedProtocols(categoryId);
                    setUnassociatedProtocols(response);
                } catch (error) {
                    console.error('Failed to fetch unassociated protocols:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProtocols();
        }
    }, [isOpen, categoryId]);

    const handleProtocolSelection = (selectedIds) => {
        setSelectedProtocols(selectedIds);
    };

    const handleAssociate = async () => {
        setLoading(true);
        try {
            await associateProtocols(categoryId, selectedProtocols);
            onProtocolsAssociated();
            onClose();
        } catch (error) {
            console.error('Failed to associate protocols:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Seleccionar protocolos</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Spinner size="xl" />
                    ) : (
                        <CheckboxGroup value={selectedProtocols} onChange={handleProtocolSelection}>
                            <Stack spacing={4}>
                                {unassociatedProtocols.map((protocol) => (
                                    <Checkbox key={protocol.protocol_id} value={protocol.protocol_id.toString()}>
                                        {protocol.title}
                                    </Checkbox>
                                ))}
                            </Stack>
                        </CheckboxGroup>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleAssociate} isLoading={loading}>
                        Asociar protocolos
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
