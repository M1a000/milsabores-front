import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('dashboard');
  
  // DATOS
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // FILTROS
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  
  // ESTADOS PARA EDICIÓN
  const [productoEditando, setProductoEditando] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // --- ESTADOS DE UI ---
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });
  
  // UN SOLO MODAL PARA TODO (Guardar y Eliminar)
  // accion: 'eliminar' | 'guardar'
  // entidad: 'producto' | 'usuario'
  // id: ID del elemento (solo para eliminar)
  const [modalConfirmacion, setModalConfirmacion] = useState({ visible: false, accion: '', entidad: '', id: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!user || (user.rol !== 'ADMIN' && user.rol !== 'VENDEDOR')) {
      navigate('/');
      return;
    }
    setUsuario(user);
    if(user.rol === 'VENDEDOR') setPestanaActiva('ventas');
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    fetch('http://localhost:8080/api/productos').then(res => res.json()).then(setProductos);
    fetch('http://localhost:8080/api/ventas').then(res => res.json()).then(data => setVentas(data.reverse()));
    
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (user && user.rol === 'ADMIN') {
      fetch('http://localhost:8080/api/usuarios').then(res => res.json()).then(setUsuarios).catch(() => {});
    }
  };

  // --- 1. SISTEMA DE NOTIFICACIONES ---
  const mostrarMensaje = (texto, tipo = 'exito') => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => {
      setNotificacion({ visible: false, texto: '', tipo: '' });
    }, 3000);
  };

  // --- 2. LÓGICA DEL MODAL MAESTRO ---
  
  // A. Preparar Eliminación
  const solicitarEliminar = (id, entidad) => {
    setModalConfirmacion({ visible: true, accion: 'eliminar', entidad, id });
  };

  // B. Preparar Guardado (Interceptamos el submit del formulario)
  const solicitarGuardar = (e, entidad) => {
    e.preventDefault(); // Evitamos que se guarde directo
    setModalConfirmacion({ visible: true, accion: 'guardar', entidad, id: null });
  };

  const cerrarModal = () => {
    setModalConfirmacion({ visible: false, accion: '', entidad: '', id: null });
  };

  // C. El botón "SÍ" del Modal llama a esta función
  const ejecutarAccionConfirmada = () => {
    const { accion, entidad, id } = modalConfirmacion;

    if (accion === 'eliminar') {
      ejecutarEliminacionReal(id, entidad);
    } else if (accion === 'guardar') {
      ejecutarGuardadoReal(entidad);
    }
    cerrarModal();
  };

  // --- 3. LOGICA REAL DE ELIMINACIÓN (Se ejecuta tras confirmar) ---
  const ejecutarEliminacionReal = (id, entidad) => {
    const url = entidad === 'producto' 
      ? `http://localhost:8080/api/productos/${id}` 
      : `http://localhost:8080/api/usuarios/${id}`;

    fetch(url, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          mostrarMensaje(`🗑️ ${entidad === 'producto' ? 'Producto' : 'Usuario'} eliminado correctamente`, 'exito');
          cargarDatos();
        } else {
          mostrarMensaje('❌ Error al eliminar', 'error');
        }
      })
      .catch(() => mostrarMensaje('❌ Error de conexión', 'error'));
  };

  // --- 4. LOGICA REAL DE GUARDADO (Se ejecuta tras confirmar) ---
  const ejecutarGuardadoReal = (entidad) => {
    if (entidad === 'producto') {
      const method = productoEditando.id ? 'PUT' : 'POST';
      const url = productoEditando.id ? `http://localhost:8080/api/productos/${productoEditando.id}` : 'http://localhost:8080/api/productos';
      
      fetch(url, {
        method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productoEditando)
      }).then(() => { 
        mostrarMensaje(`✅ Producto ${productoEditando.id ? 'actualizado' : 'creado'} con éxito`, 'exito');
        setProductoEditando(null); 
        cargarDatos(); 
      }).catch(() => mostrarMensaje('❌ Error al guardar producto', 'error'));

    } else if (entidad === 'usuario') {
      const url = usuarioEditando.id 
        ? `http://localhost:8080/api/usuarios/${usuarioEditando.id}` 
        : 'http://localhost:8080/api/usuarios/registro';
      const method = usuarioEditando.id ? 'PUT' : 'POST';

      fetch(url, {
        method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(usuarioEditando)
      }).then(() => {
        mostrarMensaje(`✅ Usuario ${usuarioEditando.id ? 'actualizado' : 'registrado'} con éxito`, 'exito');
        setUsuarioEditando(null);
        cargarDatos();
      }).catch(() => mostrarMensaje('❌ Error al guardar usuario', 'error'));
    }
  };


  // --- RENDERIZADO ---
  if (!usuario) return null;

  const btnMenu = (nombre, tab) => ({
    padding: '15px 20px', cursor: 'pointer', border: 'none', background: pestanaActiva === tab ? 'var(--color-chocolate)' : '#eee',
    color: pestanaActiva === tab ? 'white' : '#333', fontWeight: 'bold', width: '100%', textAlign: 'left',
    transition: 'all 0.3s'
  });

  // ESTILOS
  const estiloNotificacion = {
    position: 'fixed', top: '20px', right: '20px',
    backgroundColor: notificacion.tipo === 'error' ? '#ff5252' : '#4caf50',
    color: 'white', padding: '15px 25px', borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 2000,
    fontWeight: 'bold', animation: 'fadeIn 0.5s', display: 'flex', alignItems: 'center', gap: '10px'
  };

  const estiloOverlay = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
  };

  const estiloModalConfirm = {
    backgroundColor: 'white', padding: '30px', borderRadius: '15px',
    boxShadow: '0 5px 25px rgba(0,0,0,0.3)', textAlign: 'center', maxWidth: '400px', width: '90%'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Lato', sans-serif" }}>
      
      {/* 1. NOTIFICACIÓN FLOTANTE */}
      {notificacion.visible && (
        <div style={estiloNotificacion}>
          {notificacion.texto}
        </div>
      )}

      {/* 2. MODAL MAESTRO DE CONFIRMACIÓN */}
      {modalConfirmacion.visible && (
        <div style={estiloOverlay}>
          <div style={estiloModalConfirm}>
            
            {/* Ícono dinámico: Basura roja si elimina, Check azul si guarda */}
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>
              {modalConfirmacion.accion === 'eliminar' ? '⚠️' : '💾'}
            </div>
            
            <h3 style={{margin: '0 0 10px 0'}}>
              {modalConfirmacion.accion === 'eliminar' ? '¿Eliminar este elemento?' : '¿Guardar cambios?'}
            </h3>
            
            <p style={{color: '#666', marginBottom: '20px'}}>
              {modalConfirmacion.accion === 'eliminar' 
                ? 'Esta acción es permanente y no se puede deshacer.' 
                : 'Se actualizará la información en la base de datos.'}
            </p>
            
            <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
              <button onClick={cerrarModal} style={{padding: '10px 20px', border: '1px solid #ccc', background: 'white', borderRadius: '5px', cursor: 'pointer'}}>
                Cancelar
              </button>
              
              <button 
                onClick={ejecutarAccionConfirmada} 
                style={{
                  padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: 'white',
                  background: modalConfirmacion.accion === 'eliminar' ? '#e74c3c' : '#2ecc71' // Rojo para borrar, Verde para guardar
                }}
              >
                {modalConfirmacion.accion === 'eliminar' ? 'Sí, Eliminar' : 'Sí, Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '20px', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: 'var(--color-chocolate)', fontFamily: 'Pacifico', textAlign: 'center', marginBottom: '30px' }}>
          Panel {usuario.rol === 'ADMIN' ? 'Admin' : 'Vendedor'}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {usuario.rol === 'ADMIN' && (
            <>
              <button style={btnMenu('📊 Dashboard', 'dashboard')} onClick={() => setPestanaActiva('dashboard')}>📊 Dashboard</button>
              <button style={btnMenu('👥 Usuarios', 'usuarios')} onClick={() => setPestanaActiva('usuarios')}>👥 Usuarios</button>
            </>
          )}
          <button style={btnMenu('🍰 Productos', 'productos')} onClick={() => setPestanaActiva('productos')}>🍰 Productos</button>
          <button style={btnMenu('📦 Ventas', 'ventas')} onClick={() => setPestanaActiva('ventas')}>📦 Ventas</button>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
          <Link to="/" style={{ display: 'block', padding: '12px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold' }}>
            🏠 Volver a la Tienda
          </Link>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#fff', overflowY: 'auto' }}>
        
        {/* DASHBOARD */}
        {pestanaActiva === 'dashboard' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h1 style={{color: '#333'}}>Resumen del Negocio</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
              <div style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color:'white', padding: '30px', borderRadius: '15px', flex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <h3>💰 Ingresos</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>${ventas.reduce((acc,v)=>acc+v.totalPagado,0).toLocaleString()}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', color:'white', padding: '30px', borderRadius: '15px', flex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <h3>🛒 Pedidos</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{ventas.length}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color:'white', padding: '30px', borderRadius: '15px', flex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <h3>👥 Usuarios</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{usuarios.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* USUARIOS */}
        {pestanaActiva === 'usuarios' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1>Gestión de Usuarios</h1>
              <button onClick={() => setUsuarioEditando({rol: 'CLIENTE'})} style={{ background: 'var(--color-chocolate)', color: 'white', padding: '12px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight:'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>+ Nuevo Usuario</button>
            </div>

            {usuarioEditando && (
              <div style={{ background: '#f8f9fa', padding: '30px', marginBottom: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderLeft: '5px solid var(--color-chocolate)' }}>
                <h3>{usuarioEditando.id ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                
                {/* FORMULARIO USUARIO: Ahora llama a solicitarGuardar */}
                <form onSubmit={(e) => solicitarGuardar(e, 'usuario')} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
                  <input placeholder="Nombre" value={usuarioEditando.nombre || ''} onChange={e => setUsuarioEditando({...usuarioEditando, nombre: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                  <input placeholder="Email" type="email" value={usuarioEditando.email || ''} onChange={e => setUsuarioEditando({...usuarioEditando, email: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                  <input placeholder="Contraseña" type="text" value={usuarioEditando.password || ''} onChange={e => setUsuarioEditando({...usuarioEditando, password: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                  
                  <label style={{fontWeight:'bold'}}>Rol:</label>
                  <select value={usuarioEditando.rol || 'CLIENTE'} onChange={e => setUsuarioEditando({...usuarioEditando, rol: e.target.value})} style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}>
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={{padding:'12px 20px', background:'#2ecc71', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>Guardar</button>
                    <button type="button" onClick={() => setUsuarioEditando(null)} style={{padding:'12px 20px', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <thead style={{ background: 'var(--color-chocolate)', color: 'white' }}><tr><th style={{padding:'15px'}}>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center', background: 'white' }}>
                    <td style={{padding:'15px'}}>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td><span style={{ padding:'5px 10px', borderRadius:'15px', color: 'white', fontSize:'0.8rem', fontWeight:'bold', backgroundColor: u.rol === 'ADMIN' ? '#c0392b' : u.rol === 'VENDEDOR' ? '#f39c12' : '#2980b9' }}>{u.rol || 'CLIENTE'}</span></td>
                    <td>
                      <button onClick={() => setUsuarioEditando(u)} style={{ marginRight: '10px', cursor: 'pointer', border:'none', background:'transparent', fontSize:'1.2rem' }}>✏️</button>
                      
                      {/* Botón Borrar: Llama al modal */}
                      <button onClick={() => solicitarEliminar(u.id, 'usuario')} style={{ color: 'red', cursor: 'pointer', border:'none', background:'transparent', fontSize:'1.2rem' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCTOS */}
        {pestanaActiva === 'productos' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Gestión de Productos</h1>
              {usuario.rol === 'ADMIN' && <button onClick={() => setProductoEditando({})} style={{ background: 'var(--color-chocolate)', color: 'white', padding: '12px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight:'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>+ Nuevo Producto</button>}
            </div>
            
            <input type="text" placeholder="🔎 Buscar producto..." value={filtroCodigo} onChange={e => setFiltroCodigo(e.target.value)} style={{ padding: '15px', width: '100%', margin: '20px 0', border: '1px solid #ddd', borderRadius: '10px', fontSize: '1rem' }} />
            
            {productoEditando && (
              <div style={{ background: '#f8f9fa', padding: '30px', marginBottom: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderLeft: '5px solid var(--color-chocolate)' }}>
                <h3>{productoEditando.id ? 'Editar' : 'Crear'} Producto</h3>
                
                {/* FORMULARIO PRODUCTO: Llama a solicitarGuardar */}
                <form onSubmit={(e) => solicitarGuardar(e, 'producto')} style={{ display: 'grid', gap: '15px' }}>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                     <input placeholder="Código" value={productoEditando.codigo || ''} onChange={e => setProductoEditando({...productoEditando, codigo: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                     <input placeholder="Nombre" value={productoEditando.nombre || ''} onChange={e => setProductoEditando({...productoEditando, nombre: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                     <input placeholder="Categoría" value={productoEditando.categoria || ''} onChange={e => setProductoEditando({...productoEditando, categoria: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                     <input type="number" placeholder="Precio" value={productoEditando.precio || ''} onChange={e => setProductoEditando({...productoEditando, precio: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                  </div>
                  <textarea placeholder="Descripción" value={productoEditando.descripcion || ''} onChange={e => setProductoEditando({...productoEditando, descripcion: e.target.value})} required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd', minHeight:'80px'}}/>
                  <input placeholder="URL Imagen" value={productoEditando.imagenUrl || ''} onChange={e => setProductoEditando({...productoEditando, imagenUrl: e.target.value})} style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}}/>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{padding:'12px 20px', background:'#2ecc71', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>Guardar</button>
                    <button type="button" onClick={() => setProductoEditando(null)} style={{padding:'12px 20px', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <thead style={{ background: 'var(--color-chocolate)', color: 'white' }}><tr><th style={{padding:'15px'}}>Cód</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr></thead>
              <tbody>
                {productos.filter(p => p.nombre.toLowerCase().includes(filtroCodigo.toLowerCase()) || p.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())).map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center', background: 'white' }}>
                    <td style={{padding:'15px'}}>{p.codigo}</td><td>{p.nombre}</td><td>${p.precio}</td>
                    <td>{usuario.rol === 'ADMIN' ? <><button onClick={() => setProductoEditando(p)} style={{marginRight:'10px', border:'none', background:'transparent', fontSize:'1.2rem', cursor:'pointer'}}>✏️</button>
                    {/* Botón Borrar: Llama al modal */}
                    <button onClick={() => solicitarEliminar(p.id, 'producto')} style={{color:'red', border:'none', background:'transparent', fontSize:'1.2rem', cursor:'pointer'}}>🗑️</button></> : <span style={{fontSize:'0.8rem', color:'#888'}}>🔒 Solo lectura</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VENTAS */}
        {pestanaActiva === 'ventas' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h1>Historial de Pedidos</h1>
            <input type="text" placeholder="🔎 Filtrar por Cliente..." value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} style={{ padding: '15px', width: '100%', margin: '20px 0', border: '1px solid #ddd', borderRadius: '10px', fontSize: '1rem' }} />
            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <thead style={{ background: 'var(--color-chocolate)', color: 'white' }}><tr><th style={{padding:'15px'}}>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Detalle</th></tr></thead>
              <tbody>
                {ventas.filter(v => v.nombreUsuario.toLowerCase().includes(filtroCliente.toLowerCase())).map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center', background: 'white' }}>
                    <td style={{padding:'15px'}}>#{v.id}</td><td>{v.nombreUsuario}</td><td style={{fontWeight:'bold'}}>${v.totalPagado}</td>
                    <td><span style={{background:'#d1f2eb', color:'#117864', padding:'5px 10px', borderRadius:'15px', fontSize:'0.8rem', fontWeight:'bold'}}>{v.estado}</span></td>
                    <td style={{textAlign:'left', fontSize:'0.9rem', color:'#555'}}><pre style={{fontFamily:'sans-serif', margin:0}}>{v.detalleCompra}</pre></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPanel;