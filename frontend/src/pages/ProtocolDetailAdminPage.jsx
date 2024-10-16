import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../components/Navbar';
import { ContentCard } from '../components/ContentCard';
import { verifyToken } from '../api/auth/verifyToken';
import { getProtocolDetail } from '../api/protocol/protocols_functions/getProtocolDetail';
import { deleteProtocol } from '../api/protocol/protocols_functions/deleteProtocol';
import { activeProtocol } from '../api/protocol/protocols_functions/activeProtocol';
import { Box, Heading, Stack, Text, Divider, Spinner, Center, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { Footer } from '../components/Footer';
import { TextModal } from '../components/TextModal';

export function ProtocolDetailAdminPage() {

    const { protocol_id } = useParams();
    const [protocol, setProtocol] = useState(null);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const navigate = useNavigate();

    useEffect(() => {
        const getProtocol = async () => {
            try {
                const data = await getProtocolDetail(protocol_id);
                setProtocol(data);
            } catch (error) {
                console.error("Failed to fetch protocol:", error);
            }
        };

        if (protocol_id) {
            getProtocol();
        }

        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        checkToken();
    }, [navigate, protocol_id]);

    const handleAddContent = () => {
        navigate(`/admin/add_content/${protocol_id}`);
    };

    const handleEditProtocol = () => {
        navigate(`/admin/edit_protocol/${protocol.protocol_id}`, {state: {protocol: protocol}});
    };

    const handleClick = () => {
        setLoading(true);
        setTitle(protocol.active ? 'Eliminar protocolo' : 'Activar protocolo');
        setMessage(protocol.active ? '¿Estás seguro que quieres eliminar el protocolo?' : '¿Estás seguro que quieres activar el protocolo?');
        onTextOpen();
    };

    const handleDeleteProtocol = async () => {
        onTextClose();
        try {
            await deleteProtocol(protocol_id);
            setTitle('Protocolo eliminado');
            setMessage('El protocolo se ha eliminado correctamente');
            onConfirmOpen();
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde');
            onConfirmOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleActiveProtocol = async () => {
        onTextClose();
        try {
            await activeProtocol(protocol_id);
            setTitle('Protocolo activado');
            setMessage('El protocolo se ha activado correctamente');
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

    if (!protocol) {
        return (
            <>
                <NavBar />
                <Center minHeight="100vh">
                    <Spinner size="xl" />
                </Center>
            </>
        );
    }

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box flex="1" pt={24} px={6} pb={16}>
                <Stack direction="row" spacing={4} my={4}>
                    <Button colorScheme="teal" onClick={handleAddContent}>
                        <Text fontSize="sm" color="white">
                            Agregar contenido
                        </Text>
                    </Button>
                    <Button colorScheme="blue" onClick={handleEditProtocol}>
                        <Text fontSize="sm" color="white">
                            Editar protocolo
                        </Text>
                    </Button>
                    <Button isLoading={loading} colorScheme={protocol.active ? 'red' : 'green'} onClick={handleClick}>
                        <Text fontSize="sm" color="white">
                            {protocol.active ? 'Eliminar Protocolo' : 'Activar Protocolo'}
                        </Text>
                    </Button>
                </Stack>
                <Stack spacing={4} bg="white" boxShadow="lg" borderRadius="lg" p={6}>
                    <Heading as="h1" size="xl">{protocol.title}</Heading>
                    <Text fontSize="md" color="gray.600">
                        {protocol.author} - {protocol.category_name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Fecha de creación: {new Date(protocol.created_date).toLocaleDateString()}
                    </Text>
                    <Text fontSize="lg" mt={2} mb={2}>
                        {protocol.summary}
                    </Text>
                    <Divider />
                    {protocol.content.length > 0 ? (
                        <Box>
                            {protocol.content.map((content) => (
                                <ContentCard key={content.content_id} content={content} isAdmin={true}/>
                            ))}
                        </Box>
                    ) : (
                        <Text>Este protocolo aún no tiene contenido disponible.</Text>
                    )}
                </Stack>
            </Box>
            <TextModal
                isOpen={isTextOpen}
                onClose={onTextClose}
                onClick={protocol.active ? handleDeleteProtocol : handleActiveProtocol}
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
