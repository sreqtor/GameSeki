import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddGame.css';
import Webcam from 'react-webcam';

const AddGame: React.FC = () => {

    function goInicio() {
        window.open("/", "_self");
    }

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
    
    const webcamRef = useRef<Webcam>(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [desarrollador, setDesarrollador] = useState('');
    const [editor, setEditor] = useState('');
    const [fecha_lanzamiento, setFecha_lanzamiento] = useState(new Date());
    const [imagenUrl, setImagenUrl] = useState('');
    const [valoracion, setValoracion] = useState<number | null>(1);
    const [showAlertToast, setShowAlertToast] = useState(false);

    const handleImagenChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files!;

        if (files.length > 0) {
            const file = files[0];

            const formData = new FormData();
            formData.append('image', file);

            axios.post('http://localhost:5000/upload', formData)
                .then(response => {
                    const imagePath = response.data.imagePath;
                    setImagenUrl(imagePath);
                })
                .catch(error => { });
        }
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

    function dataURLtoBlob(dataURL: string, type: string) {
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
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Añadir videojuego</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <Box display="flex" justifyContent="center" className='ion-text-center' style={{ padding: '20px' }}>
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
                        <div className="ion-text-center">
                            {imagenUrl && <img src={imagenUrl} alt="previewImg" style={{ width: '200px' }} />}
                        </div>

                        <p><b>Fecha de lanzamiento: </b><DatePicker className="custom-datepicker" required selected={fecha_lanzamiento} onChange={(fecha_lanzamiento) => fecha_lanzamiento && setFecha_lanzamiento(fecha_lanzamiento)} dateFormat="dd/MM/yyyy" /></p>
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

            </IonContent>
        </IonPage>
    );
};

export default AddGame;