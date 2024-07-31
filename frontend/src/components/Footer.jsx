import { Box, Text } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box bg="red.500" position="absolute" bottom={0} left={0} right={0} zIndex={1} p={2}>
      <Text textAlign="center" color="white">
        ATOMO Copyright 2024 | Todos los derechos reservados | Términos de uso | Política de privacidad
      </Text>
    </Box>
  );
}
