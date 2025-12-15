import { Link } from 'react-router-dom';

function Footer() {
  const estiloFooter = {
    backgroundColor: 'var(--color-chocolate)',
    color: '#FFF5E1', // Color crema
    padding: '40px 20px',
    marginTop: '50px',
    borderTop: '5px solid var(--color-acento)' // Borde rosa arriba
  };

  const contenedorGrid = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // 3 columnas responsivas
    gap: '30px'
  };

  const tituloSeccion = {
    fontFamily: 'Pacifico',
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#FFC0CB' // Rosa
  };

  const estiloLink = {
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    marginBottom: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  };

  return (
    <footer style={estiloFooter}>
      <div style={contenedorGrid}>
        
        {/* COLUMNA 1: Información */}
        <div>
          <h3 style={tituloSeccion}>Pastelería Mil Sabores 🍰</h3>
          <p>Tradición y dulzura desde 1973.</p>
          <p>📍 Av. Siempre Viva 742, Santiago</p>
          <p>🕒 Lun - Dom: 09:00 - 20:00</p>
        </div>

        {/* COLUMNA 2: Enlaces Rápidos */}
        <div>
          <h3 style={tituloSeccion}>Explora</h3>
          <Link to="/" style={estiloLink}>🏠 Inicio</Link>
          <Link to="/catalogo" style={estiloLink}>🎂 Nuestro Menú</Link>
          <Link to="/blog" style={estiloLink}>📰 Blog & Recetas</Link>
          <Link to="/historial" style={estiloLink}>📦 Seguimiento de Pedidos</Link>
          {/* AQUÍ ESTÁ EL ENLACE AL FORMULARIO QUE HICIMOS */}
          <Link to="/contacto" style={estiloLink}>💌 Contáctanos</Link>
        </div>

        {/* COLUMNA 3: Redes Sociales (Simuladas) */}
        <div>
          <h3 style={tituloSeccion}>Síguenos</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem' }}>📸</button>
            <button style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem' }}>📘</button>
            <button style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem' }}>🐦</button>
          </div>
          <p style={{ fontSize: '0.8rem', marginTop: '15px' }}>
            © 2024 Mil Sabores. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;