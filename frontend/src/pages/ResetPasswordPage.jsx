import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Heading, Image, Stack, Input as ChakraInput, InputGroup, InputRightElement, useDisclosure } from '@chakra-ui/react';
import LogoAtomo from '/logo-atomo.svg';
import { TextModal } from '../components/TextModal';
import { resetPassword } from '../api/employee/resetPassword';

export function ResetPasswordPage() {
  const { employee_id } = useParams();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
  const navigate = useNavigate();

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, un número, una letra mayúscula y una letra minúscula.');
      return false;
    }
    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(employee_id, password);
      setTitle('Contraseña restablecida');
      setMessage('Su contraseña ha sido restablecida exitosamente.');
      onTextOpen();
    } catch (error) {
      setTitle('ERROR')
      setMessage('Ha ocurrido un error, por favor intenta más tarde')
      onTextOpen();
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Box minH="100vh" display="flex" flexDirection="column" justifyContent="center" px={6} py={12}>
        <Box mx="auto" w="full" maxW="sm">
          <Image mx="auto" src={LogoAtomo} alt="Logo Atomo" />
          <Heading mt={10} textAlign="center" fontWeight="bold" color="red.500">
            Reestablecer contraseña
          </Heading>
        </Box>
        <Box mt={5} mx="auto" w="full" maxW="sm">
          <Stack spacing={4}>
            <FormControl id="password" isRequired>
              <FormLabel>Ingrese su contraseña</FormLabel>
              <InputGroup>
                <ChakraInput
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Contraseña"
                  background={'white'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isDisabled={loading}
                />
                <InputRightElement width="4rem" mr={2}>
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} isDisabled={loading}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="password2" isRequired>
              <FormLabel>Repita la contraseña</FormLabel>
              <InputGroup>
                <ChakraInput
                  name="password2"
                  type={showPassword2 ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Contraseña"
                  background={'white'}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  isDisabled={loading}
                />
                <InputRightElement width="4rem" mr={2}>
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword2(!showPassword2)} isDisabled={loading}>
                    {showPassword2 ? "Ocultar" : "Mostrar"}
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
              Reestablecer contraseña
            </Button>
          </Stack>
        </Box>
      </Box>

      <TextModal
        isOpen={isTextOpen}
        onClick={handleClick}
        textBody={message}
        textHeader={title}
      />
    </>
  );
}
