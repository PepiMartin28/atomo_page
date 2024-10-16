import { NavBar } from '../components/Navbar.jsx';
import { Box, Stack, Flex, Spinner, Heading, Button } from '@chakra-ui/react';
import { Footer } from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyToken } from '../api/auth/verifyToken.js';
import { listCategories } from '../api/protocol/category_functions/listCategories';
import { CategoryCard } from '../components/CategoryCard.jsx';

export function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        const getCategories = async () => {
            try {
                const response = await listCategories();
                setCategories(response);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
        getCategories();
    }, [navigate]);

    const handleAddCategory = () => {
        navigate("/admin/categories/add_category")
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box pt={24} px={6} textAlign="center">
                <Heading mt={4}>
                    Categorías de protocolos
                </Heading>
            </Box>
            <Button colorScheme="blue" onClick={handleAddCategory} mt={6} mx={6} >
                Añadir categoría
            </Button>
            <Box flex="1" pt={6} px={6} pb={6} mb={10}>
                {loading ? (
                    <Flex justify="center" align="center">
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Stack spacing={4}>
                        {categories.map((category) => (
                            <CategoryCard key={category.category_id} category={category} />
                        ))}
                    </Stack>
                )}
            </Box>
            <Footer />
        </Flex>
    );
}