import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Carrito() {
  const navigate = useNavigate();
  
  // --- LÓGICA (INTACTA) ---
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [mensajeDescuento, setMensajeDescuento] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [error, setError] = useState('');

  // Estados PayPal
  const [mostrarPayPal, setMostrarPayPal] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setItems(carritoGuardado);
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    const sumaTotal = carritoGuardado.reduce((sum, item) => sum + item.precio, 0);
    setTotal(sumaTotal);

    if (usuario && usuario.fechaNacimiento) {
      const nacimiento = new Date(usuario.fechaNacimiento);
      const nacimientoDia = nacimiento.getUTCDate(); 
      const nacimientoMes = nacimiento.getUTCMonth();
      const hoy = new Date();
      const hoyDia = hoy.getDate();
      const hoyMes = hoy.getMonth();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      if (hoyMes < nacimientoMes || (hoyMes === nacimientoMes && hoyDia < nacimientoDia)) edad--;
      const esAlumnoDuoc = usuario.email.toLowerCase().includes('@duocuc.cl');
      const esSuCumpleanos = (nacimientoDia === hoyDia) && (nacimientoMes === hoyMes);

      if (esAlumnoDuoc && esSuCumpleanos) {
        setTotalConDescuento(0);
        setMensajeDescuento('🎓🎉 ¡FELIZ CUMPLEAÑOS ALUMNO DUOC! Tu pedido es GRATIS hoy 🎁');
      } else if (edad >= 50) {
        setTotalConDescuento(sumaTotal * 0.5);
        setMensajeDescuento('¡Felicidades! Tienes 50% de descuento por ser mayor de 50 años 🎉');
      } else if (usuario.descuentoVitalicio) {
        setTotalConDescuento(sumaTotal * 0.9);
        setMensajeDescuento('¡Descuento Vitalicio del 10% aplicado! ✨');
      } else {
        setTotalConDescuento(sumaTotal);
        setMensajeDescuento('');
      }
    } else {
      setTotalConDescuento(sumaTotal);
    }
  }, []);

  const vaciarCarrito = () => {
    localStorage.removeItem('carrito');
    setItems([]);
    setTotal(0);
    setTotalConDescuento(0);
    setMensajeDescuento('');
    setError('');
  };

  const iniciarProcesoPago = () => {
    setError('');
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario) {
      setError('⚠️ Debes iniciar sesión para pagar.');
      setTimeout(() => navigate('/login'), 2000); 
      return;
    }
    if (!fechaEntrega) {
      setError('⚠️ Por favor, selecciona una fecha de entrega en el calendario.');
      return;
    }
    setMostrarPayPal(true);
    setPagoExitoso(false);
    setProcesandoPago(false);
  };

  const confirmarPagoPayPal = (e) => {
    e.preventDefault();
    setProcesandoPago(true);
    setTimeout(() => { enviarPedidoAlBackend(); }, 3000);
  };

  const enviarPedidoAlBackend = () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    const detalleTexto = items.map(item => `- ${item.nombre} ($${item.precio})`).join('\n');
    
    const nuevaVenta = {
      usuarioId: usuario.id,
      nombreUsuario: usuario.nombre,
      detalleCompra: detalleTexto,
      totalPagado: totalConDescuento,
      fechaEntrega: fechaEntrega,
      estado: "En Preparación"
    };

    fetch('http://localhost:8080/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaVenta)
    })
    .then(response => {
      if (response.ok) {
        setProcesandoPago(false);
        setPagoExitoso(true);
        setTimeout(() => {
          setMostrarPayPal(false);
          vaciarCarrito();
          navigate('/historial');
        }, 2500);
      } else {
        setProcesandoPago(false); setError('❌ Error al procesar el pago.'); setMostrarPayPal(false);
      }
    })
    .catch(err => { setProcesandoPago(false); setError('❌ Error de conexión.'); setMostrarPayPal(false); });
  };

  // --- ESTILOS DE DISEÑO NUEVOS ---
  const pageContainer = {
    position: 'relative', minHeight: '90vh', padding: '40px 0',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  const backgroundBlur = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    // FOTO: Mesa de postres elegante
    backgroundImage: 'url("https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1920&auto=format&fit=crop")',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', // Efecto Parallax
    filter: 'blur(8px) brightness(0.7)', zIndex: 0
  };

  const cardStyle = {
    position: 'relative', zIndex: 1,
    maxWidth: '900px', width: '90%', padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Blanco semitransparente
    borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
  };

  // Estilos Modal PayPal (Mantenidos)
  const estiloOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
  const estiloModalPayPal = { backgroundColor: 'white', width: '400px', minHeight: '300px', padding: '30px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center' };


  return (
    <div style={pageContainer}>
      <div style={backgroundBlur}></div>

      {items.length === 0 ? (
        <div style={{...cardStyle, textAlign: 'center', maxWidth: '500px'}}>
          <h2 style={{ color: 'var(--color-chocolate)', fontSize: '2rem' }}>Tu carrito está vacío 🛒</h2>
          <p style={{color: '#666'}}>¡Ve al catálogo y busca algo delicioso!</p>
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'Pacifico', color: 'var(--color-chocolate)', textAlign: 'center', fontSize: '2.5rem', marginBottom: '30px' }}>
            Tu Pedido 🧁
          </h2>

          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '15px 0' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <img src={item.imagenUrl} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }} alt={item.nombre} />
                  <div>
                    <h4 style={{ margin: '0', color: '#333', fontSize: '1.1rem' }}>{item.nombre}</h4>
                    <small style={{ color: '#777' }}>{item.categoria}</small>
                  </div>
                </div>
                <p style={{ fontWeight: 'bold', color: 'var(--color-chocolate)', fontSize: '1.2rem' }}>${item.precio}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid var(--color-chocolate)', paddingTop: '20px' }}>
            {mensajeDescuento && <p style={{ color: '#E91E63', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>{mensajeDescuento}</p>}
            
            <p style={{ color: '#666' }}>Subtotal: ${total}</p>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--color-chocolate)', margin: '10px 0' }}>Total: ${totalConDescuento}</h3>

            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>📅 Fecha de Entrega:</label>
              <input type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '1rem' }} />
            </div>

            {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
              <button onClick={vaciarCarrito} style={{ padding: '12px 25px', border: '2px solid #ff4444', color: '#ff4444', backgroundColor: 'transparent', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                Vaciar Carrito
              </button>
              
              <button onClick={iniciarProcesoPago} style={{ padding: '12px 40px', backgroundColor: '#FFC439', color: '#003087', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{fontStyle:'italic', fontWeight:'900'}}>Pay</span><span style={{fontStyle:'italic', color:'#009cde'}}>Pal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PAYPAL (Fuera de la card para que use su propio overlay) */}
      {mostrarPayPal && (
        <div style={estiloOverlay}>
          <div style={estiloModalPayPal}>
            {pagoExitoso ? (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ fontSize: '5rem', marginBottom: '10px' }}>✅</div>
                <h2 style={{ color: '#2e7d32', margin: 0 }}>¡Pago Exitoso!</h2>
                <p style={{ color: '#666' }}>Tu pedido está siendo preparado.</p>
              </div>
            ) : procesandoPago ? (
              <div style={{ padding: '40px 0' }}>
                <div style={{ width: '60px', height: '60px', border: '6px solid #f3f3f3', borderTop: '6px solid #003087', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '20px', fontWeight: 'bold', color: '#003087', fontSize: '1.2rem' }}>Procesando...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontStyle:'italic', color:'#003087', fontWeight:'900', fontSize: '2rem' }}>Pay<span style={{color:'#009cde'}}>Pal</span></h2>
                  <p style={{fontSize:'1rem', color:'#666'}}>Total a pagar: <strong>${totalConDescuento}</strong></p>
                </div>
                <form onSubmit={confirmarPagoPayPal}>
                  <input type="email" placeholder="Correo electrónico" required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }} />
                  <input type="password" placeholder="Contraseña" required style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }} />
                  <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#003087', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>Iniciar sesión y Pagar</button>
                  <button type="button" onClick={() => setMostrarPayPal(false)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#009cde', cursor: 'pointer', textDecoration: 'underline' }}>Cancelar</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;