import { useState, useEffect } from 'react';
import { getEmployeeInfo } from '../api/employee/employees_functions/getEmployeeInfo';
import { NavBar } from '../components/Navbar';
import { Box, Text, Spinner, Flex, Heading, VStack, Button, useDisclosure, Input, Select } from '@chakra-ui/react';
import { deleteEmployee } from '../api/employee/employees_functions/deleteEmployee';
import { updateEmployee } from '../api/employee/employees_functions/updateEmployee';
import { useNavigate } from 'react-router-dom';
import { TextModal } from '../components/TextModal';
import { Footer } from '../components/Footer';

export function ProfilePage() {
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({});
  const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const getInfoEmployee = async () => {
      try {
        const data = await getEmployeeInfo();
        setEmployee(data);
        setEditedEmployee(data);
      } catch (error) {
        console.log(error);
      }
    };
    const checkToken = async () => {
      try {
          await verifyToken(navigate);
      } catch (error) {
          console.error("Token verification failed:", error);
      }
    };

    checkToken();
    getInfoEmployee();
  }, [navigate]);

  const handleModify = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickDelete = async () => {
    setTitle('Eliminar cuenta')
    setMessage('¿Estás seguro que quiere eliminar tu cuenta?')
    onDeleteOpen()
  };

  const handleSave = async () => {
    try {
      await updateEmployee(editedEmployee);
      setMessage('Perfil actualizado correctamente');
      setTitle('Datos modificados');
      setEmployee(editedEmployee);
      setEditMode(false);
      onModifyClose();
      onTextOpen();
    } catch (error) {
      setTitle('ERROR')
      setMessage('Ha ocurrido un error, por favor intenta más tarde')
      onTextOpen();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(employee.id);
      setMessage('La cuenta se ha eliminado correctamente.');
      setTitle('Cuenta eliminada');
      onDeleteClose();
      onTextOpen();
      navigate('/');
    } catch (error) {
      setMessage('Error al eliminar la cuenta.');
      setTitle('ERROR');
      onTextOpen();
    }
  };

  if (!employee) {
    return (
      <>
        <NavBar />
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      </>
    );
  }

  return (
    <Flex direction="column" minHeight="100vh">
      <NavBar />
      <Flex direction="column" align="center" flex="1" mt={24} mb={10} p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxWidth="500px" width="100%">
          <Heading as="h2" size="lg" mb={3}>Perfil del empleado</Heading>
          <VStack align="start" spacing={2}>
            {editMode ? (
              <>
                <Text><strong>Nombre:</strong></Text>
                <Input name="name" value={editedEmployee.name} onChange={handleInputChange} placeholder="Nombre" />
                <Text><strong>Apellido:</strong></Text>
                <Input name="last_name" value={editedEmployee.last_name} onChange={handleInputChange} placeholder="Apellido" />
                <Text><strong>Tipo de Documento:</strong></Text>
                <Select name="document_type" value={editedEmployee.document_type} onChange={handleInputChange}>
                  <option value="DNI">DNI</option>
                  <option value="Legajo">Legajo</option>
                </Select>
                <Text><strong>Número de Documento:</strong></Text>
                <Input name="document_num" value={editedEmployee.document_num} onChange={handleInputChange} placeholder="Número de Documento" />
                <Text><strong>Teléfono:</strong></Text>
                <Input name="phone" value={editedEmployee.phone} onChange={handleInputChange} placeholder="Teléfono" />
              </>
            ) : (
              <>
                <Text><strong>Nombre:</strong> {employee.name}</Text>
                <Text><strong>Apellido:</strong> {employee.last_name}</Text>
                <Text><strong>Email:</strong> {employee.email}</Text>
                <Text><strong>Tipo de Documento:</strong> {employee.document_type}</Text>
                <Text><strong>Número de Documento:</strong> {employee.document_num}</Text>
                <Text><strong>Teléfono:</strong> {employee.phone}</Text>
              </>
            )}
          </VStack>
          <Flex mt={4} justify="space-between">
            {editMode ? (
              <>
                <Button colorScheme="blue" onClick={handleSave}>Guardar</Button>
                <Button onClick={() => setEditMode(false)}>Cancelar</Button>
              </>
            ) : (
              <>
                <Button colorScheme="blue" onClick={handleModify}>Modificar perfil</Button>
                <Button colorScheme="red" onClick={handleClickDelete}>Eliminar cuenta</Button>
              </>
            )}
          </Flex>
        </Box>
      </Flex>
      <Footer />
      <TextModal
        isOpen={isTextOpen}
        onClose={onTextClose}
        onClick={onTextClose}
        textBody={message}
        textHeader={title}
      />
      <TextModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onClick={handleDelete}
        textBody={message}
        textHeader={title}
      />
    </Flex>
  );
}
