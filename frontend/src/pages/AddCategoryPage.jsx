import { useState } from 'react';
import { NavBar } from '../components/Navbar';
import { Box, Text, Flex, Heading, VStack, Button, useDisclosure, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TextModal } from '../components/TextModal';
import { Footer } from '../components/Footer';
import { addCategory } from '../api/protocol/addCategory';

export function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const { isOpen: isTextOpen, onOpen: onTexOpen, onClose: onTextClose } = useDisclosure();
  const navigate = useNavigate();

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!categoryName || !description) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const response = await addCategory(categoryName, description);
      setTitle('Categoría creada');
      setMessage('La categoría se ha creado correctamente.');
      onTexOpen();
    } catch (error) {
      setTitle('ERROR');
      setMessage('Ha ocurrido un error, por favor intenta más tarde.');
      onTexOpen();
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <NavBar />
      <Flex direction="column" align="center" flex="1" mt={24} mb={10} p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxWidth="500px" width="100%">
          <Heading as="h2" size="lg" mb={3}>Añadir categoría</Heading>
          <VStack align="start" spacing={2}>
            <Text><strong>Nombre de la categoría:</strong></Text>
            <Input name="category_name" value={categoryName} onChange={handleCategoryNameChange} placeholder="Nombre de la categoría" />
            <Text><strong>Descripción:</strong></Text>
            <Input name="description" value={description} onChange={handleDescriptionChange} placeholder="Descripción" />
          </VStack>
          {error && <Box color="red.300" fontWeight="bold" mt={2}>{error}</Box>}
          <Button mt={2} colorScheme="red" w="full" onClick={handleSubmit}>Enviar</Button>
        </Box>
      </Flex>
      <Footer />
      <TextModal
        isOpen={isTextOpen}
        onClose={() => {navigate('/admin/categories')}}
        onClick={() => {navigate('/admin/categories')}}
        textBody={message}
        textHeader={title}
      />
    </Flex>
  );
}
