import { useState } from 'react';
import { Box, Flex, Heading, VStack, Button, useDisclosure, Input, Select, Image, FormControl, FormLabel, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextModal } from '../components/TextModal';
import LogoAtomo from '/logo-atomo.svg';
import { registerEmployee } from '../api/employee/employees_functions/registerEmployee';

export function RegisterPage() {
  const { employee_id } = useParams();
  const [name, setName] = useState('');
  const [last_name, setLast_Name] = useState('');
  const [document_type, setDocument_type] = useState('');
  const [document_num, setDocument_num] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState(false);
  const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    const data = {
        'name': name,
        'last_name': last_name,
        'document_type': document_type,
        'document_num': document_num,
        'phone': phone,
        'password': password
    }

    for (let key in data) {
      if (!data[key]) {
        setError('Todos los campos son obligatorios.');
        return;
      }
    }

    if (data.password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!validatePassword(data.password)) {
      setError('La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 número y 8 caracteres.');
      return;
    }

    try {
        await registerEmployee(employee_id, data);
        setTitle('Datos guardados');
        setMessage('Sus datos se han registrado correctamente.');
        onTextOpen();
    } catch (error) {
        setTitle('ERROR');
        setMessage('Ha ocurrido un error, por favor intente más tarde.');
        onTextOpen();
        setRegisterError(true);
    }
  };

  const handleClick = () => {
    if (registerError) {
      onTextClose();
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Box mx="auto" w="full" maxW="sm" pt={12}>
        <Image mx="auto" src={LogoAtomo} alt="Logo Atomo" />
        <Heading mt={5} textAlign="center" fontWeight="bold" color="red.500">
          Complete sus datos
        </Heading>
      </Box>
      <Flex direction="column" align="center" p={5}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxWidth="500px" width="100%">
          <VStack align="start" spacing={2}>
            <FormControl id="name" isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
            </FormControl>
            <FormControl id="last_name" isRequired>
              <FormLabel>Apellido</FormLabel>
              <Input name="last_name" value={last_name} onChange={(e) => setLast_Name(e.target.value)} placeholder="Apellido" />
            </FormControl>
            <FormControl id="document_type" isRequired>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select name="document_type" value={document_type} onChange={(e) => setDocument_type(e.target.value)}>
                <option value="">Seleccione</option>
                <option value="DNI">DNI</option>
                <option value="Legajo">Legajo</option>
              </Select>
            </FormControl>
            <FormControl id="document_num" isRequired>
              <FormLabel>Número de Documento</FormLabel>
              <Input name="document_num" value={document_num} onChange={(e) => setDocument_num(e.target.value)} placeholder="Número de Documento" />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Teléfono</FormLabel>
              <Input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Ingrese su contraseña</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Contraseña"
                  background={'white'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4rem" mr={2}>
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="password2" isRequired>
              <FormLabel>Repita la contraseña</FormLabel>
              <InputGroup>
                <Input
                  name="password2"
                  type={showPassword2 ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Contraseña"
                  background={'white'}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                <InputRightElement width="4rem" mr={2}>
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword2(!showPassword2)}>
                    {showPassword2 ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </VStack>
          {error && <Box color="red.300" fontWeight="bold">{error}</Box>}
          <Button mt={4} width={'100%'} colorScheme="red" onClick={handleSubmit}>Enviar</Button>
        </Box>
      </Flex>
      <TextModal
        isOpen={isTextOpen}
        onClose={onTextClose}
        onClick={handleClick}
        textBody={message}
        textHeader={title}
      />
    </>
  );
}
