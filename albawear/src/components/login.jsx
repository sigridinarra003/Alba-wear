import React, { useState } from 'react';
import axios from 'axios';
import './login.css'; // Asegurate de tener tu archivo de estilos

function Login({ irAHome, onLoginExitoso, irAregistro }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  const manejarSubmit = (e) => {
    e.preventDefault();
    setErrorLocal(''); // Limpiamos errores previos

    axios.post('http://localhost:5000/api/usuarios/login', {
      correo: correo,
      contrasena: contrasena
    })
      .then((res) => {
        // 🚀 ESTA ES LA LÍNEA CLAVE
        // Envía los datos a App.jsx, lo que dispara setPantallaActual('home') automáticamente
        onLoginExitoso(res.data.usuario);
      })
      .catch((err) => {
        console.error('Error en el login:', err);
        // Mostramos el mensaje de error que manda Node.js (ej. "Correo incorrecto")
        setErrorLocal(err.response?.data?.error || 'Error de conexión con el servidor');
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

        <h2>Iniciar Sesión</h2>

        {errorLocal && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorLocal}</p>}

        <form onSubmit={manejarSubmit}>
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

          <button type="submit" className="btn-compra" style={{ width: '100%' }}>
            Ingresar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <span>¿No tenés cuenta? </span>
          <button
            type="button"
            onClick={irAregistro}
            style={{ background: 'none', border: 'none', color: '#5c3a3b', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Registrate acá
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;