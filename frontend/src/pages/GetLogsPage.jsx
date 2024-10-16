import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Stack, 
    Box, 
    Select, 
    Text, 
    Input, 
    Button, 
    Flex, 
    Spinner, 
    Heading, 
    Divider, 
    useColorModeValue, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    TableContainer 
} from '@chakra-ui/react';
import { NavBar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { verifyToken } from '../api/auth/verifyToken.js';
import { getLogs } from '../api/logs_functions/getLogs';

export function GetLogsPage() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [filters, setFilters] = useState({ email: '', sinceDate: '', dateUntil: '', action: '' });
    const [numPage, setNumPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const cardBgColor = useColorModeValue('white', 'gray.700');
    const cardBorderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
                fetchLogs();
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        checkToken();
    }, [navigate, numPage]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await getLogs(filters, numPage);
            setLogs(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const handleNextPage = () => {
        if (numPage < totalPages) {
            setNumPage(prevPage => prevPage + 1);
            fetchLogs();
        }
    };

    const handlePrevPage = () => {
        if (numPage > 1) {
            setNumPage(prevPage => prevPage - 1);
            fetchLogs();
        }
    };

    const applyFilters = () => {
        setNumPage(1);
        fetchLogs();
    };

    if (loading) {
        return (
            <>
                <Flex justify="center" align="center" height="100vh">
                    <NavBar />
                    <Spinner size="xl" />
                </Flex>
                <Footer />
            </>
        );
    }

    return (
        <Flex direction="column" minHeight="100vh" bg={bgColor}>
            <NavBar />
            <Box pt="24" pb="16" px={8}>
                <Heading mb={6} textAlign="center">Consultar Logs</Heading>
                <Stack direction={'column'} spacing={4} mb={8} bg={cardBgColor} p={6} borderRadius="md" boxShadow="md" borderWidth="1px" borderColor={cardBorderColor}>
                    <Box>
                        <Text fontSize="md" fontWeight="bold" mb={2}>Filtrar por email del empleado:</Text>
                        <Input
                            placeholder="Filtrar por email"
                            name="email"
                            value={filters.email}
                            onChange={handleFilterChange}
                        />
                    </Box>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                        <Box>
                            <Text fontSize="md" fontWeight="bold" mb={2}>Fecha desde:</Text>
                            <Input
                                type="date"
                                placeholder="Filtrar por fecha"
                                name="sinceDate"
                                value={filters.sinceDate}
                                onChange={handleFilterChange}
                            />
                        </Box>
                        <Box>
                            <Text fontSize="md" fontWeight="bold" mb={2}>Fecha hasta:</Text>
                            <Input
                                type="date"
                                placeholder="Filtrar por fecha"
                                name="dateUntil"
                                value={filters.dateUntil}
                                onChange={handleFilterChange}
                            />
                        </Box>
                    </Stack>
                    <Box>
                        <Text fontSize="md" fontWeight="bold" mb={2}>Filtrar por acción:</Text>
                        <Select
                            placeholder="Filtrar por acción"
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                        >
                            <option value="Inició sesión">Inició sesión</option>
                            <option value="Consultó un protocolo">Consultó un protocolo</option>
                        </Select>
                    </Box>
                    <Button colorScheme="blue" onClick={applyFilters} alignSelf="center" mt={4}>Aplicar Filtros</Button>
                </Stack>
                <Divider mb={6} />
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Email</Th>
                                <Th>Fecha</Th>
                                <Th>Acción</Th>
                                <Th>Protocol</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {logs.map((log, index) => (
                                <Tr key={index}>
                                    <Td>{log.email}</Td>
                                    <Td>{new Date(log.date).toLocaleDateString()}</Td>
                                    <Td>{log.description}</Td>
                                    <Td>{log.protocol_title}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Stack direction="row" justifyContent="center" alignItems="center" p={4} mt={4}>
                    {numPage > 1 && <Button onClick={handlePrevPage}>Anterior</Button>}
                    <Text mx={4}>Página {numPage} de {totalPages}</Text>
                    {numPage < totalPages && <Button onClick={handleNextPage}>Siguiente</Button>}
                </Stack>
            </Box>
            <Footer />
        </Flex>
    );
}
