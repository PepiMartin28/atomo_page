import { useEffect } from 'react';
import { NavBar } from '../components/Navbar.jsx';
import { Box, Stack, Button, Heading, Flex } from '@chakra-ui/react';
import { Footer } from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/auth/verifyToken';

const navigation = [
    { name: 'Empleados', href: '/admin/employees' },
    { name: 'Estado de empleado', href: '/admin/stateEmployee' },
    { name: 'Grupos de empleados', href: '/admin/groups' },
    { name: 'Protocolos', href: '/admin/protocols' },
    { name: 'Categoría de protocolos', href: '/admin/categories' },
    { name: 'Consultar logs', href: '/admin/logs' }
];

export function AdminPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        checkToken();
    }, [navigate]);

    const handleNavClick = (href) => {
        navigate(href);
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box flex="1" px={6} pt={24}>
                <Stack spacing={8} align="center" mt={4}>
                    <Heading as="h1" size="xl">Página de administrador</Heading>
                    <Stack spacing={4} width="100%" maxWidth="600px">
                        {navigation.map((item) => (
                            <Button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                bg="red.500"
                                color="white"
                                _hover={{ bg: 'red.700' }}
                                rounded="md"
                                fontSize="lg"
                                fontWeight="medium"
                                w="100%"
                                py={6}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Stack>
                </Stack>
            </Box>
            <Footer />
        </Flex>
    );
}
