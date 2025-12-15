import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const usuarioLogin = { email, password };

    fetch('http://localhost:8080/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioLogin)
    })
    .then(response => {
      if (response.status === 200) return response.json();
      return null;
    })
    .then(data => {
      if (data && data.usuario && data.token) {
        localStorage.setItem('usuarioLogueado', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);
        
        if (data.usuario.rol === 'ADMIN' || data.usuario.rol === 'VENDEDOR') {
          window.location.href = "/admin"; 
        } else {
          window.location.href = "/"; 
        }
      } else {
        setError('❌ Correo o contraseña incorrectos');
      }
    })
    .catch(err => {
      console.error(err);
      setError('❌ Error de conexión con el servidor');
    });
  };

  // --- ESTILOS VISUALES ---
  const pageContainer = {
    position: 'relative',
    minHeight: '90vh', // Ocupa casi toda la pantalla
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  const backgroundBlur = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    // FOTO: Cafetería/Pastelería acogedora
    backgroundImage: 'url("https://images.pexels.com/photos/29786251/pexels-photo-29786251.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px) brightness(0.7)', // DIFUMINADO + OSCURECIDO
    transform: 'scale(1.1)', // Escalar un poco para evitar bordes blancos por el blur
    zIndex: 0
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 1, // Para que quede encima del fondo
    maxWidth: '400px',
    width: '90%',
    padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Blanco casi opaco
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.4)', // Sombra fuerte para efecto 3D
    textAlign: 'center'
  };

  const inputStyle = { 
    display: 'block', width: '100%', padding: '12px 15px', margin: '15px 0', 
    borderRadius: '30px', border: '1px solid #ddd', fontSize: '1rem',
    backgroundColor: '#f9f9f9', outline: 'none'
  };

  return (
    <div style={pageContainer}>
      
      {/* CAPA DE FONDO BORROSO */}
      <div style={backgroundBlur}></div>

      {/* TARJETA DEL FORMULARIO */}
      <div style={cardStyle}>
        <h2 style={{ color: 'var(--color-chocolate)', fontFamily: 'Pacifico', fontSize: '2.2rem', marginBottom: '10px' }}>
          Bienvenido 🧁
        </h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Inicia sesión para endulzar tu día</p>
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input 
            type="email" placeholder="Correo Electrónico" required 
            style={inputStyle} onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Contraseña" required 
            style={inputStyle} onChange={(e) => setPassword(e.target.value)} 
          />

          <button 
            type="submit" 
            style={{ 
              width: '100%', padding: '15px', backgroundColor: 'var(--color-chocolate)', 
              color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', 
              fontSize: '1.1rem', fontWeight: 'bold', marginTop: '20px',
              boxShadow: '0 4px 10px rgba(139, 69, 19, 0.3)', transition: 'transform 0.2s'
            }}
          >
            Entrar
          </button>
        </form>
        
        <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>¿No tienes cuenta?</p>
          <a href="/registro" style={{ color: 'var(--color-chocolate)', fontWeight: 'bold', textDecoration: 'none' }}>
            Crear cuenta nueva
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;