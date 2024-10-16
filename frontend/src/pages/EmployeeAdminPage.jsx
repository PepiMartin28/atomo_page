import React, { useEffect, useState } from 'react';
import { NavBar } from '../components/Navbar.jsx';
import { Box, Stack, Flex, Spinner, Heading, Button, useDisclosure } from '@chakra-ui/react';
import { Footer } from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/auth/verifyToken.js';
import { addEmployee } from '../api/employee/employees_functions/addEmployee';
import { deleteEmployee } from '../api/employee/employees_functions/deleteEmployee';
import { activeEmployee } from '../api/employee/employees_functions/activeEmployee';
import { listEmployees } from '../api/employee/employees_functions/listEmployees';
import { changeGroup } from '../api/employee/employees_functions/changeGroup';
import { listGroups } from '../api/employee/groups_functions/listGroups';
import { EmployeeCard } from '../components/EmployeeCard';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { TextModal } from '../components/TextModal';
import { ChangeGroupModal } from '../components/ChangeGroupModal'; 

export function EmployeeAdminPage() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const { isOpen: isChangeGroupOpen, onOpen: onChangeGroupOpen, onClose: onChangeGroupClose } = useDisclosure(); // Manejo del modal de cambio de grupo

    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        const getEmployees = async () => {
            try {
                const response = await listEmployees();
                setEmployees(response);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            } finally {
                setLoading(false);
            }
        };

        const getGroups = async () => {
            try {
                const response = await listGroups();
                setGroups(response);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };

        checkToken();
        getEmployees();
        getGroups();
    }, [navigate]);

    const handleAddEmployee = () => {
        setIsModalOpen(true);
    };

    const handleSaveEmployee = async (employeeData) => {
        try {
            await addEmployee(employeeData);
            setTitle('Usuario creado');
            setMessage('Se ha creado correctamente el usuario');
            onTextOpen();
        } catch (error) {
            setTitle('ERROR');
            if (error.response.data.message && error.response.data.message.includes("Ya existe un usuario con este mail")) {
                setMessage('Ya existe un usuario con este mail');
            } else {
                setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            }
            onTextOpen();
        }
    };

    const handleClose = () => {
        onTextClose();
        window.location.reload();
    };

    const handleChangeState = (editEmployee) => {
        if (editEmployee) {
            setSelectedEmployee(editEmployee);
            setTitle(editEmployee.state_name === 'ACTIVO' ? 'Eliminar usuario' : 'Activar Usuario');
            setMessage(editEmployee.state_name === 'ACTIVO' ? '¿Estás seguro que quieres eliminar el usuario?' : '¿Estás seguro que quieres activar el usuario?');
            onConfirmOpen();
        }
    };

    const handleConfirm = async ()=>{
        onConfirmClose()
        try {
            if (selectedEmployee.state_name == 'ACTIVO'){
                await deleteEmployee(selectedEmployee.employee_id)
            }else{
                await activeEmployee(selectedEmployee.employee_id)
            }
            setTitle(selectedEmployee.state_name == 'ACTIVO' ? 'Usuario eliminado':'Usuario activado')
            setMessage(selectedEmployee.state_name == 'ACTIVO' ? 'El usuario se ha eliminado correctamente':'El usuario se ha activado correctamente')
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
        }finally{
            onTextOpen()
        }
    }

    const handleChangeGroup = (employee) => {
        setSelectedEmployee(employee);
        onChangeGroupOpen();
    };

    const handleSaveGroupChange = async (newGroupId) => {
        try {
            await changeGroup(selectedEmployee.employee_id, newGroupId)
            setTitle('Usuario actualizado')
            setMessage('Se ha actulizado correctamente el usuario')
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
        }finally{
            onChangeGroupClose()
            onTextOpen()
        }
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box pt={24} px={6} textAlign="center">
                <Heading mt={4}>Administración de empleados</Heading>
            </Box>
            <Button colorScheme="blue" onClick={handleAddEmployee} mt={6} mx={6}>
                Añadir empleado
            </Button>
            <Box flex="1" pt={6} px={6} pb={6} mb={10}>
                {loading ? (
                    <Flex justify="center" align="center">
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Stack spacing={4}>
                        {employees.map((employee) => (
                            <EmployeeCard 
                                key={employee.employee_id} 
                                employee={employee}
                                onChangeState={handleChangeState}
                                onChangeGroup={handleChangeGroup} 
                            />
                        ))}
                    </Stack>
                )}
            </Box>
            <Footer />
            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEmployee}
                groups={groups}
            />
            <TextModal
                isOpen={isTextOpen}
                onClose={handleClose}
                onClick={handleClose}
                textBody={message}
                textHeader={title}
            />
            <TextModal
                isOpen={isConfirmOpen}
                onClose={onConfirmClose}
                onClick={handleConfirm}
                textBody={message}
                textHeader={title}
            />
            <ChangeGroupModal
                isOpen={isChangeGroupOpen}
                onClose={onChangeGroupClose}
                onSave={handleSaveGroupChange}
                groups={groups}
                currentGroup={selectedEmployee?.group_id}
            />
        </Flex>
    );
}
