import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import CachedIcon from '@mui/icons-material/Cached';
import './About.css';

const About: React.FC = () => {

    const [imgLoaded, setImgLoaded] = useState(false);

    function goAbout() {
        window.open("/about", "_self");
    }

    useEffect(() => {
        setTimeout(() => {
            setImgLoaded(true);
        }, 100);
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Acerca del sitio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <>
                    <div>
                        <div className='ion-text-end' style={{ paddingTop: '8px', paddingRight: '8px', paddingBottom: '8px' }}>
                            <Fab color="primary" aria-label="add" onClick={goAbout}>
                                <CachedIcon />
                            </Fab>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {imgLoaded ? (
                            <>
                                <img src='https://i.imgur.com/buwvpjt.jpg' height='350px' width='auto' alt='imagen acerca del sitio' />
                            </>
                        ) : (
                            <p>Cargando...</p>
                        )}
                    </div>

                    <p className='aboutTxt' style={{ padding: '10px', textAlign: 'justify' }} >
                        &#128126; Con esta aplicación web y aplicación móvil responsiva, podrás tener el control total sobre los juegos que has completado y los que están en tu lista de deseos. Además, también podrás mantenerte al día gracias al apartado de noticias.
                        <br /><br />
                        &#128126; El sitio tiene funciones como filtrado y búsqueda de videojuegos, listas de juegos completados y deseados (que podrás exportar a PDF), noticias y perfil de usuario.
                        <br /><br />
                        &#128126; Puedes acceder como invitado (sin sesión iniciada), con este perfil podrás visualizar las noticias y videojuegos pero no podrás crearlos y no dispondrás ni de lista de completados ni de lista de deseos.
                    </p>
                </>

            </IonContent>
        </IonPage>
    );
};

export default About;