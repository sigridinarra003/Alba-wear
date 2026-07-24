import { useState } from 'react';
import './carrito.css';

// Agregamos { irAHome } en los parámetros para recibir la función desde App.jsx
function Carrito({ irAHome }) {
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: 'Pollera Aitana - Leopard Edition.',
      talles: 'S, M y L.',
      precio: 30000,
      cantidad: 1,
      img: '/img/p-2.jpg',
      descripcion: '¡La pieza que tu closet estaba gritando! Nuestra nueva Pollera "Aitana" Leopard Max llegó para romper esquemas. No es solo una falda, es una declaración de actitud.'
    },
    {
      id: 2,
      nombre: 'Pollera Ibiza - White Lace Edition.',
      talles: 'S, M y L.',
      precio: 30000,
      cantidad: 1,
      img: '/img/p-1.jpg',
      descripcion: 'Para las amantes del estilo libre y romántico, presentamos nuestra Pollera "Ibiza" Lace. Una pieza única que combina la delicadeza del encaje con un toque rebelde imposible de ignorar.'
    }
  ]);

  const modificarCantidad = (id, accion) => {
    const nuevosProductos = productos.map(prod => {
      if (prod.id === id) {
        if (accion === 'sumar') {
          return { ...prod, cantidad: prod.cantidad + 1 };
        } else if (accion === 'restar' && prod.cantidad > 1) {
          return { ...prod, cantidad: prod.cantidad - 1 };
        }
      }
      return prod;
    });
    setProductos(nuevosProductos);
  };

  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter(prod => prod.id !== id);
    setProductos(nuevosProductos);
  };

  const subtotalProductos = productos.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  const totalUnidades = productos.reduce((acc, prod) => acc + prod.cantidad, 0);
  const costoEnvio = subtotalProductos >= 180000 ? 0 : 10000; 
  const totalFinal = subtotalProductos + costoEnvio;

  return (
    <div className="carrito-principal">
      <div className="carrito-contenedor">
        
        <header className="carrito-header">
          {/* Botón para volver al Home en cualquier momento */}
          <button 
            onClick={irAHome} 
            style={{ background: 'none', border: 'none', color: '#5c3a3b', cursor: 'pointer', marginBottom: '10px', textDecoration: 'underline', padding: 0, fontSize: '14px' }}
          >
            ← Volver a la tienda
          </button>
          <h1>Carrito ({totalUnidades} {totalUnidades === 1 ? 'prenda' : 'prendas'})</h1>
        </header>

        {productos.length === 0 ? (
          <div className="carrito-vacio" style={{ padding: '40px 20px', textAlign: 'center', color: '#7a6e67' }}>
            <h2 style={{ color: '#5c3a3b', marginBottom: '10px' }}>Tu carrito está vacío</h2>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>¡Explorá Alba Wear para encontrar tus prendas favoritas!</p>
            {/* Ahora este botón ejecuta irAHome de forma funcional */}
            <button 
              className="btn-compra" 
              onClick={irAHome} 
              style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }}
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <>
            <div className="carrito-lista">
              {productos.map(prod => (
                <div className="carrito-item" key={prod.id}>
                  <div className="item-foto">
                    <img src={prod.img} alt={prod.nombre} />
                  </div>
                  
                  <div className="item-detalles">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3>{prod.nombre}</h3>
                      <button 
                        onClick={() => eliminarProducto(prod.id)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <p className="item-talles">Talles: {prod.talles}</p>
                    
                    <div className="item-controles">
                      <div className="contador">
                        <button onClick={() => modificarCantidad(prod.id, 'restar')}>-</button>
                        <span>{prod.cantidad}</span>
                        <button onClick={() => modificarCantidad(prod.id, 'sumar')}>+</button>
                      </div>
                      <span className="item-precio">${(prod.precio * prod.cantidad).toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                  <p className="item-descripcion">{prod.descripcion}</p>
                </div>
              ))}
            </div>

            <div className="carrito-resumen">
              <div className="envio-aviso">
                <span>🚚</span> Envío gratis superando los $180.000
              </div>

              <div className="resumen-linea">
                <span>Subtotal (con envío):</span>
                <span>${totalFinal.toLocaleString('es-AR')}</span>
              </div>
              
              <hr />

              <div className="resumen-linea total">
                <span>Total:</span>
                <span>${totalFinal.toLocaleString('es-AR')}</span>
              </div>

              <p className="cuotas-aviso">Cuotas SIN interés con DÉBITO</p>

              <button className="btn-compra" onClick={() => alert('¡Redirigiendo a la pasarela de pago!')}>
                Iniciar Compra
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Carrito;