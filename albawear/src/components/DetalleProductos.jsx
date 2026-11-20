import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

function DetalleProducto({ usuario, cerrarSesion, agregarAlCarrito, totalItemsCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/productos`)
      .then((res) => {
        const encontrado = res.data.find(p => p.id_producto === Number(id));
        setProducto(encontrado);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <p style={{ textAlign: 'center', padding: '50px' }}>Cargando detalle...</p>;
  if (!producto) return <p style={{ textAlign: 'center', padding: '50px' }}>Producto no encontrado.</p>;

  const esAccesorio = producto.id_categoria === 3;

  return (
    <div className="principal">
      <Navbar usuario={usuario} cerrarSesion={cerrarSesion} totalItemsCarrito={totalItemsCarrito} />

      <div className="vista-detalle-producto" style={{ padding: '40px', textAlign: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ marginBottom: '30px', cursor: 'pointer', padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
        >
          ← Volver
        </button>

        <div className="detalle-contenido" style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <img
            src={producto.imagen || '/img/placeholder.jpg'}
            alt={producto.nombre}
            style={{ width: '400px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div className="detalle-info" style={{ textAlign: 'left', maxWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ marginBottom: '15px' }}>{producto.nombre}</h2>
            <p style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
              {producto.descripcion || 'Sin descripción disponible.'}
            </p>
            <h3 style={{ fontSize: '28px', color: '#222', marginBottom: '20px' }}>
              ${Number(producto.precio).toLocaleString('es-AR')}
            </h3>

            {!esAccesorio && (
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
                const talleFinal = esAccesorio ? 'Único' : talleSeleccionado;

                if (!esAccesorio && !talleSeleccionado) {
                  alert('Por favor, seleccioná un talle antes de agregar al carrito.');
                  return;
                }

                agregarAlCarrito({ ...producto, talleElegido: talleFinal });
                alert(esAccesorio ? '¡Accesorio agregado al carrito!' : `¡Producto agregado en talle ${talleSeleccionado}!`);
              }}
              style={{ padding: '15px', backgroundColor: '#5c3a3b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;