import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../components/Navbar';
import { ContentCard } from '../components/ContentCard';
import { verifyToken } from '../api/auth/verifyToken';
import { getProtocolDetail } from '../api/protocol/protocols_functions/getProtocolDetail';
import { protocolLog } from '../api/logs_functions/protocolLog';
import { Box, Heading, Stack, Text, Divider, Spinner, Center, Flex } from '@chakra-ui/react';
import { Footer } from '../components/Footer';

export function ProtocolDetailPage() {

    const { protocol_id } = useParams();
    const [protocol, setProtocol] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getProtocol = async () => {
            try {
                const data = await getProtocolDetail(protocol_id);
                setProtocol(data);
                await protocolLog(protocol_id)
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
                                <ContentCard key={content.content_id} content={content} isAdmin={false}/>
                            ))}
                        </Box>
                    ) : (
                        <Text>Este protocolo aún no tiene contenido disponible.</Text>
                    )}
                </Stack>
            </Box>
            <Footer />
        </Flex>
    );
}
