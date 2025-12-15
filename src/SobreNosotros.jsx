function SobreNosotros() {
  
  // --- ESTILOS ---
  const heroStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1920&auto=format&fit=crop")', // Foto de equipo o cocina
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,0.6)', // Oscurece la imagen
    marginBottom: '50px'
  };

  const seccionStyle = {
    maxWidth: '1000px',
    margin: '0 auto 60px auto',
    padding: '0 20px',
    textAlign: 'center',
    lineHeight: '1.8',
    color: '#444'
  };

  const tarjetaEquipo = {
    backgroundColor: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    paddingBottom: '20px'
  };

  return (
    <div>
      {/* BANNER HERO */}
      <div style={heroStyle}>
        <h1 style={{ fontFamily: 'Pacifico', fontSize: '3.5rem', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Nuestra Historia
        </h1>
        <p style={{ fontSize: '1.5rem', fontWeight: '300' }}>Horneando felicidad desde 1973</p>
      </div>

      {/* HISTORIA */}
      <div style={seccionStyle}>
        <h2 style={{ color: 'var(--color-chocolate)', fontFamily: 'Pacifico', fontSize: '2.5rem' }}>
          Más que una pastelería, una familia 🍰
        </h2>
        <p style={{ fontSize: '1.1rem' }}>
          Todo comenzó hace 50 años en una pequeña cocina en el corazón de Santiago. La abuela Elena tenía un sueño: 
          que cada domingo las familias se reunieran alrededor de una mesa con el aroma a vainilla y chocolate recién horneado.
        </p>
        <p style={{ fontSize: '1.1rem' }}>
          Hoy, <strong>Pastelería Mil Sabores</strong> sigue manteniendo esa tradición intacta. Aunque hemos crecido, 
          seguimos rompiendo los huevos a mano, batiendo la crema fresca cada mañana y esperando pacientemente 
          a que el horno nos avise que la magia está lista.
        </p>
      </div>

      {/* VALORES */}
      <div style={{ backgroundColor: '#FFF5E1', padding: '60px 20px', marginBottom: '60px' }}>
        <div style={{ ...seccionStyle, marginBottom: 0 }}>
          <h2 style={{ color: 'var(--color-chocolate)', fontFamily: 'Pacifico', marginBottom: '40px' }}>Lo que nos mueve</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            <div>
              <div style={{ fontSize: '3rem' }}>🌿</div>
              <h3>Ingredientes Naturales</h3>
              <p>Sin premezclas ni conservantes extraños. Solo lo que tendrías en tu propia despensa.</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem' }}>🤝</div>
              <h3>Comunidad</h3>
              <p>Trabajamos con proveedores locales y apoyamos a los estudiantes de gastronomía.</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem' }}>❤️</div>
              <h3>Amor por el Oficio</h3>
              <p>Cada torta es decorada a mano con la paciencia que requiere el arte.</p>
            </div>
          </div>
        </div>
      </div>

      {/* EQUIPO */}
      <div style={seccionStyle}>
        <h2 style={{ color: 'var(--color-chocolate)', fontFamily: 'Pacifico', marginBottom: '40px' }}>Nuestro Equipo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
          
          <div style={tarjetaEquipo}>
            <img src="https://images.pexels.com/photos/6996315/pexels-photo-6996315.jpeg" alt="Chef" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <h3 style={{ margin: '15px 0 5px 0', color: 'var(--color-chocolate)' }}>Elena "Nena"</h3>
            <span style={{ color: '#888' }}>Fundadora</span>
          </div>

          <div style={tarjetaEquipo}>
            <img src="https://images.pexels.com/photos/8478052/pexels-photo-8478052.jpeg" alt="Maestro Pastelero" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <h3 style={{ margin: '15px 0 5px 0', color: 'var(--color-chocolate)' }}>Carlos M.</h3>
            <span style={{ color: '#888' }}>Jefe de Cocina</span>
          </div>

          <div style={tarjetaEquipo}>
            <img src="https://images.pexels.com/photos/3983671/pexels-photo-3983671.jpeg" alt="Decoradora" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <h3 style={{ margin: '15px 0 5px 0', color: 'var(--color-chocolate)' }}>Sofía R.</h3>
            <span style={{ color: '#888' }}>Decoradora Artística</span>
          </div>

        </div>
      </div>

    </div>
  );
}

export default SobreNosotros;