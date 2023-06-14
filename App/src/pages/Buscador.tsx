import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import React, { useState } from 'react';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import moment from 'moment';
import Rating from '@mui/material/Rating';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { cyan, pink, teal, deepOrange, indigo } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './Buscador.css';

const Buscador: React.FC = () => {

  const delay = (ms: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videojuegoToDelete, setVideojuegoToDelete] = useState('');
  const [showWishlistSuccessToast, setShowWishlistSuccessToast] = useState<{ [key: string]: boolean }>({});
  const [showWishlistErrorToast, setShowWishlistErrorToast] = useState<{ [key: string]: boolean }>({});
  const [showCompletadosSuccessToast, setShowCompletadosSuccessToast] = useState<{ [key: string]: boolean }>({});
  const [showCompletadosErrorToast, setShowCompletadosErrorToast] = useState<{ [key: string]: boolean }>({});

  const ColorButtonEdit = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(cyan[700]),
    backgroundColor: cyan[700],
    '&:hover': {
      backgroundColor: cyan[900],
    },
  }));

  const ColorButtonDelete = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(pink[700]),
    backgroundColor: pink[700],
    '&:hover': {
      backgroundColor: pink[900],
    },
  }));

  const ColorButtonAddWhistlist = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(teal[700]),
    backgroundColor: teal[700],
    '&:hover': {
      backgroundColor: teal[900],
    },
  }));

  const ColorButtonAddCompleted = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(deepOrange[700]),
    backgroundColor: deepOrange[700],
    '&:hover': {
      backgroundColor: deepOrange[900],
    },
  }));

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
    },
  }));

  const history = useHistory();
  const user = localStorage.getItem('user');

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

  const handleAddWhishlist = async (nombreJuego: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/videojuego/listadeseos/agregar', {
        "nombre": nombreJuego,
        "propietario": user
      });

      if (response.status === 200) {
        // El juego se añadió a la lista de deseos exitosamente
        setShowWishlistSuccessToast((prevState) => ({ ...prevState, [nombreJuego]: true }));
        await delay(2000);
        setShowWishlistSuccessToast((prevState) => ({ ...prevState, [nombreJuego]: false }));
      } else {
        // Ocurrió un error al añadir el juego a la lista de deseos
        setShowWishlistErrorToast((prevState) => ({ ...prevState, [nombreJuego]: true }));
        await delay(2000);
        setShowWishlistErrorToast((prevState) => ({ ...prevState, [nombreJuego]: false }));
      }
    } catch (error) {
      // Error de red o del servidor
      setShowWishlistErrorToast((prevState) => ({ ...prevState, [nombreJuego]: true }));
      await delay(2000);
      setShowWishlistErrorToast((prevState) => ({ ...prevState, [nombreJuego]: false }));
    }
  };

  const handleAddCompleted = async (nombreJuego: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/videojuego/completados/agregar', {
        "nombre": nombreJuego,
        "propietario": user
      });

      if (response.status === 200) {
        // El juego se añadió a completados exitosamente
        setShowCompletadosSuccessToast((prevState) => ({ ...prevState, [nombreJuego]: true }));
        await delay(2000);
        setShowCompletadosSuccessToast((prevState) => ({ ...prevState, [nombreJuego]: false }));
      } else {
        // Ocurrió un error al añadir el juego a completados
        setShowCompletadosErrorToast((prevState) => ({ ...prevState, [nombreJuego]: true }));
        await delay(2000);
        setShowCompletadosErrorToast((prevState) => ({ ...prevState, [nombreJuego]: false }));
      }
    } catch (error) {
      // Error de red o del servidor
      setShowCompletadosErrorToast((prevState) => ({ ...prevState, [nombreJuego]: true }));
      await delay(2000);
      setShowCompletadosErrorToast((prevState) => ({ ...prevState, [nombreJuego]: false }));
    }
  };

  const handleEdit = (nombre: any) => {
    history.push(`/editgame/${nombre}`);
  };

  const handleDelete = async (nombre: React.SetStateAction<string>) => {
    setVideojuegoToDelete(nombre);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/videojuego/eliminarVideojuego/${videojuegoToDelete}`);

      setOpenDeleteDialog(false);
      window.location.reload(); // Recargar la página después de eliminar el videojuego
    } catch (error) {}
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const [resultados, setResultados] = useState<any[]>([]);
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState<any[]>([]);

  const handleBuscar = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/videojuego/buscarVideojuego', {
        nombre: nombreBusqueda
      });

      // Comprueba si la respuesta contiene un array de videojuegos válidos
      if (response.data && Array.isArray(response.data)) {
        setResultados(response.data);
      } else {
        setResultados([]);
      }
    } catch (error) {}
  };

  const handleNombreBusquedaInput = async (inputValue: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/videojuego/buscarVideojuego', {
        nombre: inputValue
      });

      if (response.data && Array.isArray(response.data)) {
        const videojuegos = response.data;

        // Filtrar los videojuegos cuyos nombres coinciden parcialmente con el valor de entrada
        const sugerencias = videojuegos
          .filter((videojuego) => videojuego.nombre.toLowerCase().includes(inputValue.toLowerCase()))
          .map((videojuego) => videojuego.nombre);

        setSugerencias(sugerencias);
      } else {
        setSugerencias([]);
      }
    } catch (error) {}
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Buscador</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <div className='ion-text-center'>
          <br />
          <Autocomplete className='register'
            size="small"
            value={nombreBusqueda}
            onChange={(event, value) => setNombreBusqueda(value)}
            onInputChange={(event, value) => handleNombreBusquedaInput(value)}
            options={sugerencias}
            renderInput={(params) => <TextField {...params} label="Nombre de búsqueda" variant="filled" />}
            noOptionsText="Sin resultados"
          />
          <br />
          <ColorButton variant="contained" size="large" onClick={handleBuscar}>Buscar</ColorButton>

          <div className="results-container" style={{ paddingTop: '10px' }}>
            {resultados.map((videojuegos) => (
              <IonCard className="result-item" key={videojuegos._id}>
                <img src={videojuegos.imagen} alt="game img" width="200px" height="auto" className="centered-image" />  {/*Link a la imagen. */}
                <IonCardHeader>
                  <IonCardTitle>{videojuegos.nombre}</IonCardTitle>
                  <IonCardSubtitle>{videojuegos.descripcion}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p><b>Desarrollador: </b>{videojuegos.desarrollador}</p>
                  <p><b>Editor: </b>{videojuegos.editor}</p>
                  <p><b>Fecha de salida: </b>{moment(videojuegos.fecha_lanzamiento).format('DD/MM/YYYY')}</p>
                  <p><b>Subido por: </b>{videojuegos.usuario}</p>
                  <br />
                  <p><b>Valoración: </b><br />
                    <StyledRating
                      name="customized-color-read-only"
                      defaultValue={1}
                      size="large"
                      precision={1}
                      value={videojuegos.valoracion}
                      icon={<SportsEsportsIcon fontSize="inherit" />}
                      emptyIcon={<SportsEsportsOutlinedIcon fontSize="inherit" />}
                      readOnly
                    />
                  </p>
                  <p>
                    {'admin' === localStorage.getItem('user') && (
                      <ColorButtonEdit onClick={() => handleEdit(videojuegos.nombre)}>
                        <EditIcon />
                      </ColorButtonEdit>
                    )}

                    {videojuegos.usuario === localStorage.getItem('user') && localStorage.getItem('user') !== 'admin' && (
                      <ColorButtonEdit onClick={() => handleEdit(videojuegos.nombre)}>
                        <EditIcon />
                      </ColorButtonEdit>
                    )}

                    {'    '}

                    {'admin' === localStorage.getItem('user') && (
                      <ColorButtonDelete onClick={() => handleDelete(videojuegos.nombre)}>
                        <DeleteIcon />
                      </ColorButtonDelete>
                    )}

                    {videojuegos.usuario === localStorage.getItem('user') && localStorage.getItem('user') !== 'admin' && (
                      <ColorButtonDelete onClick={() => handleDelete(videojuegos.nombre)}>
                        <DeleteIcon />
                      </ColorButtonDelete>
                    )}

                    <br /><br />

                    {localStorage.getItem('user') && (
                      <ColorButtonAddWhistlist onClick={() => handleAddWhishlist(videojuegos.nombre)}>
                        <PlaylistAddIcon />
                      </ColorButtonAddWhistlist>

                    )}

                    {'    '}

                    {localStorage.getItem('user') && (
                      <ColorButtonAddCompleted onClick={() => handleAddCompleted(videojuegos.nombre)}>
                        <PlaylistAddCheckIcon />
                      </ColorButtonAddCompleted>

                    )}

                  </p>

                  <Dialog open={openDeleteDialog} onClose={cancelDelete}>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogContent>
                      <p>¿Deseas eliminar el videojuego <b>{videojuegoToDelete}</b>?</p>
                    </DialogContent>
                    <DialogActions>
                      <ColorButton onClick={cancelDelete}>Cancelar</ColorButton>
                      <ColorButtonDelete onClick={confirmDelete} autoFocus>
                        Eliminar
                      </ColorButtonDelete>
                    </DialogActions>
                  </Dialog>
                </IonCardContent>
                {showWishlistSuccessToast[videojuegos.nombre] && (
                  <Alert severity="info" sx={{ textAlign: 'center' }}>
                    Juego añadido con éxito a la lista de deseos
                  </Alert>
                )}
                {showWishlistErrorToast[videojuegos.nombre] && (
                  <Alert severity="warning" sx={{ textAlign: 'center' }}>
                    Error al añadir. El juego ya estaba en la lista de deseos
                  </Alert>
                )}
                {showCompletadosSuccessToast[videojuegos.nombre] && (
                  <Alert severity="info" sx={{ textAlign: 'center' }}>
                    Juego añadido con éxito a la lista de completados
                  </Alert>
                )}
                {showCompletadosErrorToast[videojuegos.nombre] && (
                  <Alert severity="warning" sx={{ textAlign: 'center' }}>
                    Error al añadir. El juego ya estaba en la lista de completados
                  </Alert>
                )}

              </IonCard>
            ))}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Buscador;