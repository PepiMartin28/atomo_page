import { NavBar } from '../components/Navbar.jsx';
import { Box, Stack, Button, Flex, Select, Text, Input, Spinner } from '@chakra-ui/react';
import { Footer } from '../components/Footer.jsx';
import { ProtocolAdminCard } from '../components/ProtocolAdminCard.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyToken } from '../api/auth/verifyToken.js';
import { getAllProtocols } from '../api/protocol/getAllProtocols.js';
import { getAllCategories } from '../api/protocol/getAllCategories.js';

export function ProtocolPage() {
    const [protocols, setProtocols] = useState([]);
    const [numPage, setNumPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedState, setSelectedState] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        const listCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(['All', ...response]);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        checkToken();
        listCategories();
    }, [navigate]);

    useEffect(() => {
        const listProtocols = async () => {
            setLoading(true);
            try {
                const response = await getAllProtocols(numPage, selectedCategory, searchTitle, selectedState);
                setProtocols(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Failed to fetch protocols:", error);
            } finally {
                setLoading(false);
            }
        };

        listProtocols();
    }, [numPage, selectedCategory, searchTitle, selectedState]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setNumPage(1);
    };

    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
        setNumPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTitle(event.target.value);
    };

    const handleNextPage = () => {
        if (numPage < totalPages) {
            setNumPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (numPage > 1) {
            setNumPage(prevPage => prevPage - 1);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        setProtocols([]);
        try {
            const response = await getAllProtocols(1, selectedCategory, searchTitle, selectedState);
            setProtocols(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Failed to fetch protocols:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProtocol = () => {
        navigate('/admin/add_protocol');
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box flex="1" pt={24} px={6} pb={16}>
                <Stack spacing={6}>
                    <Stack spacing={4} pt={4}>
                        <Text fontSize="lg" fontWeight="bold">Filtrar por categoría:</Text>
                        <Select onChange={handleCategoryChange} value={selectedCategory}>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </Select>
                        <Text fontSize="lg" fontWeight="bold">Filtrar por estado:</Text>
                        <Select onChange={handleStateChange} value={selectedState}>
                            <option value="">Todos</option>
                            <option value="Active">Activo</option>
                            <option value="Inactive">Inactivo</option>
                        </Select>
                        <Text fontSize="lg" fontWeight="bold">Buscar por título:</Text>
                        <Input placeholder="Ingrese el título del protocolo" onChange={handleSearchChange} value={searchTitle} />
                        <Button
                            mt={2}
                            onClick={handleSearch}
                            type="button"
                            width="100%"
                            color="white"
                            background="red.500"
                            fontSize="lg"
                            _hover={{ bg: 'red.700', color: 'white' }}
                            isLoading={loading}
                            isDisabled={loading}
                        >
                            Filtrar
                        </Button>
                        <Button
                            mt={2}
                            onClick={handleAddProtocol}
                            type="button"
                            width="100%"
                            color="white"
                            background="green.500"
                            fontSize="lg"
                            _hover={{ bg: 'green.700', color: 'white' }}
                        >
                            Agregar nuevo protocolo
                        </Button>
                    </Stack>
                    <Stack spacing={4}>
                        {loading ? (
                            <Flex justify="center" align="center">
                                <Spinner size="xl" />
                            </Flex>
                        ) : (
                            protocols.map((protocol) => (
                                <ProtocolAdminCard key={protocol.protocol_id} protocol={protocol} />
                            ))
                        )}
                    </Stack>
                    <Flex justify="center" align="center">
                        <Stack direction="row" justifyContent="center" alignItems="center" p={4}>
                            {numPage > 1 && <Button onClick={handlePrevPage}>Anterior</Button>}
                            <Text mx={4}>Página {numPage} de {totalPages}</Text>
                            {numPage < totalPages && <Button onClick={handleNextPage}>Siguiente</Button>}
                        </Stack>
                    </Flex>
                </Stack>
            </Box>
            <Footer />
        </Flex>
    );
}
