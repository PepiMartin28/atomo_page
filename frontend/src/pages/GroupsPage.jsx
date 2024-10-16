import { NavBar } from '../components/Navbar.jsx';
import { Box, Stack, Flex, Spinner, Heading, Button } from '@chakra-ui/react';
import { Footer } from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyToken } from '../api/auth/verifyToken.js';
import { listGroups } from '../api/employee/groups_functions/listGroups';
import { GroupCard } from '../components/GroupCard.jsx';

export function GroupsPage() {
    const [groups, setGroups] = useState([]);
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

        const getGroups = async () => {
            try {
                const response = await listGroups();
                setGroups(response);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
        getGroups();
    }, [navigate]);

    const handleAddGroup = () => {
        navigate("/admin/groups/add_group")
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box pt={24} px={6} textAlign="center">
                <Heading mt={4}>
                    Grupos de empleados
                </Heading>
            </Box>
            <Button colorScheme="blue" onClick={handleAddGroup} mt={6} mx={6} >
                Añadir grupo
            </Button>
            <Box flex="1" pt={6} px={6} pb={6} mb={10}>
                {loading ? (
                    <Flex justify="center" align="center">
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Stack spacing={4}>
                        {groups.map((group) => (
                            <GroupCard key={group.group_id} group={group} />
                        ))}
                    </Stack>
                )}
            </Box>
            <Footer />
        </Flex>
    );
}