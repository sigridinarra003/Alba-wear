import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import CatalogoProductos from './CatalogoProductos';

function CategoriaVista({ usuario, cerrarSesion, totalItemsCarrito }) {
  const { nombreCategoria } = useParams(); // 'remeras', 'pantalones', 'accesorios'
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
      .then((res) => {
        setProductos(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Mapeamos el nombre de la URL al ID de categoría de tu base de datos
  const obtenerIdCategoria = (cat) => {
    if (cat === 'remeras') return 1;
    if (cat === 'pantalones') return 2;
    if (cat === 'accesorios') return 3;
    return null;
  };

  const idCatBuscada = obtenerIdCategoria(nombreCategoria);
  const productosFiltrados = productos.filter(p => p.id_categoria === idCatBuscada);

  return (
    <div className="principal">
      <Navbar usuario={usuario} cerrarSesion={cerrarSesion} totalItemsCarrito={totalItemsCarrito} />
      
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ textTransform: 'capitalize', marginBottom: '30px' }}>Categoría: {nombreCategoria}</h2>
        
        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          <CatalogoProductos 
            productos={productosFiltrados} 
            onSeleccionarProducto={(prod) => navigate(`/producto/${prod.id_producto}`)} 
          />
        )}
      </div>
    </div>
  );
}

export default CategoriaVista;