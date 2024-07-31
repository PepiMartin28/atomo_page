import { useState, useRef, useEffect} from 'react';
import { Box, Flex, Heading, VStack, Button, useDisclosure, Input, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { TextModal } from '../components/TextModal';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getAllCategories } from '../api/protocol/getAllCategories';
import { verifyToken } from '../api/auth/verifyToken';
import { editProtocol } from '../api/protocol/editProtocol';

export function EditProtocolPage (){

    const { protocol_id } = useParams();

    const location = useLocation();
    const { protocol } = location.state;

    const [protocolTitle, setProtocolTitle] = useState(protocol.title)
    const [protocolAuthor, setProtocolAuthor] = useState(protocol.author)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)

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

        checkToken();
    }, [navigate]);

    const removeHtmlTags = (html) => {
        return html.replace(/<\/?[^>]+(>|$)/g, "");
    };

    const handleSubmit = async () => {

        setLoading(true);
        
        const text = editorRef.current.getContent();
        
        if (!protocolTitle || !protocolAuthor || !text ){
            setError('Debe completar todos los campos.')
            return
        }

        const summary =  removeHtmlTags(text)

        try {
            const response = await editProtocol(protocol_id, protocolTitle, protocolAuthor, summary)
            setTitle('Protocolo editado')
            setMessage('El protocolo se ha modificado correctamente.')
            onTextOpen();
        } catch (error) {
            setTitle('ERROR')
            setMessage('Ha ocurrido un error, por favor intenta más tarde')
            onTextOpen();
        }
    }

    const handleClick = ()=>{
        onTextClose();
        navigate(`/admin/protocols/${protocol_id}`)
    }

    return(
        <Flex direction="column" minHeight="100vh">
            <NavBar/>
            <Box mx="auto" w="full" maxW="sm" pt={24} maxWidth="1200px" width="100%" px={6}>
                <Heading mt={5} textAlign="center" fontWeight="bold" color="black">
                    Editar protocolo
                </Heading>
            </Box>
            <Flex direction="column" align="center" p={6} mb={12}>
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} maxWidth="1200px" width="100%">
                <VStack align="start" spacing={2}>
                    <FormControl id="protocolTitle" isRequired>
                        <FormLabel>Título</FormLabel>
                        <Input name="protocolTitle" value={protocolTitle} onChange={(e) => setProtocolTitle(e.target.value)} placeholder="Título"/>
                    </FormControl>
                    <FormControl id="protocolAuthor" isRequired>
                        <FormLabel>Autor</FormLabel>
                        <Input name="protocolAuthor" value={protocolAuthor} onChange={(e) => setProtocolAuthor(e.target.value)} placeholder="Autor" />
                    </FormControl>
                    <FormControl id="protocolSummary" isRequired>
                        <FormLabel>Resumen</FormLabel>
                        <Editor
                            tinymceScriptSrc='/tinymce/tinymce.min.js'
                            licenseKey='gpl'
                            onInit={(_evt, editor) => editorRef.current = editor}
                            initialValue={protocol.summary}
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
                _loading={loading} 
                onClick={handleSubmit}>
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
            <Footer/>
        </Flex>
    )
}