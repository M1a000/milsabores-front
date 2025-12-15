import { useState, useEffect } from 'react';

function PanelVendedor() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    // 1. Verificamos si es VENDEDOR o ADMIN
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario || (usuario.rol !== 'VENDEDOR' && usuario.rol !== 'ADMIN')) {
      window.location.href = '/'; // Si es cliente o intruso, lo echamos
      return;
    }

    // 2. Cargamos TODAS las ventas
    fetch('http://localhost:8080/api/ventas')
      .then(res => res.json())
      .then(data => setVentas(data.reverse())) // Las más recientes primero
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--color-chocolate)', fontFamily: 'Pacifico' }}>
        Panel de Gestión de Pedidos 📋
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-chocolate)', color: 'white' }}>
            <th style={{ padding: '15px' }}>ID</th>
            <th style={{ padding: '15px' }}>Cliente</th>
            <th style={{ padding: '15px' }}>Fecha Entrega</th>
            <th style={{ padding: '15px' }}>Total</th>
            <th style={{ padding: '15px' }}>Estado</th>
            <th style={{ padding: '15px' }}>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
              <td style={{ padding: '15px' }}>#{venta.id}</td>
              <td style={{ padding: '15px' }}>{venta.nombreUsuario}</td>
              <td style={{ padding: '15px' }}>{venta.fechaEntrega}</td>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>${venta.totalPagado}</td>
              <td style={{ padding: '15px' }}>
                <span style={{ 
                  backgroundColor: venta.estado === 'Entregado' ? '#c8e6c9' : '#ffe0b2',
                  color: venta.estado === 'Entregado' ? '#2e7d32' : '#ef6c00',
                  padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold'
                }}>
                  {venta.estado}
                </span>
              </td>
              <td style={{ padding: '15px', fontSize: '0.8rem', textAlign: 'left' }}>
                <pre style={{ fontFamily: 'sans-serif' }}>{venta.detalleCompra}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PanelVendedor;   