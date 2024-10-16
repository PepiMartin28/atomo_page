import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Heading, VStack, Button, useDisclosure, Input, FormControl, FormLabel, IconButton, Link, Text, Image } from '@chakra-ui/react';
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { TextModal } from '../components/TextModal';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { verifyToken } from '../api/auth/verifyToken';
import { editContent } from '../api/protocol/content_functions/editContent';
import { CloseIcon } from '@chakra-ui/icons';

export function EditContentPage() {
    const { content_id } = useParams();
    const { state } = useLocation();
    const content = state?.content;
    const [imageUrl, setImageUrl] = useState('')
    const [documentUrl, setDocumentUrl] = useState('')
    const [image, setImage] = useState(null);
    const [document, setDocument] = useState(null);
    const [order, setOrder] = useState(content?.order || '');
    const [deleteImage, setDeleteImage] = useState(false)
    const [deleteDocument, setDeleteDocument] = useState(false)

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
        window.scrollTo(0, 0);

        const checkToken = async () => {
            try {
                await verifyToken(navigate);
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        };

        setImageUrl(content?.image ? `http://127.0.0.1:8000/api/v1/content/${content.image.split('\\').pop()}` : null)
        setDocumentUrl(content?.document ? `http://127.0.0.1:8000/api/v1/content/${content.document.split('\\').pop()}` : null)

        checkToken();
    }, [navigate]);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
        setImageUrl(null)
    };

    const handleDocumentChange = (event) => {
        setDocument(event.target.files[0]);
        setDocumentUrl(null)
    };

    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    };

    const removeImage = () => {
        setImage(null);
        imageInputRef.current.value = '';
        setImageUrl(null)
        setDeleteImage(true)
    };

    const removeDocument = () => {
        setDocument(null);
        documentInputRef.current.value = '';
        setDocumentUrl(null)
        setDeleteDocument(true)
    };

    const handleSubmit = async () => {
        setLoading(true);

        const contentData = editorRef.current.getContent();

        if (!contentData && !image && !document) {
            setError('Debe completar algún campo.');
            setLoading(false);
            return;
        }

        try {
            await editContent(content_id, contentData, image, document, order, deleteImage, deleteDocument);
            setTitle('Contenido editado');
            setMessage('Se ha editado correctamente el contenido para este protocolo.');
            onTextOpen();
        } catch (error) {
            console.log(error)
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            onTextOpen();
        }finally{
            setLoading(false);
        }
    };

    const handleClick = () => {
        onTextClose();
        navigate(`/admin/protocols/${content.protocol_id}`);
    };

    return (
        <Flex direction="column" minHeight="100vh">
            <NavBar />
            <Box mx="auto" w="full" maxW="md" pt={24} px={6}>
                <Heading mt={5} textAlign="center" fontWeight="bold" color="black">
                    Editar contenido
                </Heading>
            </Box>
            <Flex direction="column" align="center" p={6} mb={12} mt={5}>
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxW="1200px" width="100%">
                    <VStack align="start" spacing={4}>
                        <FormControl id="image">
                            <FormLabel>Imagen (solo archivos JPG, JPEG y PNG)</FormLabel>
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
                                {imageUrl && (
                                    <Box mt={2}>
                                        <Text>Imagen actual:</Text>
                                        <Flex align="center" mt={2}>
                                        <Image src={imageUrl} alt="Imagen actual" maxH="300px" />
                                        <Button onClick={removeImage} m={4}>
                                            Eliminar imagen
                                        </Button>
                                    </Flex>
                                    </Box>
                                )}
                        </FormControl>
                        <FormControl id="document">
                            <FormLabel>Documento (solo archivos PDF)</FormLabel>
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
                                {documentUrl && (
                                    <Box mt={2}>
                                        <Text>Archivo actual:</Text>
                                        <Flex align="center" mt={2}>
                                        <Link
                                            fontSize="sm"
                                            href={documentUrl}
                                            isExternal
                                            color="teal.500"
                                            download
                                        >
                                            {content.document.split('\\').pop()}
                                        </Link>
                                        <Button onClick={removeDocument} m={4}>
                                            Eliminar archivo
                                        </Button>
                                    </Flex>
                                    </Box>
                                )}
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
                                initialValue={content?.content || ''}
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
