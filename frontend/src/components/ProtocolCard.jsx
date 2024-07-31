import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack, Box, Text } from '@chakra-ui/react';

export function ProtocolCard({ protocol }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/protocol/${protocol.protocol_id}`);
  };

  return (
    <Card p={2} border="1px solid" borderColor="black" cursor="pointer" onClick={handleClick}>
      <CardHeader p={2}>
        <Heading size="lg">{protocol.title}</Heading>
        <Text fontSize="sm">
          {protocol.author} - {protocol.category_name}
        </Text>
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
