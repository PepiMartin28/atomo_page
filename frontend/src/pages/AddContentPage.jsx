import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Heading, VStack, Button, useDisclosure, Input, FormControl, FormLabel, IconButton, Text } from '@chakra-ui/react';
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { TextModal } from '../components/TextModal';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyToken } from '../api/auth/verifyToken';
import { addContent } from '../api/protocol/addContent';
import { CloseIcon } from '@chakra-ui/icons';

export function AddContentPage() {

    const { protocol_id } = useParams();

    const [image, setImage] = useState(null);
    const [document, setDocument] = useState(null);
    const [order, setOrder] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const imageInputRef = useRef();
    const documentInputRef = useRef();

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

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleDocumentChange = (event) => {
        setDocument(event.target.files[0]);
    };

    const removeImage = () => {
        setImage(null);
        imageInputRef.current.value = '';
    };

    const removeDocument = () => {
        setDocument(null);
        documentInputRef.current.value = '';
    };

    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);

        const content = editorRef.current.getContent();

        if (!content && !image && !document) {
            setError('Debe completar algún campo.');
            setLoading(false);
            return;
        }

        try {
            const response = await addContent(protocol_id, content, image, document, order);
            setTitle('Contenido añadido');
            setMessage('Se ha creado correctamente el contenido para este protocolo.');
            onTextOpen();
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            onTextOpen();
        }

        setLoading(false);
    };

    const handleClick = () => {
        onTextClose();
        navigate(`/admin/protocols/${protocol_id}`);
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box mx="auto" w="full" maxW="md" pt={24} px={6}>
                <Heading mt={5} textAlign="center" fontWeight="bold" color="black">
                    Agregue un nuevo protocolo
                </Heading>
            </Box>
            <Flex direction="column" align="center" p={6} mb={12} mt={5}>
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxW="1200px" width="100%">
                    <VStack align="start" spacing={4}>
                        <FormControl id="image">
                            <FormLabel>Imagen (solo archivos JPG, JPEG y PNG)</FormLabel>
                            <Flex align="center">
                                <Input 
                                    ref={imageInputRef}
                                    type="file" 
                                    accept=".jpg, .jpeg, .png" 
                                    onChange={handleImageChange} 
                                    display={image ? 'none' : 'block'}
                                />
                                {image && (
                                    <Box display="flex" alignItems="center">
                                        <Text mr={2}>{image.name}</Text>
                                        <IconButton
                                            icon={<CloseIcon />}
                                            size="sm"
                                            onClick={removeImage}
                                        />
                                    </Box>
                                )}
                            </Flex>
                        </FormControl>
                        <FormControl id="document">
                            <FormLabel>Documento (solo archivos PDF)</FormLabel>
                            <Flex align="center">
                                <Input 
                                    ref={documentInputRef}
                                    type="file" 
                                    accept=".pdf" 
                                    onChange={handleDocumentChange} 
                                    display={document ? 'none' : 'block'}
                                />
                                {document && (
                                    <Box display="flex" alignItems="center">
                                        <Text mr={2}>{document.name}</Text>
                                        <IconButton
                                            icon={<CloseIcon />}
                                            size="sm"
                                            onClick={removeDocument}
                                        />
                                    </Box>
                                )}
                            </Flex>
                        </FormControl>
                        <FormControl id="order">
                            <FormLabel>Orden</FormLabel>
                            <Input type="number" value={order} onChange={handleOrderChange} />
                        </FormControl>
                        <FormControl id="content">
                            <FormLabel>Contenido</FormLabel>
                            <Editor
                                tinymceScriptSrc='/tinymce/tinymce.min.js'
                                licenseKey='gpl'
                                onInit={(_evt, editor) => editorRef.current = editor}
                                initialValue=''
                                init={{
                                    height: 400,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'lists'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                    'bold italic underline | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist | outdent indent',
                                    content_style: 'body { font-size: 10pt; }'
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
