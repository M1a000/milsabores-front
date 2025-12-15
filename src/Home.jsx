import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [destacados, setDestacados] = useState([]);
  
  // 1. Estado para guardar al usuario y saber si está logueado
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Cargar productos destacados
    fetch('http://localhost:8080/api/productos')
      .then(res => res.json())
      .then(data => {
        setDestacados(data.slice(0, 3));
      })
      .catch(err => console.error(err));

    // 2. Revisamos si hay alguien logueado al entrar al Home
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    setUsuario(usuarioGuardado);
  }, []);

  // --- LÓGICA DE VISIBILIDAD ---
  // Verificamos si es alumno Duoc
  const esAlumnoDuoc = usuario && usuario.email.toLowerCase().includes('@duocuc.cl');

  // Decidimos si mostramos el cartel:
  // Se muestra si: (No hay nadie logueado) O (Hay alguien, pero NO es Duoc)
  const mostrarSeccionDuoc = !usuario || !esAlumnoDuoc;


  // --- ESTILOS ---
  const heroStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1920&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,0.4)'
  };

  const botonHero = {
    padding: '15px 30px',
    fontSize: '1.2rem',
    backgroundColor: 'var(--color-acento)',
    color: '#880e4f',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '20px',
    transition: 'transform 0.2s'
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <div style={heroStyle}>
        <h1 style={{ fontFamily: 'Pacifico', fontSize: '4rem', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Pastelería Mil Sabores
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '10px 0' }}>
          50 años horneando momentos dulces y celebrando la tradición chilena.
        </p>
        <Link to="/catalogo" style={botonHero}>
          🎂 Ver Nuestro Menú
        </Link>
      </div>

      {/* 2. VALORES */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', padding: '50px 20px', backgroundColor: 'white', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '3rem' }}>🎖️</div>
          <h3>Calidad Premium</h3>
          <p>Ingredientes seleccionados.</p>
        </div>
        <div>
          <div style={{ fontSize: '3rem' }}>🚚</div>
          <h3>Despacho Rápido</h3>
          <p>Llegamos a toda la ciudad.</p>
        </div>
        <div>
          <div style={{ fontSize: '3rem' }}>❤️</div>
          <h3>Hecho con Amor</h3>
          <p>Recetas tradicionales.</p>
        </div>
      </div>

      {/* 3. PRODUCTOS DESTACADOS */}
      <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Pacifico', color: 'var(--color-chocolate)', fontSize: '2.5rem' }}>
          Favoritos del Mes 🌟
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
          {destacados.map(prod => (
            <div key={prod.id} style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <img src={prod.imagenUrl} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt={prod.nombre} />
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: 'var(--color-chocolate)' }}>{prod.nombre}</h3>
                <p style={{ fontWeight: 'bold', color: '#666' }}>${prod.precio}</p>
                <Link to="/catalogo" style={{ color: 'var(--color-chocolate)', fontWeight: 'bold' }}>Ver detalle →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LLAMADO A LA ACCIÓN DUOC (CONDICIONAL) */}
      {/* Solo se renderiza si mostrarSeccionDuoc es verdadero */}
      {mostrarSeccionDuoc && (
        <div style={{ backgroundColor: '#FFF5E1', padding: '60px 20px', textAlign: 'center', marginTop: '40px' }}>
          <h2 style={{ color: 'var(--color-chocolate)' }}>¿Eres alumno de Duoc UC? 🎓</h2>
          <p>Regístrate con tu correo institucional y obtén una torta gratis en tu cumpleaños.</p>
          <Link to="/registro" style={{ ...botonHero, backgroundColor: 'var(--color-chocolate)', color: 'white' }}>
            Registrarme Ahora
          </Link>
        </div>
      )}

    </div>
  );
}

export default Home;