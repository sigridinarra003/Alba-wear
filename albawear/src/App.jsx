import { useState } from 'react';
import Home from './components/home'; 
import Carrito from './components/carrito'; 
import Login from './components/Login'; 
import Registro from './components/registro';
import Dashboard from './components/dashboard'; // Ajustá la ruta si tu Dashboard está en otra carpeta
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const [pantallaActual, setPantallaActual] = useState('home');
  
  // Estado del usuario logueado
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [carrito, setCarrito] = useState([]);

  // Funciones de navegación
  const irACarrito = () => setPantallaActual('carrito');
  const irALogin = () => setPantallaActual('login');
  const irAHome = () => setPantallaActual('home');
  const irAregistro = () => setPantallaActual('registro');
  const irADashboard = () => setPantallaActual('dashboard');

  // Función de inicio de sesión
  const manejarInicioSesion = (datosDelUsuario) => {
    setUsuarioLogueado(datosDelUsuario);
    // Si el usuario es admin, lo podemos redirigir directo al dashboard
    if (datosDelUsuario?.rol === 'admin') {
      setPantallaActual('dashboard');
    } else {
      setPantallaActual('home');
    }
  };

  // Función de cierre de sesión
  const manejarCerrarSesion = () => {
    setUsuarioLogueado(null);
    setPantallaActual('home');
  };
    
  // ==========================================
  // 🛍️ FUNCIONES DEL CARRITO
  // ==========================================

  const agregarAlCarrito = (productoNuevo) => {
    setCarrito((prevCarrito) => {
      const indexExistente = prevCarrito.findIndex(
        (item) => 
          item.id_producto === productoNuevo.id_producto && 
          item.talleElegido === productoNuevo.talleElegido
      );

      if (indexExistente >= 0) {
        const nuevoCarrito = [...prevCarrito];
        nuevoCarrito[indexExistente].cantidad += 1;
        return nuevoCarrito;
      } else {
        return [...prevCarrito, { ...productoNuevo, cantidad: 1 }];
      }
    });
  };

  const modificarCantidad = (id_producto, talleElegido, accion) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) => {
        if (item.id_producto === id_producto && item.talleElegido === talleElegido) {
          if (accion === 'sumar') {
            return { ...item, cantidad: item.cantidad + 1 };
          } else if (accion === 'restar' && item.cantidad > 1) {
            return { ...item, cantidad: item.cantidad - 1 };
          }
        }
        return item;
      })
    );
  };

  const eliminarProducto = (id_producto, talleElegido) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter(
        (item) => !(item.id_producto === id_producto && item.talleElegido === talleElegido)
      )
    );
  };

  return (
    <div className="app-container">
      {/* 🏠 VISTA HOME */}
      {pantallaActual === 'home' && (
        <Home 
          irACarrito={irACarrito} 
          irALogin={irALogin} 
          irADashboard={irADashboard}
          usuario={usuarioLogueado}
          cerrarSesion={manejarCerrarSesion}
          agregarAlCarrito={agregarAlCarrito}
          totalItemsCarrito={carrito.reduce((acc, item) => acc + item.cantidad, 0)}
        />
      )}
      
      {/* 🛒 VISTA CARRITO */}
      {pantallaActual === 'carrito' && (
        <Carrito  
          carrito={carrito}
          modificarCantidad={modificarCantidad}
          eliminarProducto={eliminarProducto}
          irAHome={irAHome} 
        />
      )}
          
      {/* 🔐 VISTA LOGIN */}
      {pantallaActual === 'login' && (
        <Login irAHome={irAHome} onLoginExitoso={manejarInicioSesion} irAregistro={irAregistro} />
      )}

      {/* 📝 VISTA REGISTRO */}
      {pantallaActual === 'registro' && (
        <Registro irAHome={irAHome} irALogin={irALogin} />
      )}

      {/* 📊 VISTA DASHBOARD (PROTEGIDA SOLO PARA ADMIN) */}
      {pantallaActual === 'dashboard' && (
        usuarioLogueado?.rol === 'admin' ? (
          <Dashboard usuario={usuarioLogueado} irAHome={irAHome} />
        ) : (
          /* Si intenta entrar alguien que no es admin, renderiza Home */
          <Home 
            irACarrito={irACarrito} 
            irALogin={irALogin} 
            irADashboard={irADashboard}
            usuario={usuarioLogueado}
            cerrarSesion={manejarCerrarSesion}
            agregarAlCarrito={agregarAlCarrito}
            totalItemsCarrito={carrito.reduce((acc, item) => acc + item.cantidad, 0)}
          />
        )
      )}
    </div>
  );
}

export default App;