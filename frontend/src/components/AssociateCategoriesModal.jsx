import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Checkbox, CheckboxGroup, Stack, Spinner } from '@chakra-ui/react';
import { getUnassociatedCategories } from '../api/employee/groups_functions/getUnassociatedCategories'
import { associateCategories } from '../api/employee/groups_functions/associateCategories';

export function AssociateCategoriesModal({ isOpen, onClose, groupId, onCategoriesAssociated }) {
    const [unassociatedCategories, setUnassociatedCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                setLoading(true);
                try {
                    const response = await getUnassociatedCategories(groupId);
                    setUnassociatedCategories(response);
                } catch (error) {
                    console.error('Failed to fetch unassociated protocols:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCategories();
        }
    }, [isOpen, groupId]);

    const handleCategorySelection = (selectedIds) => {
        setSelectedCategories(selectedIds);
    };

    const handleAssociate = async () => {
        setLoading(true);
        try {
            await associateCategories(groupId, selectedCategories);
            onCategoriesAssociated();
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
                <ModalHeader>Seleccionar categorias</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Spinner alignContent='center' size="xl" />
                    ) : (
                        <CheckboxGroup value={selectedCategories} onChange={handleCategorySelection}>
                            <Stack spacing={4}>
                                {unassociatedCategories.map((category) => (
                                    <Checkbox key={category.category_id} value={category.category_id.toString()}>
                                        {category.category_name}
                                    </Checkbox>
                                ))}
                            </Stack>
                        </CheckboxGroup>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleAssociate} isLoading={loading}>
                        Asociar categorias
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
