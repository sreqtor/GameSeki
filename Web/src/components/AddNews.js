import React, { useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { goNews } from './Header';

export function AddNews() {

  const autor = localStorage.getItem('user');

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
    },
  }));

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [videojuego, setVideojuego] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
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
      .catch(error => {});
  };

  const handleButtonClick = () => {
    const newNews = {
      titulo,
      descripcion,
      fecha,
      videojuego,
      imagen: imagenUrl,
      autor
    };

    const requestBody = JSON.stringify(newNews);

      axios.post('http://localhost:5000/api/noticia/subirNoticia', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        goNews(); //Ir a Noticias
      })
      .catch( error => {
        setShowAlertToast(true);        
      })
      .finally(() => {
        setTimeout(() => {
          setShowAlertToast(false);
        }, 2000); // Espera 2 segundos antes de ocultar el AlertToast
      });

  }

  return (
    <>
      <h1>Añadir noticia</h1>

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
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
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
            label="Videojuego"
            variant="filled"
            value={videojuego}
            onChange={e => setVideojuego(e.target.value)}
          />
          <input // Cambio: campo de entrada de tipo archivo
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
          />
          {imagenUrl && <img src={imagenUrl} alt="previewImg" style={{ width: '200px' }} />}

          {/* No editable y fecha actual*/}
          <p><b>Fecha de publicación: </b><DatePicker selected={fecha} onChange={(fecha) => setFecha(fecha)} dateFormat="dd/MM/yyyy" disabled /></p>

          <TextField className='register'
            required
            id="outlined-required"
            label="Autor"
            variant="filled"
            defaultValue={autor}
            disabled
          />

          <ColorButton variant="contained" onClick={handleButtonClick}>Añadir</ColorButton>

          {showAlertToast && (
            <Alert severity="warning" sx={{ textAlign: 'center' }}>
              No se han rellenado todos los campos o la noticia ya existe
            </Alert>
          )}

        </Stack>
      </Box>
    </>
  )
}