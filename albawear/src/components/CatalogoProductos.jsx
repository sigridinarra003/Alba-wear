import React from 'react';

function CatalogoProductos({ productos, onSeleccionarProducto }) {
  if (productos.length === 0) {
    return (
      <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#666' }}>
        No se encontraron productos en esta sección.
      </p>
    );
  }

  return (
    <div className="catalogo-productos-grid">
      {productos.map((prod) => (
        <div className="tarjeta-producto" key={prod.id_producto}>
          <div className="contenedor-foto-catalogo">
            <img
              src={prod.imagen || '/img/placeholder.jpg'}
              alt={prod.nombre}
              onClick={() => onSeleccionarProducto(prod)}
              style={{ cursor: 'pointer' }}
            />

            <button
              className="btn-add-mini-carrito"
              title="Ver detalle / Agregar"
              onClick={(e) => {
                e.stopPropagation();
                onSeleccionarProducto(prod);
              }}
            >
              🛒
            </button>
          </div>

          <div className="info-producto-home">
            <h3>{prod.nombre}</h3>
            <p className="precio-home">${Number(prod.precio).toLocaleString('es-AR')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CatalogoProductos;