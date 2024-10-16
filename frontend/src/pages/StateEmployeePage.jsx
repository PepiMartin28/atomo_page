import React, { useEffect, useState } from 'react';
import { NavBar } from '../components/Navbar.jsx';
import { Box, Stack, Flex, Spinner, Heading, Button, useDisclosure } from '@chakra-ui/react';
import { Footer } from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/auth/verifyToken.js';
import { StateEmployeeCard } from '../components/StateEmployeeCard';
import { TextModal } from '../components/TextModal';
import { listStateEmployees } from '../api/employee/stateEmployee_functions/listStateEmployees'
import { deleteStateEmployee } from '../api/employee/stateEmployee_functions/deleteStateEmployee'
import { activeStateEmployee } from '../api/employee/stateEmployee_functions/activeStateEmployee'
import { addStateEmployee } from '../api/employee/stateEmployee_functions/addStateEmployee'
import { AddStateEmployeeModal } from '../components/AddStateEmployeeModal.jsx';


export function StateEmployeePage() {
    const [stateEmployees, setStateEmployees] = useState([]);
    const [selectedStateEmployee, setSelectedStateEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        const getStateEmployees = async () => {
            try {
                const response = await listStateEmployees();
                setStateEmployees(response);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
        getStateEmployees();
    }, [navigate]);

    const handleAddStateEmployee = () => {
        setIsModalOpen(true);
    };

    const handleSaveStateEmployee = async (employeeStateData) => {
        try {
            await addStateEmployee(employeeStateData);
            setTitle('Estado creado');
            setMessage('Se ha creado correctamente el estado');
            onTextOpen();
        } catch (error) {
            console.log(error)
            setTitle('ERROR');
            if (error.response.data.message && error.response.data.message.includes("Ya existe un estado con este nombre")) {
                setMessage('Ya existe un estado con este nombre');
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

    const handleChangeState = (editStateEmployee) => {
        if (editStateEmployee) {
            setSelectedStateEmployee(editStateEmployee);
            setTitle(editStateEmployee.active  ? 'Eliminar estado' : 'Activar estado');
            setMessage(editStateEmployee.active ? '¿Estás seguro que quieres eliminar el estado?' : '¿Estás seguro que quieres activar el estado?');
            onConfirmOpen();
        }
    };

    const handleConfirm = async ()=>{
        onConfirmClose()
        try {
            if (selectedStateEmployee.active){
                await deleteStateEmployee(selectedStateEmployee.stateEmployee_id)
            }else{
                await activeStateEmployee(selectedStateEmployee.stateEmployee_id)
            }
            setTitle(selectedStateEmployee.active ? 'Estado eliminado' : 'Estado activado')
            setMessage(selectedStateEmployee.active ? 'El estado se ha eliminado correctamente':'El estado se ha activado correctamente')
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
        }finally{
            onTextOpen()
        }
    }

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box pt={24} px={6} textAlign="center">
                <Heading mt={4}>Administración de estados</Heading>
            </Box>
            <Button colorScheme="blue" onClick={handleAddStateEmployee} mt={6} mx={6}>
                Añadir estado
            </Button>
            <Box flex="1" pt={6} px={6} pb={6} mb={10}>
                {loading ? (
                    <Flex justify="center" align="center">
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Stack spacing={4}>
                        {stateEmployees.map((stateEmployee) => (
                            <StateEmployeeCard 
                                key={stateEmployee.stateEmployee_id} 
                                stateEmployee={stateEmployee}
                                onChangeState={handleChangeState}
                            />
                        ))}
                    </Stack>
                )}
            </Box>
            <Footer />
            <AddStateEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStateEmployee}
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
        </Flex>
    );
}
