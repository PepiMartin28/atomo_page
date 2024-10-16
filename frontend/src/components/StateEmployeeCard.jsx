import React from 'react';
import { Box, Badge, Heading, Button, Flex } from '@chakra-ui/react';

export function StateEmployeeCard({ stateEmployee, onChangeState }) {


    return (
        <Box 
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Box>
                    <Badge colorScheme={stateEmployee.active ? 'green' : 'red'} mb={2}>
                        {stateEmployee.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Heading fontSize="xl" mb={2}>
                        {stateEmployee.state_name}
                    </Heading>
                </Box>
                <Flex direction="column" alignItems="flex-end">
                    <Button
                        colorScheme={stateEmployee.active ? 'red' : 'green'}
                        size="sm"
                        mb={2}
                        onClick={() => onChangeState(stateEmployee)}
                    >
                        {stateEmployee.active ? 'Desactivar' : 'Activar'}
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}
