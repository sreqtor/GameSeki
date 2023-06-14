import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, search, newspaper, bookmarks, checkmarkDone, person } from 'ionicons/icons';
import Tab1 from './pages/InitialWindow';
import Tab2 from './pages/Buscador';
import Tab3 from './pages/News';
import Tab4 from './pages/Wishlist';
import Tab5 from './pages/Completed';
import Tab6 from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import MailPass from './pages/MailPass';
import EditNews from './pages/EditNews';
import AddNews from './pages/AddNews';
import AddGame from './pages/AddGame';
import EditGame from './pages/EditGame';
import About from './pages/About';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import "./App.css";

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  
  function goInicio() {    
    window.open("/", "_self");
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/main">
              <Tab1 />
            </Route>
            <Route exact path="/search">
              <Tab2 />
            </Route>
            <Route path="/news">
              <Tab3 />
            </Route>
            <Route path="/wishlist">
              <Tab4 />
            </Route>
            <Route path="/completed">
              <Tab5 />
            </Route>
            <Route path="/profile">
              <Tab6 />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/mail-pass">
              <MailPass />
            </Route>
            <Route path="/editnews/:titulo">
              <EditNews />
            </Route>
            <Route path="/addnews">
              <AddNews />
            </Route>
            <Route path="/addgame">
              <AddGame />
            </Route>
            <Route path="/editgame/:nombre">
              <EditGame />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route exact path="/">
              <Redirect to="/main" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom" className="small-tab-bar">
            <IonTabButton tab="tab1" onClick={goInicio} style={{ color: '#0097A7' }}>
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>Inicio</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/search">
              <IonIcon aria-hidden="true" icon={search} />
              <IonLabel>Buscador</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/news">
              <IonIcon aria-hidden="true" icon={newspaper} />
              <IonLabel>Noticias</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href="/wishlist">
              <IonIcon aria-hidden="true" icon={bookmarks} />
              <IonLabel>Lista de deseos</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab5" href="/completed">
              <IonIcon aria-hidden="true" icon={checkmarkDone} />
              <IonLabel>Completados</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab6" href="/profile">
              <IonIcon aria-hidden="true" icon={person} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
