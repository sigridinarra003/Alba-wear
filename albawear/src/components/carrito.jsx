import React from 'react';
import './carrito.css';

// Recibimos la lista real del carrito y las funciones de control desde App.jsx
function Carrito({ carrito = [], modificarCantidad, eliminarProducto, irAHome }) {

  // Cálculos dinámicos con los datos recibidos por props
  const subtotalProductos = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  const totalUnidades = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  const costoEnvio = subtotalProductos >= 180000 || subtotalProductos === 0 ? 0 : 10000; 
  const totalFinal = subtotalProductos + costoEnvio;

  return (
    <div className="carrito-principal">
      <div className="carrito-contenedor">
        
        <header className="carrito-header">
          <button 
            onClick={irAHome} 
            style={{ background: 'none', border: 'none', color: '#5c3a3b', cursor: 'pointer', marginBottom: '10px', textDecoration: 'underline', padding: 0, fontSize: '14px' }}
          >
            ← Volver a la tienda
          </button>
          <h1>Carrito ({totalUnidades} {totalUnidades === 1 ? 'prenda' : 'prendas'})</h1>
        </header>

        {Carrito.length === 0 ? (
          <div className="carrito-vacio" style={{ padding: '40px 20px', textAlign: 'center', color: '#7a6e67' }}>
            <h2 style={{ color: '#5c3a3b', marginBottom: '10px' }}>Tu carrito está vacío</h2>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>¡Explorá Alba Wear para encontrar tus prendas favoritas!</p>
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
              {carrito.map(prod => (
                // 🔑 Clave única combinando ID y talle para que React los separe bien
                <div className="carrito-item" key={`${prod.id_producto}-${prod.talleElegido}`}>
                  <div className="item-foto">
                    <img src={prod.imagen} alt={prod.nombre} />
                  </div>
                  
                  <div className="item-detalles">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3>{prod.nombre}</h3>
                        {/* 👕 Mostramos el talle elegido debajo del nombre */}
                        <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#5c3a3b', margin: '4px 0 0 0' }}>
                          Talle: {prod.talleElegido}
                        </p>
                      </div>
                      
                      {/* 🗑️ Enviamos el id y el talle para eliminar exactamente este ítem */}
                      <button 
                        onClick={() => eliminarProducto(prod.id_producto, prod.talleElegido)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="item-controles">
                      <div className="contador">
                        {/* ➕➖ Enviamos id y talle para modificar la cantidad correcta */}
                        <button onClick={() => modificarCantidad(prod.id_producto, prod.talleElegido, 'restar')}>-</button>
                        <span>{prod.cantidad}</span>
                        <button onClick={() => modificarCantidad(prod.id_producto, prod.talleElegido, 'sumar')}>+</button>
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
                <span>Subtotal:</span>
                <span>${subtotalProductos.toLocaleString('es-AR')}</span>
              </div>
              
              <div className="resumen-linea">
                <span>Costo de envío:</span>
                <span>{costoEnvio === 0 ? '¡Gratis!' : `$${costoEnvio.toLocaleString('es-AR')}`}</span>
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