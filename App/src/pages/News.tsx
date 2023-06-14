import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { cyan, pink, indigo } from '@mui/material/colors';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import './News.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const News: React.FC = () => {

  const history = useHistory();
  const user = localStorage.getItem('user');

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [noticiaToDelete, setNoticiaToDelete] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
    },
  }));

  const handleEdit = (titulo: any) => {
    history.push(`/editnews/${titulo}`);
  };

  const handleDelete = async (titulo: React.SetStateAction<string>) => {
    setNoticiaToDelete(titulo);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/noticia/eliminarNoticia/${noticiaToDelete}`);

      setOpenDeleteDialog(false);
      window.location.reload(); // Recargar la página después de eliminar el videojuego
    } catch (error) {}
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  function goAddNews() {
    window.open("/addnews", "_self");
  }

  const [noticias, setNoticias] = useState([] as any[]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/noticia/listarNoticias')
      .then(response => {
        setNoticias(response.data.noticias);
        setDataLoaded(true);
      })
      .catch(() => {});
  }, []);

  function goNews() {
    window.open("/news", "_self");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Noticias</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <div style={{ overflowX: 'hidden' }}>

          <div className='ion-text-end' style={{ paddingTop: '8px', paddingRight: '8px' }}>
            <Fab color="primary" aria-label="add" onClick={goNews} style={{ marginRight: '8px' }}>
              <CachedIcon />
            </Fab>

            {user ?
              <Fab color="primary" aria-label="add" onClick={goAddNews}>
                <AddIcon />
              </Fab>
              :
              <div></div>
            }
          </div>

          {!dataLoaded ? (
            <p>Cargando...</p>
          ) : (
            <>

              {noticias.map(noticia => (

                <div className='item' key={noticia._id}>
                  <Box sx={{ flexGrow: 1, marginLeft: "20px", marginRight: "20px" }}>

                    <IonGrid>

                      <Item>
                        <img src={noticia.imagen} alt="game img" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                      </Item>

                      <Item className='newsContainer' sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", minHeight: "100%" }}>
                        <h2>
                          {noticia.titulo}
                        </h2>
                        <p className="ion-margin-top ion-margin-bottom">
                          {noticia.descripcion}
                        </p>
                        <p className="ion-margin-top ion-margin-bottom">
                          <b>Fecha: </b>{moment(noticia.fecha).format('DD/MM/YYYY')}
                        </p>
                        <p className="ion-margin-top ion-margin-bottom">
                          <b>Videojuego: </b>{noticia.videojuego}
                        </p>
                        <p className="ion-margin-top ion-margin-bottom">
                          <b>Autor: </b>{noticia.autor}
                        </p>
                        <p>
                          {'admin' === localStorage.getItem('user') && (
                            <ColorButtonEdit onClick={() => handleEdit(noticia.titulo)}>
                              <EditIcon />
                            </ColorButtonEdit>
                          )}

                          {noticia.autor === localStorage.getItem('user') && localStorage.getItem('user') !== 'admin' && (
                            <ColorButtonEdit onClick={() => handleEdit(noticia.titulo)}>
                              <EditIcon />
                            </ColorButtonEdit>
                          )}

                          {'    '}

                          {'admin' === localStorage.getItem('user') && (
                            <ColorButtonDelete onClick={() => handleDelete(noticia.titulo)}>
                              <DeleteIcon />
                            </ColorButtonDelete>
                          )}

                          {noticia.autor === localStorage.getItem('user') && localStorage.getItem('user') !== 'admin' && (
                            <ColorButtonDelete onClick={() => handleDelete(noticia.titulo)}>
                              <DeleteIcon />
                            </ColorButtonDelete>
                          )}
                        </p>
                      </Item>

                      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogContent>
                          <p>¿Deseas eliminar la noticia <b>{noticiaToDelete}</b>?</p>
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
            </>
          )}

        </div>

      </IonContent>
    </IonPage>
  );
};

export default News;
