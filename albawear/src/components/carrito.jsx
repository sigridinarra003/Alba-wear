import React, { useState } from 'react';
import './carrito.css';

function Carrito({ carrito = [], modificarCantidad, eliminarProducto, irAHome }) {
  // Estados para controlar la simulación de pago
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('tarjeta'); // 'tarjeta' o 'transferencia'
  const [procesando, setProcesando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  // Formulario del comprador
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    email: '',
    direccion: '',
    ciudad: '',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: ''
  });

  // Cálculos de montos
  const subtotalProductos = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  const totalUnidades = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  const costoEnvio = subtotalProductos >= 50000 || subtotalProductos === 0 ? 0 : 5000;
  const totalFinal = subtotalProductos + costoEnvio;

  const manejarCambioInput = (e) => {
    setDatosEnvio({ ...datosEnvio, [e.target.name]: e.target.value });
  };

  const ejecutarPagoSimulado = (e) => {
    e.preventDefault();
    setProcesando(true);

    // Simula espera de pasarela de pago (2.5 segundos)
    setTimeout(() => {
      setProcesando(false);
      setPagoExitoso(true);
    }, 2500);
  };

  const cerrarModal = () => {
    setMostrarModalPago(false);
    setPagoExitoso(false);
  };

  return (
    <div className="carrito-principal">
      <div className="carrito-contenedor">
        
        <header className="carrito-header">
          <h1>Mi Carrito ({totalUnidades} {totalUnidades === 1 ? 'prenda' : 'prendas'})</h1>
          <button onClick={irAHome} className="btn-volver-tienda">
            ← Volver a la tienda
          </button>
        </header>

        {carrito.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#7a6e67' }}>
            <h2 style={{ color: '#5c3a3b', marginBottom: '10px' }}>Tu carrito está vacío</h2>
            <p style={{ fontSize: '15px', marginBottom: '25px' }}>¡Explorá Alba Wear para descubrir la mejor colección!</p>
            <button 
              className="btn-compra" 
              onClick={irAHome} 
              style={{ maxWidth: '220px', margin: '0 auto' }}
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="carrito-cuerpo">
            {/* Columna Izquierda: Productos */}
            <div className="carrito-lista">
              {carrito.map(prod => (
                <div className="carrito-item" key={`${prod.id_producto}-${prod.talleElegido}`}>
                  <div className="item-foto">
                    <img src={prod.imagen || '/img/placeholder.jpg'} alt={prod.nombre} />
                  </div>
                  
                  <div className="item-detalles">
                    <h3>{prod.nombre}</h3>
                    <p className="item-talle">Talle: {prod.talleElegido}</p>
                    <p className="item-descripcion">{prod.descripcion || 'Sin descripción disponible.'}</p>
                  </div>

                  <div className="item-acciones">
                    <button 
                      onClick={() => eliminarProducto(prod.id_producto, prod.talleElegido)} 
                      className="btn-eliminar"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>

                    <div className="contador">
                      <button onClick={() => modificarCantidad(prod.id_producto, prod.talleElegido, 'restar')}>-</button>
                      <span>{prod.cantidad}</span>
                      <button onClick={() => modificarCantidad(prod.id_producto, prod.talleElegido, 'sumar')}>+</button>
                    </div>

                    <span className="item-precio">${(prod.precio * prod.cantidad).toLocaleString('es-AR')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Columna Derecha: Resumen de Compra */}
            <div className="carrito-resumen">
              <h2>Resumen del Pedido</h2>

              <div className="envio-aviso">
                <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='black' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3c!--Boxicons v3.0.8 https://boxicons.com %7c License https://docs.boxicons.com/free--%3e%3cpath d='M19.1 7.8c-.38-.5-.97-.8-1.6-.8H15V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2 0 1.65 1.35 3 3 3s3-1.35 3-3h4c0 1.65 1.35 3 3 3s3-1.35 3-3c1.1 0 2-.9 2-2v-3.67c0-.43-.14-.86-.4-1.2zM17.5 9l1.5 2h-4V9zM7 19a1.003 1.003 0 0 1-.87-1.5c.37-.63 1.36-.63 1.73 0 .09.15.13.32.13.49 0 .55-.45 1-1 1Zm2.23-3s-.05-.05-.08-.07c-.06-.06-.12-.11-.17-.16-.12-.11-.25-.21-.38-.29a3 3 0 0 0-.67-.32c-.07-.02-.14-.05-.21-.07Q7.375 15 7 15c-.375 0-.49.04-.72.09-.07.02-.14.05-.21.07-.16.05-.31.11-.45.19-.07.04-.15.08-.22.13-.13.09-.26.18-.38.29-.06.05-.12.1-.18.16-.02.03-.05.04-.08.07h-.77V6h9v10H9.22ZM17 19a1.003 1.003 0 0 1-.87-1.5c.37-.63 1.36-.63 1.73 0 .09.15.13.32.13.49 0 .55-.45 1-1 1Zm3-3h-.77s-.05-.05-.08-.07c-.06-.06-.12-.11-.17-.16-.12-.11-.25-.21-.38-.29a3 3 0 0 0-.67-.32c-.07-.02-.14-.05-.21-.07Q17.375 15 17 15c-.375 0-.47.04-.7.09-.06.01-.12.03-.18.05-.18.06-.36.13-.52.22l-.12.06c-.17.1-.33.21-.48.35v-2.76h5v3Z'%3e%3c/path%3e%3c/svg%3e" alt="" /> Envíos GRATIS en compras superiores a $50.000
              </div>

              <div className="resumen-linea">
                <span>Subtotal ({totalUnidades} items):</span>
                <span>${subtotalProductos.toLocaleString('es-AR')}</span>
              </div>
              
              <div className="resumen-linea">
                <span>Envío a domicilio:</span>
                <span>{costoEnvio === 0 ? '¡GRATIS!' : `$${costoEnvio.toLocaleString('es-AR')}`}</span>
              </div>

              <div className="resumen-linea total">
                <span>Total:</span>
                <span>${totalFinal.toLocaleString('es-AR')}</span>
              </div>

              <button className="btn-compra" onClick={() => setMostrarModalPago(true)}>
                Iniciar Compra <img src="data:image/svg+xml,%3csvg width='24' height='24' fill='%23f9f9f9' viewBox='0 0 24 24' transform='' xmlns='http://www.w3.org/2000/svg'%3e%3c!--Boxicons v3.0.8 https://boxicons.com %7c License https://docs.boxicons.com/free--%3e%3cpath d='M16 12h2v4h-2z'%3e%3c/path%3e%3cpath d='M21 7h-1V4c0-.55-.45-1-1-1H5C3.35 3 2 4.35 2 6v12c0 2.2 1.79 3 3 3h16c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1M5 5h13v2H5c-.55 0-1-.45-1-1s.45-1 1-1m15 14H5.01C4.55 18.99 4 18.81 4 18V8.82c.31.11.65.18 1 .18h15z'%3e%3c/path%3e%3c/svg%3e" alt="" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL SIMULADOR DE PASARELA DE PAGO */}
      {mostrarModalPago && (
        <div className="modal-overlay">
          <div className="modal-pago">
            <div className="modal-header">
              <h2>Finalizar Compra - Alba Wear</h2>
              {!procesando && <button className="btn-cerrar-modal" onClick={cerrarModal}>✕</button>}
            </div>

            {procesando ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div className="spinner"></div>
                <p style={{ fontWeight: 'bold', color: '#5c3a3b' }}>Procesando tu pago de manera segura...</p>
                <p style={{ fontSize: '13px', color: '#777' }}>Por favor no cierres esta ventana.</p>
              </div>
            ) : pagoExitoso ? (
              <div className="comprobante-exito">
                <div className="icono-exito">✔</div>
                <h3 style={{ color: '#5c3a3b', margin: '10px 0' }}>¡Compra realizada con éxito!</h3>
                <p style={{ fontSize: '14px', color: '#555' }}>
                  Muchas gracias <strong>{datosEnvio.nombre || 'Cliente'}</strong>. Enviaremos el comprobante y el número de seguimiento a <strong>{datosEnvio.email || 'tu correo'}</strong>.
                </p>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', margin: '20px 0', textAlign: 'left', fontSize: '13px' }}>
                  <p style={{ margin: '4px 0' }}><strong>Código de Pedido:</strong> #{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p style={{ margin: '4px 0' }}><strong>Monto abonado:</strong> ${totalFinal.toLocaleString('es-AR')}</p>
                  <p style={{ margin: '4px 0' }}><strong>Dirección de entrega:</strong> {datosEnvio.direccion || 'Domicilio registrado'}</p>
                </div>
                <button className="btn-compra" onClick={() => { cerrarModal(); irAHome(); }}>
                  Volver a la Tienda
                </button>
              </div>
            ) : (
              <form onSubmit={ejecutarPagoSimulado}>
                <h3 style={{ fontSize: '15px', marginBottom: '10px', color: '#333' }}>1. Datos de Entrega</h3>
                
                <div className="form-grupo">
                  <label>Nombre Completo</label>
                  <input type="text" name="nombre" value={datosEnvio.nombre} onChange={manejarCambioInput} required placeholder="Juan Pérez" />
                </div>

                <div className="form-row">
                  <div className="form-grupo" style={{ flex: 1 }}>
                    <label>Correo Electrónico</label>
                    <input type="email" name="email" value={datosEnvio.email} onChange={manejarCambioInput} required placeholder="ejemplo@correo.com" />
                  </div>
                  <div className="form-grupo" style={{ flex: 1 }}>
                    <label>Ciudad</label>
                    <input type="text" name="ciudad" value={datosEnvio.ciudad} onChange={manejarCambioInput} required placeholder="Buenos Aires" />
                  </div>
                </div>

                <div className="form-grupo">
                  <label>Dirección de Envío</label>
                  <input type="text" name="direccion" value={datosEnvio.direccion} onChange={manejarCambioInput} required placeholder="Av. Corrientes 1234, 2B" />
                </div>

                <h3 style={{ fontSize: '15px', margin: '20px 0 10px 0', color: '#333' }}>2. Método de Pago</h3>
                
                <div className="metodos-pago">
                  <button 
                    type="button" 
                    className={`btn-metodo ${metodoPago === 'tarjeta' ? 'activo' : ''}`} 
                    onClick={() => setMetodoPago('tarjeta')}
                  >
                     Tarjeta Débito/Crédito
                  </button>
                  <button 
                    type="button" 
                    className={`btn-metodo ${metodoPago === 'transferencia' ? 'activo' : ''}`} 
                    onClick={() => setMetodoPago('transferencia')}
                  >
                     Transferencia / MP
                  </button>
                </div>

                {metodoPago === 'tarjeta' ? (
                  <>
                    <div className="form-grupo">
                      <label>Número de Tarjeta</label>
                      <input type="text" name="numeroTarjeta" value={datosEnvio.numeroTarjeta} onChange={manejarCambioInput} required maxLength="16" placeholder="4500 0000 0000 0000" />
                    </div>

                    <div className="form-row">
                      <div className="form-grupo" style={{ flex: 1 }}>
                        <label>Vencimiento</label>
                        <input type="text" name="vencimiento" value={datosEnvio.vencimiento} onChange={manejarCambioInput} required placeholder="MM/AA" maxLength="5" />
                      </div>
                      <div className="form-grupo" style={{ flex: 1 }}>
                        <label>CVV / Cód.</label>
                        <input type="password" name="cvv" value={datosEnvio.cvv} onChange={manejarCambioInput} required maxLength="4" placeholder="123" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ background: '#eef6ff', padding: '15px', borderRadius: '6px', fontSize: '13px', color: '#004085', marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Alias MP:</strong> ALBA.WEAR.OFICIAL</p>
                    <p style={{ margin: 0 }}>Al hacer clic en "Confirmar Pago", te llegará un email con los detalles para enviar el comprobante de transferencia.</p>
                  </div>
                )}

                <button type="submit" className="btn-compra">
                  Pagar ${totalFinal.toLocaleString('es-AR')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Carrito;