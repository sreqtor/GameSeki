import Header from './components/Header';
import { Ruta } from './components/Ruta';
import "./App.css";
import { createContext, useState } from 'react';

export const ThemeContext = createContext(null);

export function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  return (
    <>
      <ThemeContext.Provider value={{theme, setTheme}}>
        
        <div className="App" id={theme}>
          <Header/>
          
          <Ruta/>
          
        </div>
        
      </ThemeContext.Provider>
    </>
  );
}

export default App;