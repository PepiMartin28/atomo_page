import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Heading, VStack, Button, useDisclosure, Input, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { TextModal } from '../components/TextModal';
import { Editor } from '@tinymce/tinymce-react';
import { addProtocol } from '../api/protocol/addProtocol';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../api/protocol/getAllCategories';
import { verifyToken } from '../api/auth/verifyToken';

export function AddProtocolPage() {
    const [protocolTitle, setProtocolTitle] = useState('');
    const [protocolAuthor, setProtocolAuthor] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('Elija una categoría');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const editorRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        const listCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(['Elija una categoría', ...response]);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        checkToken();
        listCategories();
    }, [navigate]);

    const removeHtmlTags = (html) => {
        return html.replace(/<\/?[^>]+(>|$)/g, "");
    };

    const handleSubmit = async () => {
        setLoading(true);
        const text = editorRef.current.getContent();

        if (!protocolTitle || !protocolAuthor || !text || category === 'Elija una categoría') {
            setError('Debe completar todos los campos.');
            setLoading(false);
            return;
        }

        const summary = removeHtmlTags(text);

        try {
            const response = await addProtocol(protocolTitle, protocolAuthor, summary, category);
            setTitle('Protocolo creado');
            setMessage('El protocolo se ha creado correctamente.');
            onTextOpen();
        } catch (error) {
            setTitle('ERROR')
            setMessage('Ha ocurrido un error, por favor intenta más tarde')
            onTextOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleClick = () => {
        onTextClose();
        navigate('/admin/protocols');
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box mx="auto" w="full" maxW="md" pt={24} px={6}>
                <Heading mt={5} textAlign="center" fontWeight="bold" color="black">
                    Agregue un nuevo protocolo
                </Heading>
            </Box>
            <Flex direction="column" align="center" p={6} mb={12}>
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxW="1200px" width="100%">
                    <VStack align="start" spacing={4}>
                        <FormControl id="protocolTitle" isRequired>
                            <FormLabel>Título</FormLabel>
                            <Input 
                                name="protocolTitle" 
                                value={protocolTitle} 
                                onChange={(e) => setProtocolTitle(e.target.value)} 
                                placeholder="Título"
                            />
                        </FormControl>
                        <FormControl id="protocolAuthor" isRequired>
                            <FormLabel>Autor</FormLabel>
                            <Input 
                                name="protocolAuthor" 
                                value={protocolAuthor} 
                                onChange={(e) => setProtocolAuthor(e.target.value)} 
                                placeholder="Autor" 
                            />
                        </FormControl>
                        <FormControl id="category" isRequired>
                            <FormLabel>Categoría</FormLabel>
                            <Select onChange={handleCategoryChange} value={category}>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl id="protocolSummary" isRequired>
                            <FormLabel>Resumen</FormLabel>
                            <Editor
                                tinymceScriptSrc='/tinymce/tinymce.min.js'
                                licenseKey='gpl'
                                onInit={(_evt, editor) => editorRef.current = editor}
                                initialValue=''
                                init={{
                                    height: 400,
                                    menubar: false,
                                    toolbar: '',
                                    entity_encoding: 'raw'
                                }}
                            />
                        </FormControl>
                    </VStack>
                    {error && <Box color="red.300" fontWeight="bold">{error}</Box>}
                    <Button 
                        mt={4} 
                        width={'100%'} 
                        colorScheme="red" 
                        isLoading={loading} 
                        onClick={handleSubmit}
                    >
                        Enviar
                    </Button>
                </Box>
            </Flex>
            <TextModal
                isOpen={isTextOpen}
                onClose={onTextClose}
                onClick={handleClick}
                textBody={message}
                textHeader={title}
            />
            <Footer />
        </Flex>
    );
}
