import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Stack,
  Input as ChakraInput,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Text,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import LogoAtomo from '/logo-atomo.svg';
import { login } from '../api/auth/login';
import { verifyToken } from '../api/auth/verifyToken';
import { forgotPassword } from '../api/employee/forgotPassword';
import { TextModal } from '../components/TextModal';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Por favor complete ambos campos.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await login(email, password);
      localStorage.setItem('token', `Bearer ${response.token}`);

      if (response.group === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError('Error al iniciar sesión, por favor intente nuevamente más tarde.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const response = await verifyToken();

      if (response.group === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    };

    const token = localStorage.getItem('token');

    if (token) {
      checkToken();
    }
  }, [navigate]);

  const handleForgotPassword = () => {
    onModalOpen();
  }

  const sendMail = async () => {
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotEmail('');
      onModalClose();
      setTitle('Correo enviado');
      setMessage('Si existe un usuario con este correo electrónico, recibirá un mail.');
      onTextOpen();
    } catch (error) {
      setForgotEmail('');
      onModalClose();
      setTitle('ERROR')
      setMessage('Ha ocurrido un error, por favor intenta más tarde')
      onTextOpen();
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <Flex direction="column" minHeight="100vh" py={12}>
      <Box mx="auto" w="full" maxW="sm">
          <Image mx="auto" src={LogoAtomo} alt="Logo Atomo" />
          <Heading mt={10} textAlign="center" fontWeight="bold" color="red.500">
            Inicie sesión
          </Heading>
        </Box>
        <Box mt={5} mx="auto" w="full" maxW="sm">
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Correo electrónico</FormLabel>
              <ChakraInput
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Correo electrónico"
                background={'white'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isDisabled={loading}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <ChakraInput
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  background={'white'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isDisabled={loading}
                />
                <InputRightElement width="4rem" mr={2}>
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {error && <Box color="red.300" fontWeight="bold">{error}</Box>}
            <Button
              onClick={handleSubmit}
              type="submit"
              w="full"
              color={'white'}
              background={'red.500'}
              _hover={{ bg: 'red.700', color: 'white' }}
              isLoading={loading}
              isDisabled={loading}
            >
              Iniciar sesión
            </Button>
            <Box fontWeight="bold" onClick={handleForgotPassword} cursor="pointer">
              ¿Olvidó su contraseña? Haga clic aquí
            </Box>
          </Stack>
        </Box>
      

      <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ingrese su correo electrónico</ModalHeader>
          <ModalBody>
            <Text mb={4}>Por favor ingrese su correo electrónico para recuperar su contraseña.</Text>
            <ChakraInput
                name="forgot-email"
                type="forgot-email"
                autoComplete="forgot-email"
                placeholder="Correo electrónico"
                background={'white'}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                isDisabled={forgotLoading}
              />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={sendMail} isLoading={forgotLoading} isDisabled={forgotLoading}>
              Enviar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TextModal
        isOpen={isTextOpen}
        onClose={onTextClose}
        onClick={onTextClose}
        textBody={message}
        textHeader={title}
      />
    </Flex>
  );
}
