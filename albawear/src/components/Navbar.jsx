import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ usuario, cerrarSesion, totalItemsCarrito }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="contenedor-navegacion">
      <nav>
        <ul className="lista">
          <li>
            <Link to="/" onClick={() => setMenuAbierto(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
              Inicio
            </Link>
          </li>

          <li
            className="item-menu-desplegable"
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={{ cursor: 'pointer' }}
          >
            Categorías ▾

            {menuAbierto && (
              <ul className="submenu-lista">
                <li onClick={(e) => { e.stopPropagation(); setMenuAbierto(false); navigate('/categoria/remeras'); }}>
                  Remeras
                </li>
                <li onClick={(e) => { e.stopPropagation(); setMenuAbierto(false); navigate('/categoria/pantalones'); }}>
                  Pantalones/Polleras
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/categoria/accesorios" onClick={() => setMenuAbierto(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
              Accesorios
            </Link>
          </li>
        </ul>
      </nav>

      {/* CONTENEDOR DE ÍCONOS */}
      <div className="iconos-derecha-nav">
        {usuario?.rol === 'admin' && (
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#5c3a3b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='white' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 6c-1.08 0-2-.92-2-2s.92-2 2-2 2 .92 2 2-.92 2-2 2'%3e%3c/path%3e%3cpath d='m20.42 13.4-.51-.29c.05-.37.08-.74.08-1.11s-.03-.74-.08-1.11l.51-.29c.96-.55 1.28-1.78.73-2.73l-1-1.73a2.006 2.006 0 0 0-2.73-.73l-.53.31c-.58-.46-1.22-.83-1.9-1.11v-.6c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v.6c-.67.28-1.31.66-1.9 1.11l-.53-.31c-.96-.55-2.18-.22-2.73.73l-1 1.73c-.55.96-.22 2.18.73 2.73l.51.29c-.05.37-.08.74-.08 1.11s.03.74.08 1.11l-.51.29c-.96.55-1.28 1.78-.73 2.73l1 1.73c.55.95 1.77 1.28 2.73.73l.53-.31c.58.46 1.22.83 1.9 1.11v.6c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-.6a8.7 8.7 0 0 0 1.9-1.11l.53.31c.95.55 2.18.22 2.73-.73l1-1.73c.55-.96.22-2.18-.73-2.73m-2.59-2.78c.11.45.17.92.17 1.38s-.06.92-.17 1.38a1 1 0 0 0 .47 1.11l1.12.65-1 1.73-1.14-.66c-.38-.22-.87-.16-1.19.14-.68.65-1.51 1.13-2.38 1.4-.42.13-.71.52-.71.96v1.3h-2v-1.3c0-.44-.29-.83-.71-.96-.88-.27-1.7-.75-2.38-1.4a1.01 1.01 0 0 0-1.19-.15l-1.14.66-1-1.73 1.12-.65c-.39-.22-.58-.68-.47-1.11-.11-.45-.17-.92-.17-1.38s.06-.93.17-1.38A1 1 0 0 0 5.7 9.5l-1.12-.65 1-1.73 1.14.66c.38.22.87.16 1.19-.14.68-.65 1.51-1.13 2.38-1.4.42-.13.71-.52.71-.96v-1.3h2v1.3c0 .44.29.83.71.96.88.27 1.7.75 2.38 1.4.32.31.81.36 1.19.14l1.14-.66 1 1.73-1.12.65c-.39.22-.58.68-.47 1.11Z'%3e%3c/path%3e%3c/svg%3e" alt="" />
            Panel Admin
          </button>
        )}

        {!usuario ? (
          <button onClick={() => navigate('/login')} className="btn-nav-icono" title="Iniciar Sesión">
            <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='currentColor' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5m0-8c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1m6-7h4c2.76 0 5 2.24 5 5H5c0-2.76 2.24-5 5-5'%3e%3c/path%3e%3c/svg%3e" alt="" />
          </button>
        ) : (
          <div className="perfil-nav-contenedor">
            <span className="texto-bienvenida">¡Hola, {usuario.nombre || usuario.nombres}! </span>
            <button onClick={cerrarSesion} className="btn-cerrar-sesion" title="Cerrar Sesión">
              Salir
            </button>
          </div>
        )}

        <button onClick={() => navigate('/carrito')} className="btn-nav-icono" title="Ver mi carrito" style={{ position: 'relative' }}>
          <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='currentColor' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12 2C9.24 2 7 4.24 7 7v1H4c-.55 0-1 .45-1 1v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-.55-.45-1-1-1h-3V7c0-2.76-2.24-5-5-5M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v1H9zm10 3v10H5V10z'%3e%3c/path%3e%3c/svg%3e" alt="" />
          {totalItemsCarrito > 0 && (
            <span className="badge-carrito" style={{
              position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#5c3a3b', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold'
            }}>
              {totalItemsCarrito}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Navbar;