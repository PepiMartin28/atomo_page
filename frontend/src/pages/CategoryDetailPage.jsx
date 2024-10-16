import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Flex, Spinner, Stack, Divider, Button, Badge, useDisclosure } from '@chakra-ui/react';
import { NavBar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TextModal } from '../components/TextModal';
import { AssociateProtocolsModal } from '../components/AssociateProtocolsModal';
import { getCategory } from '../api/protocol/category_functions/getCategory';
import { deleteCategory } from '../api/protocol/category_functions/deleteCategory';
import { activeCategory } from '../api/protocol/category_functions/activeCategory';
import { activeRelationship } from '../api/protocol/category_functions/activeRelationship';
import { deleteRelationship } from '../api/protocol/category_functions/deleteRelationship';
import { verifyToken } from '../api/auth/verifyToken';

export function CategoryDetailPage() {
    const { category_id } = useParams();
    const [category, setCategory] = useState(null);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            setLoading(true);
            try {
                const response = await getCategory(category_id);
                setCategory(response);
            } catch (error) {
                console.error('Failed to fetch category details:', error);
            } finally {
                setLoading(false);
            }
        };
        
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        checkToken();
        fetchCategoryDetails();
    }, [category_id]);

    const handleEditCategory = () => {
        navigate(`/admin/categories/edit_category/${category.category_id}`, { state: { category } });
    };

    const handleProtocolsAssociated = () => {
        setMessage('Protocolos asociados correctamente.');
        setTitle('Asociación exitosa');
        onConfirmOpen();
    };

    const handleCategoryAction = () => {
        setLoading(true);
        setTitle(category.active ? 'Eliminar categoría' : 'Activar categoría');
        setMessage(category.active ? '¿Estás seguro que quieres eliminar la categoría?' : '¿Estás seguro que quieres activar la categoría?');
        onTextOpen();
    };

    const handleProtocolAction = (protocol) => {
        setSelectedProtocol(protocol);
        setLoading(true);
        setTitle(protocol.relationship_state ? 'Eliminar relación' : 'Activar relación');
        setMessage(protocol.relationship_state ? '¿Estás seguro que quieres eliminar la relación?' : '¿Estás seguro que quieres activar la relación?');
        onTextOpen();
    };

    const handleCategoryUpdate = async () => {
        onTextClose();
        try {
            if (category.active) {
                await deleteCategory(category.category_id);
                setTitle('Categoría eliminada');
                setMessage('La categoría se ha eliminado correctamente');
            } else {
                await activeCategory(category.category_id);
                setTitle('Categoría activada');
                setMessage('La categoría se ha activado correctamente');
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

    const handleRelationshipUpdate = async () => {
        onTextClose();
        try {
            if (selectedProtocol.relationship_state) {
                await deleteRelationship(category.category_id, selectedProtocol.protocol_id);
                setTitle('Relación eliminada');
                setMessage('La relación se ha eliminado correctamente');
            } else {
                await activeRelationship(category.category_id, selectedProtocol.protocol_id);
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

    if (!category) {
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
                    <Button colorScheme="blue" onClick={handleEditCategory}>
                        Editar categoría
                    </Button>
                    <Button
                        isLoading={loading}
                        colorScheme={category.active ? 'red' : 'green'}
                        onClick={handleCategoryAction}
                    >
                        {category.active ? 'Eliminar categoría' : 'Activar categoría'}
                    </Button>
                </Stack>
                <Stack spacing={4} bg="white" boxShadow="lg" borderRadius="lg" p={6}>
                    <Heading as="h1" size="xl">{category.category_name}</Heading>
                    <Text fontSize="lg">
                        {category.description}
                    </Text>
                    <Text fontSize="sm">
                        Fecha de creación: {new Date(category.created_date).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm">
                        Fecha de ultima modificación: {new Date(category.created_date).toLocaleDateString()}
                    </Text>
                    <Divider />
                    <Button colorScheme="blue" onClick={onSelectOpen}>
                        Asociar protocolo
                    </Button>
                    {category.protocols.length > 0 ? (
                        <Box mt={4}>
                            {category.protocols.map((protocol) => (
                                <Box key={protocol.protocol_id} mb={4} p={4} borderWidth={1} borderRadius="md">
                                    <Flex align="center" justify="space-between">
                                        <Box flex="1" mr={4}>
                                            <Heading fontSize="lg" mb={2}>
                                                {protocol.title}
                                            </Heading>
                                            <Text fontSize="md">{protocol.summary}</Text>
                                        </Box>
                                        <Flex direction="column" align="center">
                                            <Badge
                                                colorScheme={protocol.relationship_state ? 'green' : 'red'}
                                                mb={2}
                                            >
                                                {protocol.relationship_state ? 'Relación activa' : 'Relación inactiva'}
                                            </Badge>
                                            <Button
                                                isLoading={loading}
                                                colorScheme={protocol.relationship_state ? 'red' : 'green'}
                                                onClick={() => handleProtocolAction(protocol)}
                                            >
                                                {protocol.relationship_state ? 'Eliminar' : 'Activar'}
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Text mt={4}>Esta categoría aún no tiene protocolos asociados.</Text>
                    )}
                </Stack>
            </Box>
            <Footer />
            <TextModal
                isOpen={isTextOpen}
                onClose={handleConfirm}
                onClick={selectedProtocol ? handleRelationshipUpdate : handleCategoryUpdate}
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
            <AssociateProtocolsModal
                isOpen={isSelectOpen}
                onClose={onSelectClose}
                categoryId={category_id}
                onProtocolsAssociated={handleProtocolsAssociated}
            />
        </Flex>
    );
}
