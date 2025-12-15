import { useEffect, useState } from 'react';

function Productos() {
  const [tortas, setTortas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [mensaje, setMensaje] = useState(null);

  // ESTILOS DEL BANNER HERO (IMAGEN NUEVA 📸)
  const heroStyle = {
    // Imagen nueva: Mesa con variedad de postres
    backgroundImage: 'url("https://images.unsplash.com/photo-1559553156-2e97137af16f?q=80&w=1920&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,0.5)', // Oscurece para leer el texto
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

  // --- Lógica de Notificación, Carga y Compartir ---
  const mostrarNotificacion = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(null), 3000);
  };

  const cargarProductos = (categoria) => {
    setCategoriaSeleccionada(categoria);
    let url = 'http://localhost:8080/api/productos';
    if (categoria !== 'Todas') {
      url = `http://localhost:8080/api/productos/filtrar?categoria=${categoria}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => setTortas(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    cargarProductos('Todas');
  }, []);

  const agregarAlCarrito = (torta) => {
    let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoActual.push(torta);
    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    mostrarNotificacion(`✅ ¡${torta.nombre} agregada al carrito!`);
  };

  const compartir = (titulo, texto, urlImagen) => {
     const shareData = { title: 'Pastelería Mil Sabores', text: `${titulo}\n${texto}`, url: window.location.href };
     if (navigator.share) { navigator.share(shareData).catch(console.error); }
     else { 
        mostrarNotificacion("🔗 Abriendo WhatsApp...");
        const mensaje = `¡Mira esto! ${titulo} ${texto}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
     }
  };

  const estiloBotonFiltro = (categoria) => ({
    padding: '10px 20px', margin: '0 5px', border: 'none', borderRadius: '20px',
    cursor: 'pointer', fontWeight: 'bold', border: '2px solid var(--color-chocolate)',
    backgroundColor: categoriaSeleccionada === categoria ? 'var(--color-chocolate)' : 'white',
    color: categoriaSeleccionada === categoria ? 'white' : 'var(--color-chocolate)',
  });

  return (
    <div>
      {/* --- NOTIFICACIÓN FLOTANTE --- */}
      {mensaje && (
        <div className="notificacion-flotante notificacion-exito" style={{ top: '80px' }}>
          {mensaje}
        </div>
      )}

      {/* --- BANNER HERO CON IMAGEN NUEVA --- */}
      <div style={heroStyle}>
        <h1 style={tituloHero}>Nuestro Catálogo</h1>
        <p style={subtituloHero}>Explora un mundo de sabores tradicionales y nuevas creaciones.</p>
      </div>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* FILTROS */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '10px' }}>
          {['Todas', 'Tortas Cuadradas', 'Tortas Circulares', 'Productos Veganos'].map(cat => (
            <button key={cat} style={estiloBotonFiltro(cat)} onClick={() => cargarProductos(cat)}>{cat}</button>
          ))}
        </div>

        {/* GRILLA DE PRODUCTOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {tortas.map((torta) => (
            <div key={torta.id} style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: '1px solid var(--color-chocolate)' }}>
              <img src={torta.imagenUrl} alt={torta.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3 style={{ color: 'var(--color-chocolate)', margin: '0 0 10px 0' }}>{torta.nombre}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{torta.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${torta.precio}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button title="Compartir" onClick={() => compartir(`¡Qué rica! ${torta.nombre}`, torta.descripcion)} style={{ backgroundColor: '#eee', border: 'none', padding: '8px 12px', borderRadius: '50%', cursor: 'pointer' }}>🔗</button>
                    <button onClick={() => agregarAlCarrito(torta)} style={{ backgroundColor: 'var(--color-chocolate)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}>Agregar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Productos;