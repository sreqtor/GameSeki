import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';

export function EditNews() {

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(indigo[700]),
        backgroundColor: indigo[700],
        '&:hover': {
            backgroundColor: indigo[900],
        },
    }));

    const { titulo } = useParams();
    const history = useHistory();
    const { register, handleSubmit, setValue } = useForm();
    const [noticia, setNoticia] = useState(null);
    const [imagenUrl, setImagenUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAlertToast, setShowAlertToast] = useState(false);

    const handleImagenChange = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData);
            const imagePath = response.data.imagePath;
            setImagenUrl(imagePath);
            setValue('imagen', imagePath);
        } catch (error) {}
    };

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/noticia/buscarNoticia', {
                    titulo: titulo
                });
                setNoticia(response.data);
                setValue('nuevoTitulo', response.data.titulo);
                setValue('descripcion', response.data.descripcion);

                //Por si no hay imagen debido a algún error
                if (response.data.imagen) {
                    setImagenUrl(response.data.imagen);
                }
                setLoading(false);
            } catch (error) {}
        };

        fetchNoticia();
    }, [titulo, setValue]);

    const onSubmit = async (data) => {
        const { nuevoTitulo, ...restoDatos } = data;
        const datosActualizados = { ...restoDatos, titulo: nuevoTitulo };

        try {
            await axios.put(`http://localhost:5000/api/noticia/actualizarNoticia/${titulo}`, datosActualizados);
            history.push('/news');
        } catch (error) {
            setShowAlertToast(true);
            await delay(2000);
            setShowAlertToast(false);
        }
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <h1>Editar Noticia: {noticia.titulo}</h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                <TextField className='register'
                    id="outlined-required"
                    label="Nuevo titulo:"
                    variant="filled"
                    type="text" {...register('nuevoTitulo')}
                    defaultValue={noticia.titulo}
                />

                <br /><br />

                <TextField className='register'
                    id="outlined-required"
                    label="Descripción:"
                    variant="filled"
                    multiline
                    type="text" {...register('descripcion')}
                    defaultValue={noticia.descripcion}
                />

                <br /><br />

                <TextField className='register'
                    id="outlined-required"
                    label="Videojuego:"
                    variant="filled"
                    type="text" {...register('videojuego')}
                    defaultValue={noticia.videojuego}
                />

                <br /><br />

                <label><b>Imagen:</b></label>
                <input type="text" {...register('imagen')} value={imagenUrl} style={{ display: 'none' }} />
                <br /><br />
                {imagenUrl && <img src={imagenUrl} alt="previewImg" style={{ width: '200px' }} />}
                <br /><br />
                <input type="file" accept="image/*" onChange={handleImagenChange} />


                <br /><br />

                <ColorButton type="submit" variant="contained">Guardar cambios</ColorButton>

                <br /><br />

                <Stack sx={{ width: '45%', marginLeft: 'auto', marginRight: 'auto' }}>

                    {showAlertToast && (
                        <Alert severity="warning" sx={{ textAlign: 'center' }}>
                            No se han detectado cambios o faltan campos por rellenar
                        </Alert>
                    )}

                </Stack>

                <br /><br />

            </form>
        </div>
    );


}