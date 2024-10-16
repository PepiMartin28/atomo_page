import React from 'react';
import { Box, Text, Badge, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export function GroupCard({ group }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/admin/groups/${group.group_id}`);
    };

    return (
        <Box 
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            cursor="pointer"
            onClick={handleClick}
            _hover={{ bg: 'gray.100' }}
        >
            <Badge colorScheme={group.active ? 'green' : 'red'} mb={2}>
                {group.active ? 'Activo' : 'Inactivo'}
            </Badge>
            <Heading fontSize="xl" mb={2}>
                {group.group_name}
            </Heading>
            <Text>{group.description}</Text>
            <Text>Nivel de acceso: {group.access_type}</Text>
        </Box>
    );
}
