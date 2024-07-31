import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Flex, Spinner, Stack, Divider, Button, Badge, useDisclosure } from '@chakra-ui/react';
import { getCategory } from '../api/protocol/getCategory';
import { NavBar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TextModal } from '../components/TextModal';
import { deleteCategory } from '../api/protocol/deleteCategory';
import { activeCategory } from '../api/protocol/activeCategory';

export function CategoryDetailPage() {
    const { category_id } = useParams();
    const [category, setCategory] = useState(null);
    const [protocolState, setProtocolState] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await getCategory(category_id);
                setCategory(response);
            } catch (error) {
                console.error('Failed to fetch category details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [category_id]);

    const handleEditCategory = () => {
        navigate(`/admin/categories/edit_category/${category.category_id}`, { state: { category } })
    };

    const handleToggleCategoryStatus = () => {
        console.log(category.active ? 'Eliminar categoría' : 'Activar categoría');
    };

    const handleAddProtocol = () => {
        console.log('Asociar protocolo');
    };

    const handleClick = (protocol) => {
        setIsLoading(true);
        setTitle(category.active ? 'Eliminar categoría' : 'Activar categoría');
        setMessage(category.active ? '¿Estás seguro que quieres eliminar la categoría?' : '¿Estás seguro que quieres activar la categoría?');
        onTextOpen();
    };

    const handleDeleteCategory = async () => {
        onTextClose();
        try {
            const response = await deleteCategory(category.category_id);
            setTitle('Categoría eliminada');
            setMessage('La categoría se ha eliminado correctamente');
            onConfirmOpen();
        } catch (error) {
            console.log(error)
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            onConfirmOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleActiveCategory = async () => {
        onTextClose();
        try {
            const response = await activeCategory(category.category_id);
            setTitle('Categoría activada');
            setMessage('La categoría se ha activado correctamente');
            onConfirmOpen();
        } catch (error) {
            console.log(error)
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            onConfirmOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        onConfirmClose();
        navigate('/admin/categories');
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
                        Editar Categoría
                    </Button>
                    <Button
                        isLoading={isLoading} 
                        colorScheme={category.active ? 'red' : 'green'} 
                        onClick={handleClick}
                    >
                        {category.active ? 'Eliminar Categoría' : 'Activar Categoría'}
                    </Button>
                </Stack>
                <Stack spacing={4} bg="white" boxShadow="lg" borderRadius="lg" p={6}>
                    <Heading as="h1" size="xl">{category.category_name}</Heading>
                    <Text fontSize="lg" mt={2} mb={2}>
                        {category.description}
                    </Text>
                    <Divider />
                    <Button colorScheme="blue" onClick={handleAddProtocol}>
                        Asociar Protocolo
                    </Button>
                    {category.protocols.length > 0 ? (
                        <Box mt={4}>
                            {category.protocols.map((protocol) => (
                                <Box key={protocol.protocol_id} mb={4} p={4} borderWidth={1} borderRadius="md" position="relative">
                                    <Badge 
                                        colorScheme={protocol.relationship_state ? 'green' : 'red'} 
                                        position="absolute" 
                                        top={2} 
                                        right={2}
                                    >
                                        {protocol.relationship_state ? 'Relación activa' : 'Relación inactiva'}
                                    </Badge>
                                    <Flex align="center" justify="space-between">
                                        <Box flex="1" mr={4}>
                                            <Heading fontSize="lg" mb={2}>
                                                {protocol.title}
                                            </Heading>
                                            <Text fontSize="md">{protocol.summary}</Text>
                                        </Box>
                                        <Button 
                                            isLoading={isLoading}
                                            colorScheme={protocol.relationship_state ? 'red' : 'green'} 
                                            onClick={() => handleClick(protocol)}
                                        >
                                            {protocol.relationship_state ? 'Eliminar' : 'Activar'}
                                        </Button>
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
                onClose={onTextClose}
                onClick={category.active ? handleDeleteCategory : handleActiveCategory}
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
            <Footer />
        </Flex>
        
    );
}
