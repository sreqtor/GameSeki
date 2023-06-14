import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonRouterLink } from '@ionic/react';
import React, { useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import './Profile.css';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { indigo, deepPurple, pink } from '@mui/material/colors';

const Profile: React.FC = () => {

  function goAbout() {
    window.open("/about", "_self");
  }

  const user = localStorage.getItem('user');
  const email = localStorage.getItem('email');

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  function goInicio() {
    window.open("/", "_self");
  }

  function goProfile() {
    window.open("/profile", "_self");
  }

  function goLogin() {
    window.open("/login", "_self");
  }

  function goRegister() {
    window.open("/register", "_self");
  }

  function goClose() {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    goProfile();
  }

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
    },
  }));

  const ColorButtonTwo = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(deepPurple[700]),
    backgroundColor: deepPurple[700],
    '&:hover': {
      backgroundColor: deepPurple[900],
    },
  }));

  const ColorButtonThree = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(pink[700]),
    backgroundColor: pink[700],
    '&:hover': {
      backgroundColor: pink[900],
    },
  }));

  const enviarCorreoRecuperacion = async () => {
    try {
      await axios.post('http://localhost:5000/api/correo/recuperar-pass', {
        email: email
      });

      setShowAlertSuccess(true);
      await delay(2000);
      goInicio();

    } catch (error) {}
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='ion-text-center'>
          {user ?
            <>
              <p><b>Usuario:</b> {user}</p>
              <p><b>Email:</b> {email}</p>
              <p><b>Contraseña: </b>
                <IonRouterLink onClick={enviarCorreoRecuperacion} style={{ textDecoration: 'underline' }}>
                  {'Cambiar contraseña'}
                </IonRouterLink>
              </p>
            </>
            :
            <>
              <br />
              <ColorButton
                onClick={goLogin}
                sx={{ my: 2, color: 'white', display: 'block', margin: '0 auto' }}
              >
                Iniciar Sesión
              </ColorButton>
            </>
          }

          {user ?
            <>
              <br />
              <ColorButtonThree
                onClick={goClose}
                sx={{ my: 2, color: 'white', display: 'block', margin: '0 auto' }}
              >
                Cerrar Sesión
              </ColorButtonThree>
            </>
            :
            <>
              <br />
              <ColorButtonTwo
                onClick={goRegister}
                sx={{ my: 2, color: 'white', display: 'block', margin: '0 auto' }}
              >
                Registrarse
              </ColorButtonTwo>
            </>
          }

          <br />

          {showAlertSuccess && (
            <IonRow className="ion-justify-content-center">
              <Stack sx={{ width: '90%' }} spacing={2}>
                <Alert severity="success">Revise su correo para cambiar la contraseña</Alert>
              </Stack>
            </IonRow>
          )}

          <br /><br />

          <IonRouterLink onClick={goAbout} style={{ textDecoration: 'underline' }}>
            <b>{'Acerca del sitio'}</b>
          </IonRouterLink>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;