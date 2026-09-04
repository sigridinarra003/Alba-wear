import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

function Registro({ irAHome, irALogin }) {
  // Ahora tenemos dos estados separados
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    // Mandamos nombre y apellido por separado al backend
    axios.post('http://localhost:5000/api/usuarios/registro', {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      contrasena: contrasena
    })
    .then((res) => {
      setMensaje({ texto: '¡Registro exitoso! Redirigiendo al login...', tipo: 'exito' });
      setTimeout(() => {
        irALogin();
      }, 2000);
    })
    .catch((err) => {
      console.error('Error en registro:', err);
      setMensaje({ 
        texto: err.response?.data?.error || 'Error al registrarse', 
        tipo: 'error' 
      });
    });
  };

  return (
    <div className="login-principal">
      <div className="login-caja">
        <button 
          onClick={irAHome} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', textDecoration: 'underline' }}
        >
          ← Volver a la tienda
        </button>
        
        <h2>Crear Cuenta</h2>
        
        {mensaje.texto && (
          <p style={{ color: mensaje.tipo === 'exito' ? 'green' : 'red', fontWeight: 'bold' }}>
            {mensaje.texto}
          </p>
        )}

        <form onSubmit={manejarSubmit}>
          {/* INPUT DE NOMBRE */}
          <div style={{ marginBottom: '15px' }}>
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {/* INPUT DE APELLIDO */}
          <div style={{ marginBottom: '15px' }}>
            <label>Apellido:</label>
            <input 
              type="text" 
              value={apellido}
              onChange={(e) => setApellido(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <button type="submit" className="btn-compra" style={{ width: '100%', marginBottom: '15px' }}>
            Registrarme
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span>¿Ya tenés una cuenta? </span>
          <button 
            onClick={irALogin} 
            style={{ background: 'none', border: 'none', color: '#5c3a3b', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Iniciá sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registro;