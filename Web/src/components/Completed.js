import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Fab from '@mui/material/Fab';
import jsPDF from 'jspdf';
import { pink, indigo } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export function Completed() {

  const user = localStorage.getItem('user');

  const [completed, setCompleted] = useState([]);

  const ColorButtonDelete = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(pink[700]),
    backgroundColor: pink[700],
    '&:hover': {
      backgroundColor: pink[900],
    },
  }));

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
    },
  }));

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
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

  useEffect(() => {
    axios.get('http://localhost:5000/api/videojuego/completados/listar')
      .then(response => {
        setCompleted(response.data.completados);
      })
      .catch(error => {});
  }, []);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [juegoToDelete, setJuegoToDelete] = useState('');

  const handleDelete = async (nombre) => {
    setJuegoToDelete(nombre);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/videojuego/completados/eliminar/${juegoToDelete}/${user}`);

      setOpenDeleteDialog(false);
      window.location.reload(); // Recargar la página después de eliminar el videojuego
    } catch (error) {}
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  // Función para generar el PDF
  const generatePDF = () => {
    const completedData = completed
      .filter((completed) => completed.propietario === user)
      .map((completed) => ({
        nombre: completed.nombre,
        descripcion: completed.descripcion,
        fecha_lanzamiento: moment(completed.fecha_lanzamiento).format('DD/MM/YYYY'),
        usuario: completed.usuario,
        valoracion: completed.valoracion !== null ? completed.valoracion : 0,
        imagen: completed.imagen,
      }));

    const pdf = new jsPDF();
    let firstPageEmpty = true; // Variable para rastrear si la primera página está vacía

    const promises = completedData.map((item) => {
      return new Promise((resolve) => {
        const completedImage = new Image();
        completedImage.src = item.imagen;
        completedImage.onload = () => {
          const imageWidth = 100;
          const imageHeight = (completedImage.height * imageWidth) / completedImage.width;

          if (firstPageEmpty) {
            // Agregar contenido a la primera página solo si no está vacía
            pdf.text('Juego: ' + item.nombre, 10, 10);
            pdf.text('Descripción: ' + item.descripcion, 10, 20);
            pdf.text('Fecha de salida: ' + item.fecha_lanzamiento, 10, 30);
            pdf.text('Subido por: ' + item.usuario, 10, 40);
            pdf.text('Valoración dada por ' + item.usuario + ': ' + item.valoracion, 10, 50);
            pdf.addImage(completedImage, 'PNG', 10, 60, imageWidth, imageHeight);
            firstPageEmpty = false; // Actualizar el estado de la primera página
          } else {
            // Agregar nuevas páginas para los elementos restantes
            pdf.addPage();
            pdf.text('Juego: ' + item.nombre, 10, 10);
            pdf.text('Descripción: ' + item.descripcion, 10, 20);
            pdf.text('Fecha de salida: ' + item.fecha_lanzamiento, 10, 30);
            pdf.text('Subido por: ' + item.usuario, 10, 40);
            pdf.text('Valoración dada por ' + item.usuario + ': ' + item.valoracion, 10, 50);
            pdf.addImage(completedImage, 'PNG', 10, 60, imageWidth, imageHeight);
          }

          resolve();
        };
      });
    });

    Promise.all(promises)
      .then(() => {
        pdf.save('completed.pdf');
      })
      .catch((error) => {});
  };

  return (
    <div>
      <h1>Lista de completados</h1>

      <div>

        {user ?
          <div className="container">
            <div className="addButtonInWin" >
              <Fab color="primary" aria-label="add" onClick={generatePDF}>
                <DownloadIcon />
              </Fab>
            </div>
          </div>
          :
          <div>
            <Stack sx={{ width: '45%', marginLeft: 'auto', marginRight: 'auto' }}>
              <Alert severity="info" sx={{ textAlign: 'center' }} variant="filled">
                Necesitas iniciar sesión para añadir videojuegos a la lista de completados
              </Alert>
            </Stack>
          </div>
        }

      </div>

      <div id="completed-container">
        {completed.map(completed =>
          completed.propietario === user && (

            <div className='item' key={completed._id}>
              <Box sx={{ flexGrow: 1, marginLeft: "20px", marginRight: "20px" }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Item className='newsContainer' sx={{ minHeight: "100%" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <img src={completed.imagen} alt="game img" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                      </Box>
                    </Item>
                  </Grid>


                  <Grid item xs={12} sm={6} md={8} lg={9}>
                    <Item className='newsContainer' sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minHeight: "100%" }}>
                      <h2>
                        {completed.nombre}
                      </h2>
                      <p sx={{ textAlign: "justify", marginTop: "0.5em", marginBottom: "0.5em" }}>
                        {completed.descripcion}
                      </p>
                      <p sx={{ textAlign: "justify", marginTop: "0.5em", marginBottom: "0.5em" }}>
                        <b>Fecha de salida: </b>{moment(completed.fecha_lanzamiento).format('DD/MM/YYYY')}
                      </p>
                      <p sx={{ textAlign: "justify", marginTop: "0.5em", marginBottom: "0.5em" }}>
                        <b>Subido por: </b>{completed.usuario}
                      </p>
                      <p sx={{ textAlign: "justify", marginTop: "0.5em", marginBottom: "0.5em" }}>
                        <b>Valoración dada por {completed.usuario}: </b><br />
                        <StyledRating
                          name="customized-color-read-only"
                          defaultValue={1}
                          size="large"
                          precision={1}
                          value={completed.valoracion}
                          icon={<SportsEsportsIcon fontSize="inherit" />}
                          emptyIcon={<SportsEsportsOutlinedIcon fontSize="inherit" />}
                          readOnly
                        />
                      </p>

                      <ColorButtonDelete onClick={() => handleDelete(completed.nombre)}>
                        <DeleteIcon />
                      </ColorButtonDelete>

                    </Item>

                    <Dialog open={openDeleteDialog} onClose={cancelDelete}>
                      <DialogTitle>¿Estás seguro?</DialogTitle>
                      <DialogContent>
                        <p>¿Deseas eliminar el juego <b>{juegoToDelete}</b> de tu lista de completados?</p>
                      </DialogContent>
                      <DialogActions>
                        <ColorButton onClick={cancelDelete}>Cancelar</ColorButton>
                        <ColorButtonDelete onClick={confirmDelete} autoFocus>
                          Eliminar
                        </ColorButtonDelete>
                      </DialogActions>
                    </Dialog>

                  </Grid>
                </Grid>
              </Box>

              <div style={{ height: "80px" }} /> {/* Espacio adicional aquí */}
            </div>

          ))}
      </div>

    </div>
  )
}
