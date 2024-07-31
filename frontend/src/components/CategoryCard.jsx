import React from 'react';
import { Box, Text, Badge, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export function CategoryCard({ category }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/admin/categories/${category.category_id}`);
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
            <Badge colorScheme={category.active ? 'green' : 'red'} mb={2}>
                {category.active ? 'Activo' : 'Inactivo'}
            </Badge>
            <Heading fontSize="xl" mb={2}>
                {category.category_name}
            </Heading>
            <Text>{category.description}</Text>
        </Box>
    );
}
