import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import CachedIcon from '@mui/icons-material/Cached';
import Spline from '@splinetool/react-spline';

export function About() {
  const [splinesLoaded, setSplinesLoaded] = useState(false);

  function goAbout() {
    window.open("/about", "_self");
  }

  useEffect(() => {
    setTimeout(() => {
      setSplinesLoaded(true);
    }, 100);
  }, []);

  return (
    <>
      <h1>Acerca del sitio</h1>

      <div className="container">
        <div className="addButtonInWin">
          <Fab color="primary" aria-label="add" onClick={goAbout}>
            <CachedIcon />
          </Fab>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {splinesLoaded ? (
          <>
            <Spline scene="https://prod.spline.design/TwmywsRnHxzbDaII/scene.splinecode" style={{ width: '700px', height: '500px', backgroundColor: 'transparent' }} alt='keyboardModel' className='onlyBigScreen' />

            <img src='https://i.imgur.com/buwvpjt.jpg' height='350px' width='auto' alt='imagen acerca del sitio' />

            <Spline scene="https://prod.spline.design/G-6UFEfX8NuM2TDF/scene.splinecode" style={{ width: '700px', height: '500px', backgroundColor: 'transparent' }} alt='controllerModel' className='onlyBigScreen' />
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      <p className='aboutTxt'>
        &#128126; Con esta aplicación web y aplicación móvil responsiva, podrás tener el control total sobre los juegos que has completado y los que están en tu lista de deseos. Además, también podrás mantenerte al día gracias al apartado de noticias.
        <br /><br />
        &#128126; El sitio tiene funciones como filtrado y búsqueda de videojuegos, listas de juegos completados y deseados (que podrás exportar a PDF), noticias y perfil de usuario.
        <br /><br />
        &#128126; Puedes acceder como invitado (sin sesión iniciada), con este perfil podrás visualizar las noticias y videojuegos pero no podrás crearlos y no dispondrás ni de lista de completados ni de lista de deseos.
      </p>
    </>
  )
}
