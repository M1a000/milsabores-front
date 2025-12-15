import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generarBoleta } from './utils/BoletaPDF';

function Historial() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuario) {
      fetch(`http://localhost:8080/api/ventas/usuario/${usuario.id}`)
        .then(response => response.json())
        .then(data => setVentas(data.reverse()))
        .catch(error => console.error(error));
    } else {
        window.location.href = '/login';
    }
  }, []);

  const BarraSeguimiento = ({ estado }) => {
    let progreso = 10;
    let color = '#ccc';
    if (estado === 'En Preparación') { progreso = 30; color = '#FFA500'; }
    else if (estado === 'En Reparto') { progreso = 70; color = '#3498db'; }
    else if (estado === 'Entregado') { progreso = 100; color = '#2ecc71'; }

    return (
      <div style={{ margin: '15px 0' }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: color }}>Estado: {estado} 🚚</p>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px' }}>
          <div style={{ width: `${progreso}%`, height: '100%', backgroundColor: color, borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
        </div>
      </div>
    );
  };

  // --- ESTILOS VISUALES ---
  const pageContainer = {
    position: 'relative', minHeight: '90vh', padding: '40px 0',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  const backgroundBlur = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    // FOTO: Ambiente de cafetería desde arriba
    backgroundImage: 'url("https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1920&auto=format&fit=crop")',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
    filter: 'blur(8px) brightness(0.7)', zIndex: 0
  };

  const cardStyle = {
    position: 'relative', zIndex: 1,
    maxWidth: '800px', width: '90%', padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
  };

  return (
    <div style={pageContainer}>
      <div style={backgroundBlur}></div>

      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', color: 'var(--color-chocolate)', fontFamily: 'Pacifico', fontSize: '2.5rem', marginBottom: '30px' }}>
          Seguimiento de Pedidos 📦
        </h2>

        {ventas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{color:'#555'}}>Aún no has realizado pedidos.</h3>
            <Link to="/catalogo" style={{ color: 'var(--color-chocolate)', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>Ir al Catálogo →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {ventas.map((venta) => (
              <div key={venta.id} style={{ 
                backgroundColor: '#fff', padding: '25px', borderRadius: '15px', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #eee',
                borderLeft: '6px solid var(--color-chocolate)'
              }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>Pedido #{venta.id}</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-chocolate)', fontSize: '1.3rem' }}>${venta.totalPagado}</span>
                </div>

                <div style={{ fontSize: '0.95rem', color: '#666', marginTop: '5px' }}>
                  <span>📅 Entrega estimada: {venta.fechaEntrega || 'Por definir'}</span>
                </div>

                <BarraSeguimiento estado={venta.estado || 'En Preparación'} />

                <div style={{ backgroundColor: '#FFF5E1', padding: '15px', borderRadius: '10px', fontSize: '0.9rem', color: '#555' }}>
                  <pre style={{ margin: 0, fontFamily: 'sans-serif', whiteSpace: 'pre-wrap' }}>{venta.detalleCompra}</pre>
                </div>

                <button 
                  onClick={() => generarBoleta(venta)}
                  style={{ 
                    marginTop: '20px', padding: '12px 25px', 
                    backgroundColor: '#d84315', color: 'white', 
                    border: 'none', borderRadius: '30px', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(216, 67, 21, 0.3)', transition: 'transform 0.2s'
                  }}
                >
                  📄 Descargar Boleta PDF
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Historial;