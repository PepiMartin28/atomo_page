import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/Navbar.jsx';
import { ProtocolCard } from '../components/ProtocolCard.jsx';
import { Stack, Box, Select, Text, Input, Button, Flex, Spinner } from '@chakra-ui/react';
import { verifyToken } from '../api/auth/verifyToken.js';
import { getProtocols } from '../api/protocol/protocols_functions/getProtocols.js';
import { getCategoriesByGroup } from '../api/protocol/category_functions/getCategoriesByGroup.js';
import { Footer } from '../components/Footer.jsx';

export function EmployeePage() {
    const [protocols, setProtocols] = useState([]);
    const [numPage, setNumPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
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
                const response = await getCategoriesByGroup();
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
                const response = await getProtocols(numPage, selectedCategory, searchTitle);
                setProtocols(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Failed to fetch protocols:", error);
            } finally {
                setLoading(false);
            }
        };

        listProtocols();
    }, [numPage, selectedCategory, searchTitle]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
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
            const response = await getProtocols(1, selectedCategory, searchTitle);
            setProtocols(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Failed to fetch protocols:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && (!categories.length || !protocols.length)) {
        return (
            <>
                <Flex justify="center" align="center" height="100vh">
                    <NavBar />
                    <Spinner size="xl" />
                    <Footer />
                </Flex>
            </>
        );
    }

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box flex="1" pt="24" pb="14">
                <Stack p={4}>
                    <Text>Filtrar por categoría:</Text>
                    <Select onChange={handleCategoryChange} value={selectedCategory}>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </Select>
                    <Text>Buscar por título:</Text>
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
                </Stack>
                <Stack direction="column" spacing={4} p={4}>
                    {protocols.map((protocol) => (
                        <ProtocolCard key={protocol.protocol_id} protocol={protocol} />
                    ))}
                </Stack>
                <Stack direction="row" justifyContent="center" alignItems="center" p={4}>
                    {numPage > 1 && <Button onClick={handlePrevPage}>Anterior</Button>}
                    <Text mx={4}>Página {numPage} de {totalPages}</Text>
                    {numPage < totalPages && <Button onClick={handleNextPage}>Siguiente</Button>}
                </Stack>
            </Box>
            <Footer />
        </Flex>
    );
}
