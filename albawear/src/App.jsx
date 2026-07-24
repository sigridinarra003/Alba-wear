import { useState } from 'react';
import Home from './components/Home'; 
import Carrito from './components/Carrito'; 
import Login from './components/Login'; 

function App() {
  const [pantallaActual, setPantallaActual] = useState('home');
  
  // NUEVO ESTADO: Guarda la info del usuario cuando se loguea (empieza en null)
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const irACarrito = () => setPantallaActual('carrito');
  const irALogin = () => setPantallaActual('login');
  const irAHome = () => setPantallaActual('home');

  // FUNCIÓN PARA EL LOGIN: Guarda el usuario y te manda directo al Home
  const manejarInicioSesion = (datosDelUsuario) => {
    setUsuarioLogueado(datosDelUsuario); // Guardamos su nombre, mail, etc.
    setPantallaActual('home'); // Nos devuelve automáticamente al Home
  };

  // FUNCIÓN PARA CERRAR SESIÓN: Limpia el usuario
  const manejarCerrarSesion = () => {
    setUsuarioLogueado(null);
  };

  return (
    <div className="app-container">
      {/* Al Home le pasamos el usuario actual y la función de cerrar sesión */}
      {pantallaActual === 'home' && (
        <Home 
          irACarrito={irACarrito} 
          irALogin={irALogin} 
          usuario={usuarioLogueado}
          cerrarSesion={manejarCerrarSesion}
        />
      )}
      
      {pantallaActual === 'carrito' && <Carrito irAHome={irAHome} />}

      {/* Al Login le pasamos la función que se ejecuta cuando el usuario se registra o ingresa */}
      {pantallaActual === 'login' && (
        <Login irAHome={irAHome} onLoginExitoso={manejarInicioSesion} />
      )}
    </div>
  );
}

export default App;