import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ usuario, irAHome }) {
  const [productosBD, setProductosBD] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para formulario (crear / editar)
  const [idEditando, setIdEditando] = useState(null); // null = creando nuevo, ID = editando
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [idCategoria, setIdCategoria] = useState('1');
  const [esDestacado, setEsDestacado] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Traer lista de productos
  const obtenerProductos = () => {
    axios.get('http://localhost:5000/api/productos')
      .then((res) => {
        setProductosBD(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al traer productos:', err);
        setCargando(false);
      });
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Limpiar campos del formulario
  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setImagen('');
    setIdCategoria('1');
    setEsDestacado(false);
    setMostrarFormulario(false);
  };

  // Cargar datos para editar
  const prepararEdicion = (prod) => {
    setIdEditando(prod.id_producto);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setDescripcion(prod.descripcion || '');
    setImagen(prod.imagen || '');
    setIdCategoria(String(prod.id_categoria || '1'));
    setEsDestacado(Boolean(prod.es_destacado));
    setMostrarFormulario(true);
  };

  // Guardar (Crear o Editar)
  const manejarGuardarProducto = (e) => {
    e.preventDefault();

    const productoData = {
      nombre,
      precio: Number(precio),
      descripcion,
      imagen,
      id_categoria: Number(idCategoria),
      es_destacado: esDestacado,
      rolUsuario: usuario?.rol
    };

    if (idEditando) {
      // Petición PUT para editar
      axios.put(`http://localhost:5000/api/productos/${idEditando}`, productoData)
        .then(() => {
          alert('¡Producto editado con éxito!');
          limpiarFormulario();
          obtenerProductos();
        })
        .catch((err) => {
          console.error('Error al editar:', err);
          alert(err.response?.data?.error || 'Error al editar producto');
        });
    } else {
      // Petición POST para crear
      axios.post('http://localhost:5000/api/productos', productoData)
        .then(() => {
          alert('¡Producto creado con éxito!');
          limpiarFormulario();
          obtenerProductos();
        })
        .catch((err) => {
          console.error('Error al crear:', err);
          alert(err.response?.data?.error || 'Error al crear producto');
        });
    }
  };

  // Alternar Destacado directamente desde la tabla (Toggle rápido)
  const alternarDestacado = (prod) => {
    const productoData = {
      nombre: prod.nombre,
      precio: Number(prod.precio),
      descripcion: prod.descripcion,
      imagen: prod.imagen,
      id_categoria: Number(prod.id_categoria),
      es_destacado: !prod.es_destacado,
      rolUsuario: usuario?.rol
    };

    axios.put(`http://localhost:5000/api/productos/${prod.id_producto}`, productoData)
      .then(() => {
        obtenerProductos(); // Recarga la lista reflejando el cambio
      })
      .catch((err) => {
        console.error('Error al cambiar destacado:', err);
        alert('No se pudo actualizar el estado de destacado');
      });
  };

  // Eliminar Producto
  const eliminarProductoBD = (id_producto) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este producto?')) return;

    axios.delete(`http://localhost:5000/api/productos/${id_producto}`, {
      data: { rolUsuario: usuario?.rol }
    })
      .then(() => {
        alert('¡Producto eliminado con éxito!');
        setProductosBD(prev => prev.filter(p => p.id_producto !== id_producto));
      })
      .catch((err) => {
        console.error('Error al eliminar:', err);
        alert(err.response?.data?.error || 'Error al eliminar el producto');
      });
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
      <button 
        onClick={irAHome} 
        style={{ padding: '8px 15px', cursor: 'pointer', marginBottom: '20px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        ← Volver a la Tienda
      </button>

      <h2>Panel de Administración </h2>

      <button 
        onClick={() => {
          if (mostrarFormulario) limpiarFormulario();
          else setMostrarFormulario(true);
        }} 
        style={{ padding: '10px 15px', backgroundColor: '#5c3a3b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}
      >
        {mostrarFormulario ? 'Cancelar' : '+ Agregar Nuevo Producto'}
      </button>

      {/* Formulario Dinámico (Crear / Editar) */}
      {mostrarFormulario && (
        <form onSubmit={manejarGuardarProducto} style={{ background: '#f8f9fa', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3>{idEditando ? `Editando Producto #${idEditando}` : 'Nuevo Producto'}</h3>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Nombre del producto:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Precio ($):</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3" style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>URL de la Imagen:</label>
            <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="/img/foto.png" style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Categoría:</label>
            <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="1">Remeras (id: 1)</option>
              <option value="2">Pantalones/Polleras (id: 2)</option>
              <option value="3">Accesorios (id: 3)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="chkDestacado" 
              checked={esDestacado} 
              onChange={(e) => setEsDestacado(e.target.checked)} 
            />
            <label htmlFor="chkDestacado" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              Mostrar en "Productos Destacados" de la página principal ⭐
            </label>
          </div>

          <button type="submit" style={{ padding: '10px', backgroundColor: idEditando ? '#f0ad4e' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {idEditando ? 'Actualizar Cambios 💾' : 'Guardar Producto 💾'}
          </button>
        </form>
      )}

      {/* Tabla de Productos */}
      <h3>Inventario de Productos</h3>
      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#eee', borderBottom: '2px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Imagen</th>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Precio</th>
              <th style={{ padding: '10px' }}>Destacado</th>
              <th style={{ padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosBD.map((prod) => (
              <tr key={prod.id_producto} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{prod.id_producto}</td>
                <td style={{ padding: '10px' }}>
                  <img src={prod.imagen || '/img/placeholder.jpg'} alt={prod.nombre} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '10px' }}>{prod.nombre}</td>
                <td style={{ padding: '10px' }}>${Number(prod.precio).toLocaleString('es-AR')}</td>
                
                {/* Botón rápido para alternar destacado */}
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => alternarDestacado(prod)} 
                    style={{ background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px' }}
                    title="Hacé clic para cambiar estado destacado"
                  >
                    {prod.es_destacado ? '⭐ Sí' : '☆ No'}
                  </button>
                </td>

                <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => prepararEdicion(prod)} 
                    style={{ backgroundColor: '#72552b', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='%23fcf7f7' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3c!--Boxicons v3.0.8 https://boxicons.com %7c License https://docs.boxicons.com/free--%3e%3cpath d='M3.38 15.95c-.13.13-.22.29-.26.46l-1.08 4.34c-.09.34.01.7.26.95.19.19.45.29.71.29.08 0 .16 0 .24-.03l4.34-1.09c.18-.04.34-.13.46-.26L18.2 10.46l-4.67-4.67zM19.67 2.61c-.81-.81-2.14-.81-2.95 0l-1.78 1.78 4.67 4.67 1.78-1.78c.81-.81.81-2.13 0-2.95z'%3e%3c/path%3e%3c/svg%3e" alt="" /> Editar
                  </button>

                  <button 
                    onClick={() => eliminarProductoBD(prod.id_producto)} 
                    style={{ backgroundColor: '#ff0800', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='%23fcf7f7' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3c!--Boxicons v3.0.8 https://boxicons.com %7c License https://docs.boxicons.com/free--%3e%3cpath d='M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zm1 14H8v-8h2zm6 0h-2v-8h2z'%3e%3c/path%3e%3c/svg%3e" alt="" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;