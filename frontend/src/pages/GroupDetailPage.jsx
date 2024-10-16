import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Flex, Spinner, Stack, Divider, Button, Badge, useDisclosure } from '@chakra-ui/react';
import { NavBar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TextModal } from '../components/TextModal';
import { getGroup } from '../api/employee/groups_functions/getGroup'
import { deleteGroup } from '../api/employee/groups_functions/deleteGroup'
import { activeGroup } from '../api/employee/groups_functions/activeGroup'
import { activeRelationship } from '../api/employee/groups_functions/activeRelationship'
import { deleteRelationship } from '../api/employee/groups_functions/deleteRelationship'
import { verifyToken } from '../api/auth/verifyToken';
import { AssociateCategoriesModal } from '../components/AssociateCategoriesModal';

export function GroupDetailPage() {
    const { group_id } = useParams();
    const [group, setGroup] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await getGroup(group_id);
                setGroup(response);
            } catch (error) {
                console.error('Failed to fetch group details:', error);
            }
        };
        
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        fetchGroupDetails();
        checkToken();
    }, [navigate, group_id]);

    const handleEditGroup = () => {
        navigate(`/admin/groups/edit_group/${group_id}`, { state: { group } });
    };

    const handleGroupAction = () => {
        setLoading(true);
        setTitle(group.active ? 'Eliminar grupo' : 'Activar grupo');
        setMessage(group.active ? '¿Estás seguro que quieres eliminar el grupo?' : '¿Estás seguro que quieres activar el grupo?');
        onTextOpen();
    };

    const handleGroupUpdate = async () => {
        onTextClose();
        try {
            if (group.active) {
                await deleteGroup(group_id);
                setTitle('Grupo eliminado');
                setMessage('El grupo se ha eliminado correctamente');
            } else {
                await activeGroup(group_id);
                setTitle('Grupo activado');
                setMessage('El grupo se ha activado correctamente');
            }
            onConfirmOpen();
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            onConfirmOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryAction = (category) => {
        setSelectedCategory(category);
        setLoading(true);
        setTitle(category.relationship_state ? 'Eliminar relación' : 'Activar relación');
        setMessage(category.relationship_state ? '¿Estás seguro que quieres eliminar la relación?' : '¿Estás seguro que quieres activar la relación?');
        onTextOpen();
    };

    const handleRelationshipUpdate = async () => {
        onTextClose();
        try {
            if (selectedCategory.relationship_state) {
                await deleteRelationship(group.group_id, selectedCategory.category_id);
                setTitle('Relación eliminada');
                setMessage('La relación se ha eliminado correctamente');
            } else {
                await activeRelationship(group.group_id, selectedCategory.category_id);
                setTitle('Relación activada');
                setMessage('La relación se ha activado correctamente');
            }
            onConfirmOpen();
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            onConfirmOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        onConfirmClose();
        window.location.reload();
    };

    const handleCategoriesAssociated = () => {
        setMessage('Categorias asociadas correctamente.');
        setTitle('Asociación exitosa');
        onConfirmOpen();
    };

    if (!group) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box flex="1" pt={24} px={6} pb={16}>
                <Stack direction="row" spacing={4} my={4}>
                    <Button colorScheme="blue" onClick={handleEditGroup}>
                        Editar grupo
                    </Button>
                    <Button
                        isLoading={loading}
                        colorScheme={group.active ? 'red' : 'green'}
                        onClick={handleGroupAction}
                    >
                        {group.active ? 'Eliminar grupo' : 'Activar grupo'}
                    </Button>
                </Stack>
                <Stack spacing={4} bg="white" boxShadow="lg" borderRadius="lg" p={6}>
                    <Heading as="h1" size="xl">{group.group_name}</Heading>
                    <Text fontSize="lg">
                        {group.description}
                    </Text>
                    <Text fontSize="md">
                        Nivel de acceso: {group.access_type}
                    </Text>
                    <Text fontSize="sm">
                        Fecha de creación: {new Date(group.created_date).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm">
                        Fecha de ultima modificación: {new Date(group.updated_date).toLocaleDateString()}
                    </Text>
                    <Divider />
                    <Button colorScheme="blue" onClick={onSelectOpen}>
                        Asociar categoría
                    </Button>
                    {group.categories.length > 0 ? (
                        <Box mt={4}>
                            {group.categories.map((category) => (
                                <Box key={category.category_id} mb={4} p={4} borderWidth={1} borderRadius="md">
                                    <Flex align="center" justify="space-between">
                                        <Box flex="1" mr={4}>
                                            <Heading fontSize="lg" mb={2}>
                                                {category.category_name}
                                            </Heading>
                                            <Text fontSize="md">{category.description}</Text>
                                        </Box>
                                        <Flex direction="column" align="center">
                                            <Badge
                                                colorScheme={category.relationship_state ? 'green' : 'red'}
                                                mb={2}
                                            >
                                                {category.relationship_state ? 'Relación activa' : 'Relación inactiva'}
                                            </Badge>
                                            <Button
                                                isLoading={loading}
                                                colorScheme={category.relationship_state ? 'red' : 'green'}
                                                onClick={() => handleCategoryAction(category)}
                                            >
                                                {category.relationship_state ? 'Eliminar' : 'Activar'}
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Text mt={4}>Este grupo aún no tiene categorias asociadas.</Text>
                    )}
                </Stack>
            </Box>
            <Footer />
            <TextModal
                isOpen={isTextOpen}
                onClose={handleConfirm}
                onClick={selectedCategory ? handleRelationshipUpdate : handleGroupUpdate}
                textBody={message}
                textHeader={title}
            />
            <TextModal
                isOpen={isConfirmOpen}
                onClose={handleConfirm}
                onClick={handleConfirm}
                textBody={message}
                textHeader={title}
            />
            <AssociateCategoriesModal
                isOpen={isSelectOpen}
                onClose={onSelectClose}
                groupId={group_id}
                onCategoriesAssociated={handleCategoriesAssociated}
            />
        </Flex>
    );
}
