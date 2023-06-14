import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import Rating from '@mui/material/Rating';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Webcam from 'react-webcam';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EditGame.css';

interface FormValues {
    nuevoNombre: string;
    descripcion: string;
    imagen: string;
    desarrollador: string;
    editor: string;
    fecha_lanzamiento: Date;
    valoracion: number;
}

const EditGame: React.FC = () => {

    const delay = (ms: number | undefined) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    function goInicio() {
        window.open("/", "_self");
    };

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
    const params: { nombre?: string } = useParams();
    const nombre = params.nombre ? params.nombre : '';
    const history = useHistory();
    const { register, handleSubmit, setValue, control } = useForm<FormValues>();
    const [videojuego, setVideojuego] = useState({ nombre: '', descripcion: '', desarrollador: '', editor: '', fecha_lanzamiento: Date.now(), valoracion: 1 });
    const [imagenUrl, setImagenUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAlertToast, setShowAlertToast] = useState(false);

    const handleImagenChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files!;

        if (files.length > 0) {
            const file = files[0];

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post('http://localhost:5000/upload', formData);
                const imagePath = response.data.imagePath;
                setImagenUrl(imagePath);
                setValue('imagen', imagePath);
            } catch (error) { }
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
                            setValue('imagen', imagePath);
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

    useEffect(() => {
        const fetchVideojuego = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/videojuego/buscarVideojuegoAEditar', {
                    nombre: nombre
                });
                setVideojuego(response.data);
                setValue('nuevoNombre', response.data.nombre);
                setValue('descripcion', response.data.descripcion);

                //Por si no hay imagen debido a algún error
                if (response.data.imagen) {
                    setImagenUrl(response.data.imagen);
                }
                setLoading(false);
            } catch (error) { }
        };

        fetchVideojuego();
    }, [nombre, setValue]);


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const { nuevoNombre, ...restoDatos } = data;
        const datosActualizados = { ...restoDatos, nombre: nuevoNombre };

        try {
            const response = await axios.put(`http://localhost:5000/api/videojuego/actualizarVideojuego/${nombre}`, datosActualizados);
            history.push('/');
            goInicio();
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
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Editar Videojuego: {videojuego.nombre}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <form onSubmit={handleSubmit(onSubmit)} className='ion-text-center' style={{ padding: '20px' }}>

                    <TextField className='register'
                        id="outlined-required"
                        label="Nuevo nombre:"
                        variant="filled"
                        type="text" {...register('nuevoNombre')}
                        defaultValue={videojuego.nombre}
                    />

                    <br /><br />

                    <TextField className='register'
                        id="outlined-required"
                        label="Descripción:"
                        variant="filled"
                        multiline
                        type="text" {...register('descripcion')}
                        defaultValue={videojuego.descripcion}
                    />

                    <br /><br />

                    <label><b>Imagen:</b></label>
                    <input type="text" {...register('imagen')} value={imagenUrl} style={{ display: 'none' }} />
                    <br /><br />                
                    {imagenUrl && <img src={imagenUrl} alt="previewImg" style={{ width: '200px' }} />}
                    <br /><br />
                    <input type="file" accept="image/*" onChange={handleImagenChange} />
                    <br /><br />
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        width={250} // Ancho de la webcam
                        height="auto" // Altura de la webcam
                    />
                    <br /><br />
                    <button type='button' onClick={handleCaptureImage} style={{ width: '250px' }}>Capturar imagen</button>


                    <br /><br /><br />

                    <TextField className='register'
                        id="outlined-required"
                        label="Desarrollador:"
                        variant="filled"
                        type="text" {...register('desarrollador')}
                        defaultValue={videojuego.desarrollador}
                    />

                    <br /><br />

                    <TextField className='register'
                        id="outlined-required"
                        label="Editor:"
                        variant="filled"
                        type="text" {...register('editor')}
                        defaultValue={videojuego.editor}
                    />

                    <br /><br />

                    <label><b>Fecha de lanzamiento:</b></label>
                    <br />

                    <Box display="flex" justifyContent="center">
                        <Stack
                            component="form"
                            sx={{
                                width: '25ch',
                            }}
                            direction="column"
                            noValidate
                            autoComplete="off"
                        >
                            <Controller
                                control={control}
                                name="fecha_lanzamiento"
                                render={({ field }) => (
                                    <DatePicker
                                        className="custom-datepicker"
                                        selected={field.value ? new Date(field.value) : (videojuego.fecha_lanzamiento ? new Date(videojuego.fecha_lanzamiento) : null)}
                                        onChange={(date) => field.onChange(date)}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                )}
                            />

                        </Stack>
                    </Box>

                    <br />

                    <label><b>Valoración:</b></label>
                    <br />

                    <Controller
                        name="valoracion"
                        control={control}
                        defaultValue={videojuego.valoracion}
                        render={({ field }) => (
                            <StyledRating
                                name="customized-color"
                                size="large"
                                precision={1}
                                value={field.value}
                                onChange={(event, newValoracion) => field.onChange(newValoracion)}
                                icon={<SportsEsportsIcon fontSize="inherit" />}
                                emptyIcon={<SportsEsportsOutlinedIcon fontSize="inherit" />}
                            />
                        )}
                    />

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

            </IonContent>
        </IonPage>
    );
};

export default EditGame;