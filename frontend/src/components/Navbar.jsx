import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoAtomo from '../assets/logo-atomo-blanco.svg';
import { getEmployee } from '../api/employee/getEmployee';

const initialNavigation = [
  { name: 'Inicio', href: '/employee'}
];

const adminNavigation = [
  { name: 'Inicio', href: '/admin'}
];

export function NavBar() {
  const [navigation, setNavigation] = useState(initialNavigation);
  const [employee, setEmployee] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const getEmployeeInfo = async () => {
      try {
        const data = await getEmployee();
        setEmployee(data);
        if (data.group_name === 'Administrador') {
          setNavigation(adminNavigation);
        } else {
          setNavigation(initialNavigation);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getEmployeeInfo();
  }, []);

  const menuButtonText = useBreakpointValue({
    base: 'Menú',
    md: `${employee.name} ${employee.last_name} (${employee.group_name})`,
  });

  const handleNavClick = (href) => {
    navigate(href);
  };

  return (
    <Box bg="red.500" position="fixed" top={0} left={0} right={0} zIndex={1}>
      <Box mx="auto" maxW="7xl" px={{ base: 2, sm: 6, lg: 8 }}>
        <Flex h="24" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Image h="16" w="auto" src={LogoAtomo} alt="Logo Atomo" />
          </Flex>
          <Flex flex={1} justify="end">
            <HStack spacing={2}>
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  bg={'red.600'}
                  color="white"
                  _hover={{ bg: 'red.800', color: 'white' }}
                  rounded="md"
                  px={3}
                  py={2}
                  fontSize="sm"
                  fontWeight="medium"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Button>
              ))}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  bg="red.600"
                  color="white"
                  _hover={{ bg: 'red.800' }}
                  rounded="md"
                  px={3}
                  py={2}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {menuButtonText}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate('/profile')}>Mi Perfil</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
