import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import Navbar from './Navbar';
import CatalogoProductos from './CatalogoProductos';

function Home({ usuario, cerrarSesion, agregarAlCarrito, totalItemsCarrito }) {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [productosBD, setProductosBD] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
      .then((res) => {
        setProductosBD(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al traer los productos desde MySQL:', err);
        setCargando(false);
      });
  }, []);

  const productosFiltrados = productosBD.filter((prod) =>
    prod.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="principal">
      {/* 1. BANNER PROMOCIONAL */}
      <div className="banner-promocional">
        <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='black' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m0 18c-.34 0-.67-.03-1-.07V18l-1-1-2-2v-2l-2-2-1.57-1.57C5.5 6.28 8.49 4 12 4c1.06 0 2.07.21 3 .59V5c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2v3h4c1.1 0 2 .9 2 2v1c.69 0 1.68.35 2.33.87A7.97 7.97 0 0 1 12 20'%3e%3c/path%3e%3c/svg%3e" alt="" /> Envíos gratis a partir de $50.000 | <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='black' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M20 7h-3V3c0-.33-.16-.64-.43-.82a.98.98 0 0 0-.92-.11L3.28 6.82C2.51 7.11 2 7.87 2 8.69V20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2m-5-2.54V7H8.39zM4 20V9h16v2h-5c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h5v2zm16-4h-5v-3h5z'%3e%3c/path%3e%3c/svg%3e" alt="" /> 3 cuotas sin interés
      </div>

      <div className="fondo">
        <img src="/img/logo.png" className="logo" alt="logo" />
      </div>

      {/* NAVBAR */}
      <Navbar 
        usuario={usuario} 
        cerrarSesion={cerrarSesion} 
        totalItemsCarrito={totalItemsCarrito} 
      />

      {/* 2. BUSCADOR EN TIEMPO REAL */}
      <div className='barra-busqueda'>
        <input
          className='contenedor-buscador'
          type="text"
          placeholder="Buscar prendas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* SI EL USUARIO ESTÁ BUSCANDO ALGO */}
      {busqueda.trim() !== '' ? (
        <div className="vista-categoria-contenedor" style={{ padding: '30px', textAlign: 'center' }}>
          <h2>Resultados para: "{busqueda}"</h2>
          <CatalogoProductos 
            productos={productosFiltrados} 
            onSeleccionarProducto={(prod) => navigate(`/producto/${prod.id_producto}`)} 
          />
        </div>
      ) : (
        <>
          <div className="carrusel-wrapper">
            <div
              id="carouselExampleControls"
              className="carousel slide"
              data-bs-ride="carousel"
              data-bs-interval="3000"
            >
              <div className="carousel-inner mb-5">
                <div className="carousel-item active">
                  <img src="/img/imagen1.png" className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="/img/imagen2.png" className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="/img/imagen3.png" className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="/img/imagen4.png" className="d-block w-100" alt="..." />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          <h1 className='titulo-PD'>Productos Destacados</h1>

          <div className="p-destacados">
            {cargando ? (
              <p>Cargando destacados...</p>
            ) : (
              productosBD
                .filter((prod) => Boolean(prod.es_destacado))
                .map((prod) => (
                  <div
                    key={prod.id_producto}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                      src={prod.imagen || '/img/placeholder.jpg'}
                      alt={prod.nombre}
                      onClick={() => navigate(`/producto/${prod.id_producto}`)}
                      style={{ cursor: 'pointer', objectFit: 'cover' }}
                    />
                    <h3>{prod.nombre}</h3>
                    <p>${Number(prod.precio).toLocaleString('es-AR')}</p>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      <footer className="pie-pagina">
        <div className="footer-columna">
          <h4>Informacion de nosotros</h4>
          <p>Tu tienda online de indumentaria y accesorios.</p>
        </div>
        <div className='caja-logo-fott'>
          <img className='logo-fotter' src="/img/logo.png" alt="" />
        </div>
        <div className="footer-columna">
          <h4>Contactos</h4>
          <div className="caja-redes">
            <span><img src="data:image/svg+xml,%3csvg width='24' height='24' fill='currentColor' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248m0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008m4.807-8.875a1.078 1.078 0 1 0 0 2.156 1.078 1.078 0 1 0 0-2.156'%3e%3c/path%3e%3cpath d='M20.533 6.111A4.6 4.6 0 0 0 17.9 3.479a6.6 6.6 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.6 6.6 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.6 6.6 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71s0 2.753.056 3.71c.015.748.156 1.486.419 2.187a4.6 4.6 0 0 0 2.634 2.632 6.6 6.6 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.6 6.6 0 0 0 2.186-.419 4.6 4.6 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.6 6.6 0 0 0-.421-2.217m-1.218 9.532a5 5 0 0 1-.311 1.688 3 3 0 0 1-1.712 1.711 5 5 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a5 5 0 0 1-1.669-.311 3 3 0 0 1-1.719-1.711 5.1 5.1 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654s0-2.686.053-3.655a5 5 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5 5 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a5 5 0 0 1 1.67.311 3 3 0 0 1 1.712 1.712 5.1 5.1 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655s0 2.698-.043 3.654z'%3e%3c/path%3e%3c/svg%3e" alt="" /></span>
            <span><img src="data:image/svg+xml,%3csvg width='24' height='24' fill='currentColor' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592q1.05-.003 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1'%3e%3c/path%3e%3c/svg%3e" alt="" /></span>
            <span><img src="data:image/svg+xml,%3csvg width='24' height='24' fill='currentColor' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' d='M18.403 5.633A8.92 8.92 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a9 9 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.93 8.93 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.45 7.45 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.45 7.45 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.4 7.4 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73s-.354-.112-.504.112-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393s.149-.224.224-.374.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a10 10 0 0 0-.429-.008.83.83 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321 1.582 2.415 3.832 3.387c.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066s.187-.973.131-1.067-.207-.151-.43-.263' clip-rule='evenodd'%3e%3c/path%3e%3c/svg%3e" alt="" /></span>
            <span><img src="data:image/svg+xml,%3csvg width='24' height='24' fill='black' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M20 4H4c-1.1 0-2 .9-2 2v.25l10 7.5 10-7.5V6c0-1.1-.9-2-2-2m1.93 14.51c.04-.16.07-.33.07-.51V8.75l-5.62 4.22 5.55 5.55ZM12.6 15.8c-.18.13-.39.2-.6.2s-.42-.07-.6-.2l-2.16-1.62-5.75 5.75c.16.04.33.07.51.07h16c.18 0 .35-.03.51-.07l-5.75-5.75zM2 8.75V18c0 .18.03.35.07.51l5.55-5.55L2 8.74Z'%3e%3c/path%3e%3c/svg%3e" alt="" /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;