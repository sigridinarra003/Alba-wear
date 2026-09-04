import { useState, useEffect } from 'react';
import axios from 'axios';
import './home.css';

function Home({ irACarrito, irALogin, usuario, cerrarSesion, agregarAlCarrito, totalItemsCarrito }) {
  // ESTADOS
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [vistaActual, setVistaActual] = useState('inicio');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');

  // 📝 ESTADOS PARA EL FORMULARIO DE NUEVO PRODUCTO
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaImagen, setNuevaImagen] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('1'); // Por defecto categoría 1 (Remeras)

  // Estado para los productos reales de la Base de Datos
  const [productosBD, setProductosBD] = useState([]);
  const [cargando, setCargando] = useState(true);


  // 🚀 FUNCIÓN PARA CREAR PRODUCTO EN LA BD
  const manejarCrearProducto = (e) => {
    e.preventDefault();

    const productoData = {
      nombre: nuevoNombre,
      precio: Number(nuevoPrecio),
      descripcion: nuevaDescripcion,
      imagen: nuevaImagen,
      id_categoria: Number(nuevaCategoria), // Aseguramos que sea número
      rolUsuario: usuario?.rol // Enviamos el rol para validarlo en el backend
    };

    axios.post('http://localhost:5000/api/productos', productoData)
      .then((res) => {
        alert('¡Producto creado con éxito!');

        // Limpiamos el formulario y lo cerramos
        setNuevoNombre('');
        setNuevoPrecio('');
        setNuevaDescripcion('');
        setNuevaImagen('');
        setMostrarFormulario(false);

        // Opcional: Recargamos la página o agregamos el producto al estado local para que aparezca al instante
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error al crear producto:', err);
        alert(err.response?.data?.error || 'Error al guardar el producto');
      });
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // 🗑️ FUNCIÓN PARA ELIMINAR PRODUCTO
  const eliminarProductoBD = (id_producto) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este producto?')) return;

    axios.delete(`http://localhost:5000/api/productos/${id_producto}`, {
      data: { rolUsuario: usuario?.rol } // Enviamos el rol para validarlo en el backend
    })
      .then((res) => {
        alert('¡Producto eliminado con éxito!');
        // Actualizamos la pantalla filtrando el producto borrado del estado local
        setProductosBD(prevProductos => prevProductos.filter(p => p.id_producto !== id_producto));
      })
      .catch((err) => {
        console.error('Error al eliminar:', err);
        alert(err.response?.data?.error || 'Error al eliminar el producto');
      });
  };

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
            <li onClick={() => setVistaActual('inicio')} style={{ cursor: 'pointer' }}>Inicio</li>

            <li
              className="item-menu-desplegable"
              onClick={() => setMenuAbierto(!menuAbierto)}
              style={{ cursor: 'pointer' }}
            >
              Categorías ▾

              {menuAbierto && (
                <ul className="submenu-lista">
                  <li onClick={(e) => { e.stopPropagation(); cambiarCategoria('remeras'); }}>Remeras</li>
                  <li onClick={(e) => { e.stopPropagation(); cambiarCategoria('pantalones'); }}>Pantalones/Polleras</li>
                </ul>
              )}
            </li>

            <li onClick={() => cambiarCategoria('accesorios')} style={{ cursor: 'pointer' }}>Accesorios</li>
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
              <span className="texto-bienvenida">¡Hola, {usuario.nombre || usuario.nombres}! </span>
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
            style={{ position: 'relative' }}
          >
            🛒
            {totalItemsCarrito > 0 && (
              <span className="badge-carrito" style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#5c3a3b',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {totalItemsCarrito}
              </span>
            )}
          </button>
        </div>
        {usuario?.rol === 'admin' && (
          <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Panel de Administrador 🛠️</h3>
            <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="btn-compra">
              {mostrarFormulario ? 'Cancelar' : '+ Agregar Nuevo Producto'}
            </button>

            {usuario?.rol === 'admin' && (
              <div style={{ background: '#f8f9fa', border: '1px solid #ccc', padding: '20px', margin: '20px auto', maxWidth: '600px', borderRadius: '8px' }}>
                <h3>Panel de Administrador 🛠️</h3>
                <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="btn-compra" style={{ marginBottom: '15px' }}>
                  {mostrarFormulario ? 'Cancelar' : '+ Agregar Nuevo Producto'}
                </button>

                {/* Formulario desplegable */}
                {mostrarFormulario && (
                  <form onSubmit={manejarCrearProducto} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold' }}>Nombre del producto:</label>
                      <input
                        type="text"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold' }}>Precio ($):</label>
                      <input
                        type="number"
                        value={nuevoPrecio}
                        onChange={(e) => setNuevoPrecio(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold' }}>Descripción:</label>
                      <textarea
                        value={nuevaDescripcion}
                        onChange={(e) => setNuevaDescripcion(e.target.value)}
                        rows="3"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold' }}>URL de la Imagen (ej: /img/remera.png o link):</label>
                      <input
                        type="text"
                        value={nuevaImagen}
                        onChange={(e) => setNuevaImagen(e.target.value)}
                        placeholder="/img/tu-foto.png"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold' }}>Categoría:</label>
                      <select
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      >
                        <option value="1">Remeras (id: 1)</option>
                        <option value="2">Pantalones/Polleras (id: 2)</option>
                        <option value="3">Accesorios (id: 3)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      style={{ padding: '10px', backgroundColor: '#5c3a3b', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                    >
                      Guardar Producto en la Base de Datos 💾
                    </button>

                  </form>
                )}
              </div>
            )}
          </div>
        )}

      </div>


      {/* ========================================= */}
      {/* 1. VISTA INDEPENDIENTE DE INICIO          */}
      {/* ========================================= */}
      {vistaActual === 'inicio' && (
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

       {/* 🌟 DESTACADOS DINÁMICOS DESDE LA BASE DE DATOS */}
          <div className="p-destacados">
            {cargando ? (
              <p>Cargando destacados...</p>
            ) : (
              productosBD.slice(0, 4).map((prod) => (
                <div key={prod.id_producto} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={prod.imagen || '/img/placeholder.jpg'}
                    alt={prod.nombre}
                    onClick={() => {
                      setProductoSeleccionado(prod);
                      setTalleSeleccionado('');
                      setVistaActual('detalle');
                    }}
                    style={{ cursor: 'pointer', objectFit: 'cover' }}
                  />

                  {/* 🗑️ BOTÓN DE ELIMINAR EN DESTACADOS */}
                  {usuario?.rol === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarProductoBD(prod.id_producto);
                      }}
                      style={{
                        backgroundColor: '#d9534f',
                        color: 'white',
                        border: 'none',
                        padding: '6px',
                        marginTop: '8px',
                        width: '100%',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ========================================= */}
      {/* 2. VISTA DE DETALLE DEL PRODUCTO          */}
      {/* ========================================= */}
      {vistaActual === 'detalle' && productoSeleccionado && (
        <div className="vista-detalle-producto" style={{ padding: '40px', textAlign: 'center' }}>
          <button
            onClick={() => {
              setVistaActual('inicio');
              setTalleSeleccionado('');
            }}
            style={{ marginBottom: '30px', cursor: 'pointer', padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
          >
            ← Volver al catálogo
          </button>

          <div className="detalle-contenido" style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <img
              src={productoSeleccionado.imagen || '/img/placeholder.jpg'}
              alt={productoSeleccionado.nombre}
              style={{ width: '400px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div className="detalle-info" style={{ textAlign: 'left', maxWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ marginBottom: '15px' }}>{productoSeleccionado.nombre}</h2>
              <p style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
                {productoSeleccionado.descripcion || 'Sin descripción disponible.'}
              </p>
              <h3 style={{ fontSize: '28px', color: '#222', marginBottom: '20px' }}>
                ${Number(productoSeleccionado.precio).toLocaleString('es-AR')}
              </h3>

              {/* 👕 SECCIÓN DE SELECCIÓN DE TALLES (SOLO SI NO ES ACCESORIO) */}
              {productoSeleccionado.id_categoria !== 3 && (
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Seleccioná el talle:</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['S', 'M', 'L', 'XL'].map((talle) => (
                      <button
                        key={talle}
                        type="button"
                        onClick={() => setTalleSeleccionado(talle)}
                        style={{
                          padding: '8px 16px',
                          border: talleSeleccionado === talle ? '2px solid #5c3a3b' : '1px solid #ccc',
                          backgroundColor: talleSeleccionado === talle ? '#5c3a3b' : '#fff',
                          color: talleSeleccionado === talle ? '#fff' : '#000',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        {talle}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn-compra"
                onClick={() => {
                  // Si es accesorio (id_categoria 3), asignamos "Único". Si no, validamos que haya elegido talle.
                  const esAccesorio = productoSeleccionado.id_categoria === 3;
                  const talleFinal = esAccesorio ? 'Único' : talleSeleccionado;

                  if (!esAccesorio && !talleSeleccionado) {
                    alert('Por favor, seleccioná un talle antes de agregar al carrito.');
                    return;
                  }

                  // Creamos el objeto del producto agregándole la propiedad talleElegido
                  const productoConTalle = {
                    ...productoSeleccionado,
                    talleElegido: talleFinal
                  };

                  agregarAlCarrito(productoConTalle);

                  if (esAccesorio) {
                    alert('¡Accesorio agregado al carrito!');
                  } else {
                    alert(`¡Producto agregado al carrito en talle ${talleSeleccionado}!`);
                  }
                }}
                style={{ padding: '15px', backgroundColor: '#5c3a3b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Agregar al carrito 🛒
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 3. VISTAS DE CATEGORÍAS (CATÁLOGO)         */}
      {/* ========================================= */}
      {vistaActual !== 'inicio' && vistaActual !== 'detalle' && (
        <div className="vista-categoria-contenedor">

          <div className="titulo-seccion-contenedor">
            <span className="btn-categoria-indicador">
              {vistaActual === 'remeras' && 'Remeras'}
              {vistaActual === 'pantalones' && 'Pantalones/Polleras'}
              {vistaActual === 'accesorios' && 'Accesorios'}
            </span>
          </div>

          {cargando ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Cargando productos de la base de datos...</p>
          ) : (
            <div className="catalogo-productos-grid">
              {productosFiltrados.map((prod) => (
                <div className="tarjeta-producto" key={prod.id_producto}>
                  <div className="contenedor-foto-catalogo">
                    <img
                      src={prod.imagen || '/img/placeholder.jpg'}
                      alt={prod.nombre}
                      onClick={() => {
                        setProductoSeleccionado(prod);
                        setTalleSeleccionado('');
                        setVistaActual('detalle');
                      }}
                      style={{ cursor: 'pointer' }}
                    />

                    <button
                      className="btn-add-mini-carrito"
                      title="Ver detalle / Agregar"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductoSeleccionado(prod);
                        setTalleSeleccionado('');
                        setVistaActual('detalle');
                      }}
                    >
                      🛒
                    </button>
                  </div>
                  
                  <div className="info-producto-home">
                    <h3>{prod.nombre}</h3>
                    <p className="precio-home">${Number(prod.precio).toLocaleString('es-AR')}</p>
                  </div>

                  {/* 🗑️ BOTÓN DE ELIMINAR EN CATEGORÍAS (Visible solo para Admin) */}
                  {usuario?.rol === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarProductoBD(prod.id_producto);
                      }}
                      style={{
                        backgroundColor: '#d9534f',
                        color: 'white',
                        border: 'none',
                        padding: '8px',
                        margin: '10px',
                        width: 'calc(100% - 20px)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Eliminar Producto
                    </button>
                  )}
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