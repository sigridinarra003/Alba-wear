import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import CategoriaVista from './components/CategoriaVista';
import DetalleProducto from './components/DetalleProductos';
import Carrito from './components/carrito';
import Login from './components/Login';
import Registro from './components/registro';
import Dashboard from './components/dashboard';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const usuarioGuardado = localStorage.getItem('alba_usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('alba_carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('alba_carrito', JSON.stringify(carrito));
  }, [carrito]);

  const manejarInicioSesion = (datosDelUsuario) => {
    setUsuarioLogueado(datosDelUsuario);
    localStorage.setItem('alba_usuario', JSON.stringify(datosDelUsuario));
  };

  const manejarCerrarSesion = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem('alba_usuario');
  };

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

  

  const propsComunes = {
    usuario: usuarioLogueado,
    cerrarSesion: manejarCerrarSesion,
    agregarAlCarrito: agregarAlCarrito,
    totalItemsCarrito: carrito.reduce((acc, item) => acc + item.cantidad, 0)
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home {...propsComunes} />} />
          <Route path="/categoria/:nombreCategoria" element={<CategoriaVista {...propsComunes} />} />
          <Route path="/producto/:id" element={<DetalleProducto {...propsComunes} />} />

          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                modificarCantidad={modificarCantidad}
                eliminarProducto={eliminarProducto}
              />
            }
          />

          <Route path="/login" element={<Login onLoginExitoso={manejarInicioSesion} />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/dashboard"
            element={
              usuarioLogueado?.rol === 'admin' ? (
                <Dashboard usuario={usuarioLogueado} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;