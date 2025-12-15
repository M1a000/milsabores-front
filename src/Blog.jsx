import { useState, useEffect } from 'react';

function Blog() {
  const [articulos, setArticulos] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  // ESTILOS DEL BANNER HERO
  const heroStyle = {
    // Imagen de ingredientes de repostería
    backgroundImage: 'url("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1920&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,0.6)', // Un poco más oscuro para que resalte el blanco
    marginBottom: '50px'
  };

  const tituloHero = {
    fontFamily: 'Pacifico',
    fontSize: '3.5rem',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  const subtituloHero = {
    fontSize: '1.3rem',
    maxWidth: '600px',
    margin: '10px 0',
    fontWeight: '300'
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/articulos')
      .then(response => response.json())
      .then(data => setArticulos(data))
      .catch(error => console.error('Error cargando blog:', error));
  }, []);

  // --- Estilos del Modal (Se mantienen igual) ---
  const estiloOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const estiloModal = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease-out' };
  const botonCerrar = { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' };

  return (
    <div>
      {/* --- NUEVO BANNER HERO --- */}
      <div style={heroStyle}>
        <h1 style={tituloHero}>El Rincón del Repostero</h1>
        <p style={subtituloHero}>Noticias, tips y secretos compartidos por nuestra comunidad.</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        
        {/* GRILLA DE ARTÍCULOS */}
        {articulos.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>Cargando noticias inspiradoras...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {articulos.map((art) => (
              <div key={art.id} style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', border: '1px solid #eee', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setArticuloSeleccionado(art)}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img src={art.imagenUrl} alt={art.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <span style={{ backgroundColor: 'var(--color-acento)', color: '#880e4f', padding: '4px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>{art.categoria}</span>
                  <h3 style={{ color: 'var(--color-chocolate)', margin: '10px 0', fontSize: '1.3rem' }}>{art.titulo}</h3>
                  <small style={{ color: '#555', fontStyle: 'italic' }}>Por: {art.autor}</small>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>{art.contenido ? art.contenido.substring(0, 80) : ''}...</p>
                  <button style={{ marginTop: '10px', backgroundColor: 'transparent', border: '1px solid var(--color-chocolate)', color: 'var(--color-chocolate)', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>Leer más</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL (VENTANA EMERGENTE) --- */}
      {articuloSeleccionado && (
        <div style={estiloOverlay} onClick={() => setArticuloSeleccionado(null)}>
          <div style={estiloModal} onClick={(e) => e.stopPropagation()}>
            <button style={botonCerrar} onClick={() => setArticuloSeleccionado(null)}>X</button>
            <img src={articuloSeleccionado.imagenUrl} alt={articuloSeleccionado.titulo} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px' }} />
            <h2 style={{ color: 'var(--color-chocolate)', marginTop: '20px' }}>{articuloSeleccionado.titulo}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <span>✍️ {articuloSeleccionado.autor}</span>
              <span>📅 {articuloSeleccionado.fecha}</span>
            </div>
            <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#333', whiteSpace: 'pre-line' }}>{articuloSeleccionado.contenido}</p>
            <button onClick={() => setArticuloSeleccionado(null)} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-chocolate)', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontSize: '1rem' }}>Cerrar Noticia</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;