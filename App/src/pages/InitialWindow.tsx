import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InitialWindow.css';
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
import Alert from '@mui/material/Alert';
import moment from 'moment';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Rating, Select, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import { useHistory } from 'react-router-dom';
import { cyan, pink, teal, deepOrange, indigo } from '@mui/material/colors';
import Fab from '@mui/material/Fab';

const InitialWindow: React.FC = () => {

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videojuegoToDelete, setVideojuegoToDelete] = useState('');
  const [showWishlistSuccessToast, setShowWishlistSuccessToast] = useState<{ [key: string]: boolean }>({});
  const [showWishlistErrorToast, setShowWishlistErrorToast] = useState<{ [key: string]: boolean }>({});
  const [showCompletadosSuccessToast, setShowCompletadosSuccessToast] = useState<{ [key: string]: boolean }>({});
  const [showCompletadosErrorToast, setShowCompletadosErrorToast] = useState<{ [key: string]: boolean }>({});
  const [filterDate, setFilterDate] = useState('');

  const user = localStorage.getItem('user');

  function goInicio() {
    window.open("/", "_self");
  }

  function goAddGame() {
    window.open("/addgame", "_self");
  }

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

  const [games, setGames] = useState([] as any[]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videojuego/listarVideojuegos');
      setGames(response.data.videojuegos);
      setDataLoaded(true);
    } catch (error) {}
  };

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

  const history = useHistory();

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

  useEffect(() => {
    // Función para realizar la carga de datos
    const loadData = () => {
      fetchData();
    };

    loadData();
  }, []);

  const handleFilterChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setFilterDate(event.target.value);
  };

  const filteredList = filterDate
    ? games.filter((game) => {
      const isSameDate = moment(game.fecha_lanzamiento).isSame(filterDate, 'day');
      const isToday = moment(filterDate).isSame(moment(), 'day');
      const isYesterday = moment(filterDate).isSame(moment().subtract(1, 'day'), 'day');
      const isLastMonth = moment(game.fecha_lanzamiento).isBetween(
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month'),
        'day',
        '[]'
      );
      const isLastYear = moment(game.fecha_lanzamiento).isBetween(
        moment().subtract(1, 'year').startOf('year'),
        moment().subtract(1, 'year').endOf('year'),
        'day',
        '[]'
      );
      return (
        isSameDate ||
        (isToday && isSameDate) ||
        (isYesterday && isSameDate) ||
        (filterDate === 'lastMonth' && isLastMonth) ||
        (filterDate === 'lastYear' && isLastYear)
      );
    })
    : games;

  // Verifica si no hay resultados después de aplicar el filtro
  const noResults = filteredList.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todos los juegos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div>

          <>

            <div className='ion-text-end' style={{ padding: '8px' }}>
              <Fab color="primary" aria-label="add" onClick={goInicio} style={{ marginRight: '8px' }}>
                <CachedIcon />
              </Fab>
              {user ?
                <Fab color="primary" aria-label="add" onClick={goAddGame}>
                  <AddIcon />
                </Fab>
                :
                <div></div>
              }
            </div>
          </>
          {!dataLoaded ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div className='ion-text-center'>
                {noResults ? (
                  <>

                    <FormControl variant="standard" sx={{ minWidth: 300 }} className='register'>
                      <InputLabel id="filter-date-label"><b>Filtrar por fecha de lanzamiento</b></InputLabel>
                      <Select
                        labelId="filter-date-label"
                        id="filter-date-select"
                        value={filterDate}
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="">Todas las fechas</MenuItem>
                        <MenuItem value={moment().format('YYYY-MM-DD')}>Hoy</MenuItem>
                        <MenuItem value={moment().subtract(1, 'day').format('YYYY-MM-DD')}>Ayer</MenuItem>
                        <MenuItem value="lastMonth">Mes pasado</MenuItem>
                        <MenuItem value="lastYear">Año pasado</MenuItem>
                        <MenuItem value={moment().subtract(1, 'year').format('YYYY-MM-DD')}>Hace un año 🥳</MenuItem>
                      </Select>
                    </FormControl>


                    <Stack sx={{ width: '66%', marginLeft: 'auto', marginRight: 'auto' }}>
                      <br />
                      <Alert severity="info" sx={{ textAlign: 'center' }} variant="filled">
                        No se encontraron resultados
                      </Alert>
                      <br />
                    </Stack>
                  </>
                ) : (


                  <div className='items'>
                    <div className="filter-form">
                      <FormControl variant="standard" sx={{ minWidth: 300 }} className='register'>
                        <InputLabel id="filter-date-label"><b>Filtrar por fecha de lanzamiento</b></InputLabel>
                        <Select
                          labelId="filter-date-label"
                          id="filter-date-select"
                          value={filterDate}
                          onChange={handleFilterChange}
                        >
                          <MenuItem value="">Todas las fechas</MenuItem>
                          <MenuItem value={moment().format('YYYY-MM-DD')}>Hoy</MenuItem>
                          <MenuItem value={moment().subtract(1, 'day').format('YYYY-MM-DD')}>Ayer</MenuItem>
                          <MenuItem value="lastMonth">Mes pasado</MenuItem>
                          <MenuItem value="lastYear">Año pasado</MenuItem>
                          <MenuItem value={moment().subtract(1, 'year').format('YYYY-MM-DD')}>Hace un año 🥳</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {filteredList.map((videojuegos) => (
                      <IonCard key={videojuegos._id}>
                        <img alt="game img" src={videojuegos.imagen} width="200px" height="auto" className="centered-image" />
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
                )}
              </div>

            </>
          )}

        </div>

      </IonContent>
    </IonPage>
  );
};

export default InitialWindow;
