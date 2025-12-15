import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const navigate = useNavigate();
  
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    codigoPromocional: ''
  });

  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const mostrarMensaje = (texto, tipo) => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => {
      setNotificacion({ visible: false, texto: '', tipo: '' });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let tieneDescuento = false;
    let mensajeExtra = "";
    
    if (datos.codigoPromocional === 'FELICES50') {
      tieneDescuento = true;
      mensajeExtra = " ¡Código de descuento aplicado! 🎉";
    }

    const usuarioParaEnviar = {
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password,
      fechaNacimiento: datos.fechaNacimiento,
      descuentoVitalicio: tieneDescuento,
      rol: 'CLIENTE'
    };

    fetch('http://localhost:8080/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioParaEnviar)
    })
    .then(response => {
      if (response.ok) {
        mostrarMensaje(`✅ ¡Registro exitoso!${mensajeExtra} Redirigiendo...`, 'exito');
        setTimeout(() => { navigate('/login'); }, 2000);
      } else {
        mostrarMensaje('❌ Error al registrar. Quizás el correo ya existe.', 'error');
      }
    })
    .catch(error => {
      mostrarMensaje('❌ Error de conexión con el servidor.', 'error');
    });
  };

  // --- ESTILOS VISUALES ---
  const pageContainer = {
    position: 'relative', minHeight: '90vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
  };

  const backgroundBlur = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    // FOTO
    backgroundImage: 'url("https://images.pexels.com/photos/7104470/pexels-photo-7104470.jpeg")',
    backgroundSize: 'cover', backgroundPosition: 'center',
    filter: 'blur(8px) brightness(0.6)', 
    transform: 'scale(1.1)', zIndex: 0
  };

  const cardStyle = {
    position: 'relative', zIndex: 1,
    maxWidth: '450px', width: '90%', padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
    textAlign: 'center'
  };

  const inputStyle = { 
    display: 'block', width: '100%', padding: '12px 15px', margin: '10px 0', 
    borderRadius: '30px', border: '1px solid #ddd', fontSize: '1rem',
    backgroundColor: '#f9f9f9', outline: 'none'
  };

  return (
    <div style={pageContainer}>
      
      <div style={backgroundBlur}></div>

      {notificacion.visible && (
        <div className={`notificacion-flotante ${notificacion.tipo === 'error' ? 'notificacion-error' : 'notificacion-exito'}`}>
          {notificacion.texto}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: 'var(--color-chocolate)', fontFamily: 'Pacifico', fontSize: '2.2rem', marginBottom: '10px' }}>
          Únete a la Familia 🍰
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Crea tu cuenta y disfruta beneficios exclusivos</p>
      
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre Completo" required style={inputStyle} onChange={handleChange} />
          <input type="email" name="email" placeholder="Correo Electrónico" required style={inputStyle} onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" required style={inputStyle} onChange={handleChange} />
          
          <div style={{ textAlign: 'left', margin: '10px 5px' }}>
            <label style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', marginLeft: '10px' }}>Fecha de Nacimiento:</label>
            <input type="date" name="fechaNacimiento" required style={inputStyle} onChange={handleChange} />
          </div>
          
          <input type="text" name="codigoPromocional" placeholder="¿Tienes un código promocional?" style={inputStyle} onChange={handleChange} />

          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: 'var(--color-chocolate)', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '15px', boxShadow: '0 4px 10px rgba(139, 69, 19, 0.3)' }}>
            Registrarme
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <a href="/login" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
            ¿Ya tienes cuenta? <span style={{ color: 'var(--color-chocolate)', fontWeight: 'bold' }}>Inicia sesión</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Registro;