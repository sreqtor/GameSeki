import React, { useRef, useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import { goInicio } from './Header';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Webcam from 'react-webcam';

export function AddGame() {

    const usuario = localStorage.getItem('user');

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(indigo[700]),
        backgroundColor: indigo[700],
        '&:hover': {
            backgroundColor: indigo[900],
        },
    }));

    const StyledRating = styled(Rating)({
        '& .MuiRating-icon': {
            color: '#bbdff8',
        },
        '& .MuiRating-iconFilled': {
            color: '#4cb6ff',
        },
        '& .MuiRating-iconHover': {
            color: '#28a7fe',
        },
    });

    const webcamRef = useRef(Webcam);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [desarrollador, setDesarrollador] = useState('');
    const [editor, setEditor] = useState('');
    const [fecha_lanzamiento, setFecha_lanzamiento] = useState(new Date());
    const [imagenUrl, setImagenUrl] = useState('');
    const [valoracion, setValoracion] = React.useState(1);
    const [showAlertToast, setShowAlertToast] = useState(false);

    const handleImagenChange = e => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        axios.post('http://localhost:5000/upload', formData)
            .then(response => {
                const imagePath = response.data.imagePath;
                setImagenUrl(imagePath);
            })
            .catch(error => { });
    };

    const handleCaptureImage = async () => {
        try {

            //En caso de que no se encuentre cámara    
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("No se ha podido acceder a la cámara");
            }

            if (webcamRef.current) {
                const imageData = webcamRef.current.getScreenshot();

                if (imageData) {
                    const blob = dataURLtoBlob(imageData, "image/jpeg");

                    const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('filename', file.name);
                    formData.append('originalName', file.name);

                    axios.post('http://localhost:5000/upload', formData)
                        .then(response => {
                            const imagePath = response.data.imagePath;                            
                            setImagenUrl(imagePath);
                        })
                        .catch(error => { });
                }
            }
        } catch (error) { }
    };

    function dataURLtoBlob(dataURL, type) {
        const binaryString = window.atob(dataURL.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(binaryString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return new Blob([uint8Array], { type });
    };

    const handleButtonClick = async () => {

        const newGame = {
            nombre,
            descripcion,
            desarrollador,
            editor,
            fecha_lanzamiento,
            imagen: imagenUrl, //Pasar la ruta de la imagen al objeto newGame
            valoracion,
            usuario //Subido por:
        };


        if (fecha_lanzamiento != null) {
            axios.post('http://localhost:5000/api/videojuego/subirVideojuego', newGame)
                .then(response => {
                    goInicio(); //Ir a Inicio
                })
                .catch(error => {
                    setShowAlertToast(true);
                })
                .finally(() => {
                    setTimeout(() => {
                        setShowAlertToast(false);
                    }, 2000); // Espera 2 segundos antes de ocultar el AlertToast
                });
        }

    };


    return (
        <>
            <h1>Añadir videojuego</h1>

            <Box display="flex" justifyContent="center">
                <Stack
                    component="form"
                    sx={{
                        width: '25ch',
                    }}
                    direction="column"
                    spacing={2}
                    noValidate
                    autoComplete="off"
                    style={{ minHeight: '100vh' }}
                >

                    <TextField className='register'
                        required
                        id="outlined-required"
                        label="Titulo"
                        variant="filled"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                    <TextField className='register'
                        required
                        id="filled-multiline-flexible"
                        label="Descripción"
                        multiline
                        rows={4}
                        variant="filled"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                    />
                    <TextField className='register'
                        required
                        id="outlined-required"
                        label="Desarrollador"
                        variant="filled"
                        value={desarrollador}
                        onChange={e => setDesarrollador(e.target.value)}
                    />
                    <TextField className='register'
                        required
                        id="outlined-required"
                        label="Editor"
                        variant="filled"
                        value={editor}
                        onChange={e => setEditor(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                    />
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                    />
                    <button type='button' onClick={handleCaptureImage}>Capturar imagen</button>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {imagenUrl && <img src={imagenUrl} alt="previewImg" style={{ width: '200px' }} />}
                    </div>

                    <p><b>Fecha de lanzamiento: </b><DatePicker className='register' required selected={fecha_lanzamiento} onChange={(fecha_lanzamiento) => setFecha_lanzamiento(fecha_lanzamiento)} dateFormat="dd/MM/yyyy" /></p>
                    <p><b>Valoración: </b>
                        <StyledRating
                            name="customized-color"
                            defaultValue={1}
                            size="large"
                            precision={1}
                            value={valoracion}
                            onChange={(event, newValoracion) => setValoracion(newValoracion)}
                            icon={<SportsEsportsIcon fontSize="inherit" />}
                            emptyIcon={<SportsEsportsOutlinedIcon fontSize="inherit" />}
                        />
                    </p>
                    <TextField className='register'
                        required
                        id="outlined-required"
                        label="Subido por:"
                        variant="filled"
                        defaultValue={usuario}
                        disabled
                    />

                    <ColorButton variant="contained" onClick={handleButtonClick}>Añadir</ColorButton>

                    {showAlertToast && (
                        <Alert severity="warning" sx={{ textAlign: 'center' }}>
                            No se han rellenado todos los campos o el videojuego ya existe
                        </Alert>
                    )}

                </Stack>
            </Box>
        </>
    )
}