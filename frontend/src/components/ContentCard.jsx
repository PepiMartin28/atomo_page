import { useState } from 'react';
import { Stack, Link, Badge, Box, Button, HStack, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TextModal } from './TextModal';
import { deleteContent } from '../api/protocol/deleteContent';
import { activeContent } from '../api/protocol/activeContent';

export function ContentCard({ content, isAdmin }) {
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { isOpen: isTextOpen, onOpen: onTextOpen, onClose: onTextClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/admin/edit_content/${content.content_id}`, { state: { content } });
    };

    const handleClick = () => {
        setLoading(true);
        setTitle(content.active ? 'Eliminar' : 'Activar');
        setMessage(content.active ? '¿Estás seguro que quieres eliminar el contenido?' : '¿Estás seguro que quieres activar el contenido?');
        onTextOpen();
    };

    const handleDeleteContent = async () => {
        onTextClose();
        try {
            const response = await deleteContent(content.content_id);
            setTitle('Contenido eliminado');
            setMessage('El contenido se ha eliminado correctamente');
            onConfirmOpen();
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde');
            onConfirmOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleActiveContent = async () => {
        onTextClose();
        try {
            const response = await activeContent(content.content_id);
            setTitle('Contenido activado');
            setMessage('El contenido se ha activado correctamente');
            onConfirmOpen();
        } catch (error) {
            setTitle('ERROR');
            setMessage('Ha ocurrido un error, por favor intenta más tarde.');
            onConfirmOpen();
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        onConfirmClose();
        navigate(`/admin/protocols/`);
    };

    const imageUrl = content.image ? `http://127.0.0.1:8000/api/v1/content/${content.image.split('\\').pop()}` : null;
    const documentUrl = content.document ? `http://127.0.0.1:8000/api/v1/content/${content.document.split('\\').pop()}` : null;

    return (
        <>
            <Box position="relative" py={4} bg="white" borderRadius="md">
                {isAdmin && (
                    <HStack spacing={2} p={4}>
                        <Button colorScheme="teal" onClick={handleEdit}>
                            Editar
                        </Button>
                        <Button isLoading={loading} colorScheme={content.active ? 'red' : 'green'} onClick={handleClick}>
                            {content.active ? 'Eliminar' : 'Activar'}
                        </Button>
                    </HStack>
                )}
                {isAdmin && (
                    <Badge position="absolute" top={2} right={2} colorScheme={content.active ? 'green' : 'red'} p={1}>
                        {content.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                )}
                <Stack spacing={4}>
                    {content.content && (
                        <Box 
                            fontSize="md" 
                            color="gray.800" 
                            maxWidth={'100%'}
                            dangerouslySetInnerHTML={{ __html: content.content }}
                        />
                    )}
                    {imageUrl && (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <img src={imageUrl} alt="Content Image" style={{ maxWidth: '100%', borderRadius: 'md' }} />
                        </Box>
                    )}
                    {documentUrl && (
                        <Link
                            fontSize="sm"
                            href={documentUrl}
                            isExternal
                            color="teal.500"
                            download
                        >
                            {content.document.split('\\').pop()}
                        </Link>
                    )}
                </Stack>
            </Box>
            <TextModal
                isOpen={isTextOpen}
                onClose={onTextClose}
                onClick={content.active ? handleDeleteContent : handleActiveContent}
                textBody={message}
                textHeader={title}
            />
            <TextModal
                isOpen={isConfirmOpen}
                onClose={handleConfirm}
                onClick={handleConfirm}
                textBody={message}
                textHeader={title}
            />
        </>
    );
}
