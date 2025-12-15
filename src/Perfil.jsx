import { useState, useEffect } from 'react';

function Perfil() {
  const [usuario, setUsuario] = useState({
    id: null,
    nombre: '',
    email: '',
    password: '',
    preferencias: ''
  });

  // Estado para la notificación flotante
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioGuardado) {
      setUsuario({ ...usuarioGuardado, preferencias: usuarioGuardado.preferencias || '' });
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const mostrarMensaje = (texto, tipo) => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => {
      setNotificacion({ visible: false, texto: '', tipo: '' });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/usuarios/actualizar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Error al actualizar');
    })
    .then(usuarioActualizado => {
      // Guardar token anterior para no perderlo al actualizar el usuario
      const token = localStorage.getItem('token');
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado));
      if(token) localStorage.setItem('token', token); // Aseguramos el token
      
      mostrarMensaje('✅ ¡Tus datos se guardaron correctamente!', 'exito');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    })
    .catch(error => {
      mostrarMensaje('❌ Hubo un problema al guardar los cambios.', 'error');
    });
  };

  // --- ESTILOS VISUALES (Glassmorphism) ---
  const pageContainer = {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
    overflow: 'hidden'
  };

  const backgroundBlur = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    // FOTO: Chef o persona escribiendo receta
    backgroundImage: 'url("https://images.pexels.com/photos/5713708/pexels-photo-5713708.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px) brightness(0.6)', // Difuminado y oscuro
    transform: 'scale(1.1)',
    zIndex: 0
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 1,
    maxWidth: '500px',
    width: '90%',
    padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Blanco casi opaco
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '5px',
    marginLeft: '10px',
    fontSize: '0.9rem'
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '12px 15px',
    marginBottom: '20px',
    borderRadius: '30px', // Redondito
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    fontSize: '1rem',
    outline: 'none'
  };

  return (
    <div style={pageContainer}>
      
      {/* FONDO */}
      <div style={backgroundBlur}></div>

      {/* NOTIFICACIÓN */}
      {notificacion.visible && (
        <div className={`notificacion-flotante ${notificacion.tipo === 'error' ? 'notificacion-error' : 'notificacion-exito'}`}>
          {notificacion.texto}
        </div>
      )}

      {/* TARJETA DE PERFIL */}
      <div style={cardStyle}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>👤</div>
          <h2 style={{ color: 'var(--color-chocolate)', fontFamily: 'Pacifico', fontSize: '2.2rem', margin: 0 }}>
            Mi Perfil
          </h2>
          <p style={{ color: '#666' }}>Actualiza tus datos personales</p>
        </div>
      
        <form onSubmit={handleSubmit}>
          
          <label style={labelStyle}>Nombre Completo:</label>
          <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>Correo Electrónico:</label>
          <input type="email" name="email" value={usuario.email} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>Contraseña:</label>
          <input type="password" name="password" value={usuario.password} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>Preferencias de Compra (Opcional):</label>
          <textarea 
            name="preferencias" 
            value={usuario.preferencias} 
            onChange={handleChange} 
            placeholder="Ej: Prefiero tortas sin mucho dulce, alérgico a las nueces..."
            style={{ 
              ...inputStyle, 
              borderRadius: '15px', // Menos redondo para textarea
              height: '100px', 
              fontFamily: 'sans-serif',
              resize: 'none'
            }}
          />

          <button type="submit" style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: 'var(--color-chocolate)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '30px', 
            cursor: 'pointer', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            marginTop: '10px',
            boxShadow: '0 4px 10px rgba(139, 69, 19, 0.3)',
            transition: 'transform 0.2s'
          }}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default Perfil;