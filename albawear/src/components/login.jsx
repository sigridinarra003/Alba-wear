import React, { useState } from 'react';
import axios from 'axios';

function Login({ alIniciarSesion, irAInicio }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Petición al Backend en Node.js
    axios.post('http://localhost:5000/api/usuarios/login', {
      correo: correo,
      contrasena: contrasena
    })
    .then((res) => {
      // Si el login es exitoso
      const usuarioLogueado = res.data.usuario;
      
      if (alIniciarSesion) {
        alIniciarSesion(usuarioLogueado);
      }
      
      if (irAInicio) {
        irAInicio();
      }
    })
    .catch((err) => {
      console.error('Error en la petición de login:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('No se pudo conectar con el servidor');
      }
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
      <h2>Iniciar Sesión</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
          <input 
            type="email" 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input 
            type="password" 
            value={contrasena} 
            onChange={(e) => setContrasena(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#8c6d62', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;