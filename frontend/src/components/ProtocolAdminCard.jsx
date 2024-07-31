import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack, Box, Text, Badge } from '@chakra-ui/react';

export function ProtocolAdminCard({ protocol }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/protocols/${protocol.protocol_id}`);
  };

  return (
    <Card p={2} border="1px solid" borderColor="black" cursor="pointer" onClick={handleClick}>
      <CardHeader p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Heading size="lg">{protocol.title}</Heading>
          <Text fontSize="sm">
            {protocol.author} - {protocol.category_name}
          </Text>
        </Box>
        <Badge p={1} color={'black'} colorScheme={protocol.active ? 'green' : 'red'}>
          {protocol.active ? 'Activo' : 'Inactivo'}
        </Badge>
      </CardHeader>
      <CardBody p={2}>
        <Stack spacing={1}>
          <Box>
            <Text fontSize="md">
              {protocol.summary}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs">
              Fecha de creación: {new Date(protocol.created_date).toLocaleDateString()}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
