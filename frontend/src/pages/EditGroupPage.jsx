import { useState, useEffect } from 'react';
import { NavBar } from '../components/Navbar';
import { Box, Text, Flex, Heading, VStack, Button, useDisclosure, Input, Select } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextModal } from '../components/TextModal';
import { Footer } from '../components/Footer';
import { updateGroup } from '../api/employee/groups_functions/updateGroup';
import { verifyToken } from '../api/auth/verifyToken';

export function EditGroupPage() {
  const location = useLocation();
  const group = location.state?.group;

  const [groupName, setGroupName] = useState(group?.group_name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [accessType, setAccessType] = useState(group?.access_type || '');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
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

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAccessTypeChange = (e) => {
    setAccessType(e.target.value);
  };

  const handleSubmit = async () => {
    if (!groupName || !description || !accessType) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      await updateGroup(group.group_id, groupName, description,  accessType);
      setTitle('Grupo editado');
      setMessage('El grupo se ha editado correctamente.');
      onTextOpen();
    } catch (error) {
      setTitle('ERROR');
      setMessage('Ha ocurrido un error, por favor intenta más tarde.');
      onTextOpen();
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <NavBar />
      <Flex direction="column" align="center" flex="1" mt={24} mb={10} p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxWidth="500px" width="100%">
          <Heading as="h2" size="lg" mb={3}>Editar grupo</Heading>
          <VStack align="start" spacing={2}>
            <Text><strong>Nombre del grupo:</strong></Text>
            <Input name="group_name" value={groupName} onChange={handleGroupNameChange} placeholder="Nombre del grupo" />
            <Text><strong>Descripción:</strong></Text>
            <Input name="description" value={description} onChange={handleDescriptionChange} placeholder="Descripción" />
            <Text><strong>Nivel de acceso:</strong></Text>
            <Select placeholder="Selecciona nivel de acceso" value={accessType} onChange={handleAccessTypeChange}>
              <option value="front-end">Front-end</option>
              <option value="back-end">Back-end</option>
              <option value="both">Ambos</option>
            </Select>
          </VStack>
          {error && <Box color="red.300" fontWeight="bold" mt={2}>{error}</Box>}
          <Button mt={4} colorScheme="red" w="full" onClick={handleSubmit}>Enviar</Button>
        </Box>
      </Flex>
      <Footer />
      <TextModal
        isOpen={isTextOpen}
        onClose={() => {navigate(`/admin/groups/${group.group_id}`)}}
        onClick={() => {navigate(`/admin/groups/${group.group_id}`)}}
        textBody={message}
        textHeader={title}
      />
    </Flex>
  );
}
