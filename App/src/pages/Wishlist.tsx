import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Fab from '@mui/material/Fab';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { pink, indigo } from '@mui/material/colors';
import jsPDF from 'jspdf';
import { styled } from '@mui/material/styles';
import './Wishlist.css';

const Wishlist: React.FC = () => {

  const user = localStorage.getItem('user');

  const [wishlist, setWishlist] = useState({ propietario: '', nombre: '', descripcion: '', fecha_lanzamiento: Date.now(), usuario: '', valoracion: 1, imagen: '' });

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
    axios.get('http://localhost:5000/api/videojuego/listadeseos/listar')
      .then(response => {
        setWishlist(response.data.listadeseos);
      })
      .catch(() => {});
  }, []);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [juegoToDelete, setJuegoToDelete] = useState('');

  const handleDelete = async (nombre: React.SetStateAction<string>) => {
    setJuegoToDelete(nombre);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/videojuego/listadeseos/eliminar/${juegoToDelete}/${user}`);

      setOpenDeleteDialog(false);
      window.location.reload(); // Recargar la página después de eliminar el videojuego
    } catch (error) {}
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  // Función para generar el PDF
  const generatePDF = () => {
    const wishlistData = Array.isArray(wishlist)
      ? wishlist.filter((wishlist: { propietario: string }) => wishlist.propietario === user)


        .map((wishlist: { nombre: any; descripcion: any; fecha_lanzamiento: moment.MomentInput; usuario: any; valoracion: null; imagen: any; }) => ({
          nombre: wishlist.nombre,
          descripcion: wishlist.descripcion,
          fecha_lanzamiento: moment(wishlist.fecha_lanzamiento).format('DD/MM/YYYY'),
          usuario: wishlist.usuario,
          valoracion: wishlist.valoracion !== null ? wishlist.valoracion : 0,
          imagen: wishlist.imagen,
        }))
      : [];

    const pdf = new jsPDF();
    let firstPageEmpty = true; // Variable para rastrear si la primera página está vacía

    const promises = wishlistData.map((item) => {
      return new Promise<void>((resolve) => {
        const wishlistImage = new Image();
        wishlistImage.src = item.imagen;
        wishlistImage.onload = () => {
          const imageWidth = 100;
          const imageHeight = (wishlistImage.height * imageWidth) / wishlistImage.width;

          if (firstPageEmpty) {
            // Agregar contenido a la primera página solo si no está vacía
            pdf.text('Juego: ' + item.nombre, 10, 10);
            pdf.text('Descripción: ' + item.descripcion, 10, 20);
            pdf.text('Fecha de salida: ' + item.fecha_lanzamiento, 10, 30);
            pdf.text('Subido por: ' + item.usuario, 10, 40);
            pdf.text('Valoración dada por ' + item.usuario + ': ' + item.valoracion, 10, 50);
            pdf.addImage(wishlistImage, 'PNG', 10, 60, imageWidth, imageHeight);
            firstPageEmpty = false; // Actualizar el estado de la primera página
          } else {
            // Agregar nuevas páginas para los elementos restantes
            pdf.addPage();
            pdf.text('Juego: ' + item.nombre, 10, 10);
            pdf.text('Descripción: ' + item.descripcion, 10, 20);
            pdf.text('Fecha de salida: ' + item.fecha_lanzamiento, 10, 30);
            pdf.text('Subido por: ' + item.usuario, 10, 40);
            pdf.text('Valoración dada por ' + item.usuario + ': ' + item.valoracion, 10, 50);
            pdf.addImage(wishlistImage, 'PNG', 10, 60, imageWidth, imageHeight);
          }

          resolve();
        };
      });
    });

    Promise.all(promises)
      .then(() => {
        pdf.save('wishlist.pdf');
      })
      .catch(() => {});
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de deseos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <div>

          <div className='ion-text-end' style={{ paddingTop: '8px', paddingRight: '8px' }}>

            {user ?

              <div>
                <Fab color="primary" aria-label="add" onClick={generatePDF}>
                  <DownloadIcon />
                </Fab>
              </div>

              :

              <div>
                <Stack sx={{ width: '45%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Alert severity="info" sx={{ textAlign: 'center' }} variant="filled">
                    Necesitas iniciar sesión para añadir videojuegos a la lista de deseos
                  </Alert>
                </Stack>
              </div>
            }

          </div>

          <div id="wishlist-container">
            {Array.isArray(wishlist) && wishlist.map((wishlist: { propietario: string | null; _id: React.Key | null | undefined; imagen: string | undefined; nombre: string; descripcion: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; fecha_lanzamiento: moment.MomentInput; usuario: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; valoracion: number | null | undefined; }) =>
              wishlist.propietario === user && (

                <div className='item' key={wishlist._id}>
                  <Box sx={{ flexGrow: 1, marginLeft: "20px", marginRight: "20px" }}>

                    <IonGrid>
                      <Item className='newsContainer' sx={{ minHeight: "100%" }}>

                        <img src={wishlist.imagen} alt="game img" style={{ maxWidth: "100%", maxHeight: "100%" }} />

                      </Item>

                      <Item className='newsContainer' sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minHeight: "100%" }}>
                        <h2>
                          {wishlist.nombre}
                        </h2>
                        <p className="ion-margin-top ion-margin-bottom">
                          {wishlist.descripcion}
                        </p>
                        <p className="ion-margin-top ion-margin-bottom">
                          <b>Fecha de salida: </b>{moment(wishlist.fecha_lanzamiento).format('DD/MM/YYYY')}
                        </p>
                        <p className="ion-margin-top ion-margin-bottom">
                          <b>Subido por: </b>{wishlist.usuario}
                        </p>
                        <p className="ion-margin-top ion-margin-bottom">
                          <b>Valoración dada por {wishlist.usuario}:</b><br />
                          <StyledRating
                            name="customized-color-read-only"
                            defaultValue={1}
                            size="large"
                            precision={1}
                            value={wishlist.valoracion}
                            icon={<SportsEsportsIcon fontSize="inherit" />}
                            emptyIcon={<SportsEsportsOutlinedIcon fontSize="inherit" />}
                            readOnly
                          />
                        </p>

                        <ColorButtonDelete onClick={() => handleDelete(wishlist.nombre)}>
                          <DeleteIcon />
                        </ColorButtonDelete>

                      </Item>

                      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogContent>
                          <p>¿Deseas eliminar el juego <b>{juegoToDelete}</b> de tu lista de deseos?</p>
                        </DialogContent>
                        <DialogActions>
                          <ColorButton onClick={cancelDelete}>Cancelar</ColorButton>
                          <ColorButtonDelete onClick={confirmDelete} autoFocus>
                            Eliminar
                          </ColorButtonDelete>
                        </DialogActions>
                      </Dialog>

                    </IonGrid>

                  </Box>

                  <div style={{ height: "5px" }} /> {/* Espacio adicional aquí */}
                </div>

              ))}
          </div>

        </div>

      </IonContent>
    </IonPage>
  );
};

export default Wishlist;
