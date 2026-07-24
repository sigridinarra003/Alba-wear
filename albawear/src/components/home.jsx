import { useState, useEffect } from 'react';
import axios from 'axios';
import './home.css'; 

function Home({ irACarrito, irALogin, usuario, cerrarSesion }) {
  // ESTADOS
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [vistaActual, setVistaActual] = useState('inicio');
  
  // Estado para los productos reales de la Base de Datos
  const [productosBD, setProductosBD] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 📡 PETICIÓN A LA API DE NODE.JS
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

  // Función auxiliar para cambiar de categoría
  const cambiarCategoria = (categoria) => {
    setVistaActual(categoria);
    setMenuAbierto(false);
  };

  // 🔍 Filtrar los productos de la BD según la categoría elegida
  // (Asumiendo ID 1 = Remeras, ID 2 = Pantalones, ID 3 = Accesorios)
  const productosFiltrados = productosBD.filter((prod) => {
    if (vistaActual === 'remeras') return prod.id_categoria === 1;
    if (vistaActual === 'pantalones') return prod.id_categoria === 2;
    if (vistaActual === 'accesorios') return prod.id_categoria === 3;
    return true;
  });

  return (
    <div className="principal">
      <div className="fondo">
        <img src="/img/logo.png" className="logo" alt="logo" />
      </div>

      <div className="contenedor-navegacion">
        <nav>
          <ul className="lista">
            <li onClick={() => setVistaActual('inicio')}>Inicio</li>
            
            <li 
              className="item-menu-desplegable"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              Categorías ▾
              
              {menuAbierto && (
                <ul className="submenu-lista">
                  <li onClick={(e) => { e.stopPropagation(); cambiarCategoria('remeras'); }}>Remeras</li>
                  <li onClick={(e) => { e.stopPropagation(); cambiarCategoria('pantalones'); }}>Pantalones/Polleras</li>
                </ul>
              )}
            </li>

            <li onClick={() => cambiarCategoria('accesorios')}>Accesorios</li>
          </ul>
        </nav>

        {/* CONTENEDOR DE ÍCONOS */}
        <div className="iconos-derecha-nav">
          {!usuario ? (
            <button 
              onClick={irALogin} 
              className="btn-nav-icono"
              title="Iniciar Sesión"
            >
              👤
            </button>
          ) : (
            <div className="perfil-nav-contenedor">
              <span className="texto-bienvenida">¡Hola, {usuario.nombre}! </span>
              <button 
                onClick={cerrarSesion} 
                className="btn-cerrar-sesion"
                title="Cerrar Sesión"
              >
                Salir
              </button>
            </div>
          )}
          
          <button 
            onClick={irACarrito} 
            className="btn-nav-icono"
            title="Ver mi carrito"
          >
            🛒
          </button>
        </div>
      </div>

      {/* VISTA INDEPENDIENTE DE INICIO */}
      {vistaActual === 'inicio' ? (
        <>
          <div className="carrusel-wrapper">
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
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

            <h1> Productos Destacados</h1>
          </div>

          <div className="p-destacados">
            <img src="/img/p-1.jpg" alt="" />
            <img src="/img/r-2.jpg" alt="" />
            <img src="/img/p-3.png" alt="" />
            <img src="/img/p-4.png" alt="" />
          </div>
        </>
      ) : (
        /* VISTAS DE CATEGORÍAS CON DATOS DE MYSQL */
        <div className="vista-categoria-contenedor">
          
          <div className="titulo-seccion-contenedor">
            <span className="btn-categoria-indicador">
              {vistaActual === 'remeras' && 'Remeras'}
              {vistaActual === 'pantalones' && 'Pantalones/Polleras'}
              {vistaActual === 'accesorios' && 'Accesorios'}
            </span>
          </div>

          {cargando ? (
            <p style={{ textCenter: 'center', padding: '20px' }}>Cargando productos de la base de datos...</p>
          ) : (
            <div className="catalogo-productos-grid">
              {productosFiltrados.map((prod) => (
                <div className="tarjeta-producto" key={prod.id_producto}>
                  <div className="contenedor-foto-catalogo">
                    <img src={prod.imagen || '/img/placeholder.jpg'} alt={prod.nombre} />
                    <button className="btn-add-mini-carrito" title="Agregar al carrito">🛒</button>
                  </div>
                  <div className="info-producto-home">
                    <h3>{prod.nombre}</h3>
                    <p className="precio-home">${Number(prod.precio).toLocaleString('es-AR')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
      
      <footer className="pie-pagina">
        <div className="footer-columna">
          <h4>Contactanos</h4>
          <p>alba.wear@gmail.com</p>
        </div>
        
        <div className="footer-columna">
          <h4>Seguinos</h4>
          <div className="caja-redes">
            <span>📷</span> 
            <span>📘</span>
            <span>💬</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
