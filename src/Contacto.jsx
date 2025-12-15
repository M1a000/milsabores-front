import { useState } from 'react';

function Contacto() {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  // Estado para la notificación flotante
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const mostrarMensaje = (texto, tipo) => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => {
      setNotificacion({ visible: false, texto: '', tipo: '' });
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/contactos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    .then(response => {
      if (response.ok) {
        mostrarMensaje('✅ ¡Mensaje enviado! Te responderemos pronto.', 'exito');
        setDatos({ nombre: '', email: '', mensaje: '' }); // Limpiamos el formulario
      } else {
        mostrarMensaje('❌ Hubo un error al enviar el mensaje.', 'error');
      }
    })
    .catch(error => mostrarMensaje('❌ Error de conexión con el servidor.', 'error'));
  };

  const inputStyle = {
    display: 'block', width: '100%', padding: '12px', margin: '10px 0',
    borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem'
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      
      {/* NOTIFICACIÓN FLOTANTE */}
      {notificacion.visible && (
        <div className={`notificacion-flotante ${notificacion.tipo === 'error' ? 'notificacion-error' : 'notificacion-exito'}`}>
          {notificacion.texto}
        </div>
      )}

      <h2 style={{ textAlign: 'center', color: 'var(--color-chocolate)', fontFamily: 'Pacifico' }}>Contáctanos 💌</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>¿Tienes dudas o quieres un pedido especial? Escríbenos.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Nombre Completo:</label>
        <input 
          type="text" name="nombre" value={datos.nombre} onChange={handleChange} 
          required placeholder="Ej: Juan Pérez" style={inputStyle} 
        />

        <label style={{ fontWeight: 'bold' }}>Correo Electrónico:</label>
        <input 
          type="email" name="email" value={datos.email} onChange={handleChange} 
          required placeholder="Ej: juan@gmail.com" style={inputStyle} 
        />

        <label style={{ fontWeight: 'bold' }}>Tu Mensaje:</label>
        <textarea 
          name="mensaje" value={datos.mensaje} onChange={handleChange} 
          required placeholder="Cuéntanos qué necesitas..." 
          style={{ ...inputStyle, height: '120px', fontFamily: 'sans-serif' }} 
        />

        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: 'var(--color-chocolate)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px' }}>
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
}

export default Contacto;