import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import React, { useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import './Login.css';

const Login: React.FC = () => {

  function goInicio() {
    window.open("/", "_self");
  }

  function goMailPass() {
    window.open("/mail-pass", "_self");
  }

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
    },
  }));

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  //const { setUser } = useContext(UserContext);

  const handleButtonClick = async () => {
    const logedUser = {
      email,
      password
    };

    const requestBody = JSON.stringify(logedUser);

    try {
      const response = await axios.post('http://localhost:5000/api/user/login', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      //Mensaje de inicio correcto - Ir a inicio y cambiar botones header
      setShowAlertSuccess(true);
      await delay(1500); // Espera de 1.5 segundos
      const user = response.data.nombre;
      setUser(user);
      const email = response.data.email;
      setEmail(email);
      localStorage.setItem('user', user);
      localStorage.setItem('email', email);
      goInicio();
    } catch (error) {
      setShowAlertError(true);
      await delay(5000); // Espera de 5 segundos
      setShowAlertError(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
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
              id="outlined-required"
              label="Email"
              variant="filled"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField className='register'
              id="outlined-required"
              label="Contraseña"
              variant="filled"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <IonRouterLink onClick={goMailPass} style={{ textDecoration: 'underline' }}>
              <b>{'Recuperar contraseña'}</b>
            </IonRouterLink>
            <ColorButton variant="contained" onClick={handleButtonClick}>Iniciar sesión</ColorButton>
            <div className='center'>
              {showAlertSuccess && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="success">Inicio de sesión correcto</Alert>
                </Stack>
              )}
            </div>

            <div className='center'>
              {showAlertError && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="error">Inicio de sesión fallido</Alert>
                </Stack>
              )}
            </div>
          </Stack>

        </Box>

      </IonContent>
    </IonPage>
  );
};

export default Login;