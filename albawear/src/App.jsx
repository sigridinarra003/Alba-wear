import { useState } from 'react';
import Home from './components/Home'; 
import Carrito from './components/carrito'; 
import Login from './components/Login'; 
import Registro from './components/registro';

function App() {
  const [pantallaActual, setPantallaActual] = useState('home');
  
  // NUEVO ESTADO: Guarda la info del usuario cuando se loguea (empieza en null)
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [carrito, setCarrito] = useState([]);

  const irACarrito = () => setPantallaActual('carrito');
  const irALogin = () => setPantallaActual('login');
  const irAHome = () => setPantallaActual('home');
  const irAregistro = () => setPantallaActual('registro');
  // FUNCIÓN PARA EL LOGIN: Guarda el usuario y te manda directo al Home
  const manejarInicioSesion = (datosDelUsuario) => {
    setUsuarioLogueado(datosDelUsuario); // Guardamos su nombre, mail, etc.
    setPantallaActual('home'); // Nos devuelve automáticamente al Home
  };

  // FUNCIÓN PARA CERRAR SESIÓN: Limpia el usuario
  const manejarCerrarSesion = () => {
    setUsuarioLogueado(null);
  };
    
 // ==========================================
  // 🛍️ FUNCIONES DEL CARRITO (ACTUALIZADAS CON TALLES)
  // ==========================================

  // 1. Agregar producto al carrito evaluando id y talle seleccionado
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

  // 2. Modificar cantidad (+ / -) dentro del carrito filtrando por producto y talle
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

  // 3. Eliminar producto individual del carrito según su id y talle exacto
  const eliminarProducto = (id_producto, talleElegido) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter(
        (item) => !(item.id_producto === id_producto && item.talleElegido === talleElegido)
      )
    );
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
          agregarAlCarrito={agregarAlCarrito}
          totalItemsCarrito={carrito.reduce((acc, item) => acc + item.cantidad, 0)}
        />
      )}
      
      {pantallaActual === 'carrito' && (
      <Carrito  
      carrito={carrito}
      modificarCantidad={modificarCantidad}
      eliminarProducto={eliminarProducto}
      irAHome={irAHome} 
      />
      )}
         
      {/* Al Login le pasamos la función que se ejecuta cuando el usuario se registra o ingresa */}
      {pantallaActual === 'login' && (
        <Login irAHome={irAHome} onLoginExitoso={manejarInicioSesion} irAregistro={irAregistro} />
      )}

      {/* NUEVA VISTA DE REGISTRO */}
      {pantallaActual === 'registro' && (
        <Registro irAHome={irAHome} irALogin={irALogin} />
)}
    </div>
  );
}

export default App;