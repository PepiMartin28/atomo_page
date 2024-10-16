import React from 'react';
import { Box, Text, Badge, Heading, Button, Flex } from '@chakra-ui/react';

export function EmployeeCard({ employee, onChangeState, onChangeGroup }) {
    return (
        <Box 
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Box>
                    <Badge colorScheme={employee.state_name === 'ACTIVO' ? 'green' : 'red'} mb={2}>
                        {employee.state_name === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Heading fontSize="xl" mb={2}>
                        {!employee.name && !employee.last_name
                            ? 'Usuario aún no registrado'
                            : `${employee.name} ${employee.last_name}`}
                    </Heading>
                    <Text>{employee.email}</Text>
                    <Text>{employee.group_name}</Text>
                </Box>
                <Flex direction="column" alignItems="flex-end">
                    <Button
                        colorScheme={employee.state_name == 'ACTIVO' ? 'red' : 'green'}
                        size="sm"
                        mb={2}
                        onClick={() => onChangeState(employee)}
                    >
                        {employee.state_name == 'ACTIVO' ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => onChangeGroup(employee)}
                    >
                        Cambiar grupo
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}
