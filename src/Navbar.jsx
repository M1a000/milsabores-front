import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('carrito');
    setUsuario(null);
    setMenuAbierto(false);
    navigate('/login');
    window.location.reload();
  };

  const closeMenu = () => setMenuAbierto(false);

  // --- CONTENIDO DEL MENÚ (Reutilizable para Móvil y Desktop) ---
  const AdminLink = () => (
    (usuario?.rol === 'ADMIN' || usuario?.rol === 'VENDEDOR') && (
      <Link to="/admin" className="btn-admin" onClick={closeMenu}>⚙️ Panel</Link>
    )
  );

  return (
    <nav className="navbar-container">
      
      {/* 1. LOGO (Siempre visible a la izquierda) */}
      <Link to="/" className="logo" onClick={closeMenu}>
        Pastelería Mil Sabores 🍰
      </Link>

      {/* 2. MENU ESCRITORIO (ESTILO SPOTIFY) - Se oculta en móvil */}
      
      {/* GRUPO IZQUIERDO: Navegación */}
      <div className="desktop-left">
        <AdminLink />
        <Link to="/catalogo" className="nav-link">Catálogo</Link>
        <Link to="/nosotros" className="nav-link">Nosotros</Link>
        <Link to="/blog" className="nav-link">Blog</Link>
      </div>

      {/* GRUPO DERECHO: Acciones de Usuario (Login/Carrito) */}
      <div className="desktop-right">
        {(!usuario || usuario.rol === 'CLIENTE') && (
          <Link to="/carrito" className="nav-link" onClick={closeMenu}>Carrito</Link>
        )}

        {usuario ? (
          // LOGUEADO
          <>
            {usuario.rol === 'CLIENTE' && <Link to="/historial" className="nav-link">Mis Compras</Link>}
            <Link to="/perfil" className="nav-link">
              <span style={{ color: '#FFC0CB' }}>{usuario.nombre.split(' ')[0]} 👤</span>
            </Link>
            <span className="nav-link" style={{ color: '#ffccbc' }} onClick={cerrarSesion}>Salir</span>
          </>
        ) : (
          // NO LOGUEADO (ESTILO SPOTIFY)
          <>
            <Link to="/registro" className="registrate-link">Regístrate</Link>
            <Link to="/login" className="spotify-btn">Iniciar sesión</Link>
          </>
        )}
      </div>

      {/* 3. BOTÓN HAMBURGUESA (Solo Móvil) */}
      <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
        {menuAbierto ? '✖' : '☰'}
      </button>

      {/* 4. MENÚ DESPLEGABLE MÓVIL */}
      <div className={`mobile-menu-container ${menuAbierto ? 'abierto' : ''}`}>
        <AdminLink />
        <Link to="/catalogo" className="nav-link" onClick={closeMenu}>Catálogo</Link>
        <Link to="/nosotros" className="nav-link" onClick={closeMenu}>Nosotros</Link>
        <Link to="/blog" className="nav-link" onClick={closeMenu}>Blog</Link>
        
        {(!usuario || usuario.rol === 'CLIENTE') && (
          <Link to="/carrito" className="nav-link" onClick={closeMenu}>Carrito</Link>
        )}

        {usuario ? (
          <>
             {usuario.rol === 'CLIENTE' && <Link to="/historial" className="nav-link" onClick={closeMenu}>Mis Compras</Link>}
             <Link to="/perfil" className="nav-link" onClick={closeMenu}>Perfil</Link>
             <span className="nav-link" onClick={cerrarSesion} style={{color:'#ffccbc'}}>Cerrar Sesión</span>
          </>
        ) : (
          <>
            <Link to="/registro" className="nav-link" onClick={closeMenu}>Regístrate</Link>
            <Link to="/login" className="spotify-btn" onClick={closeMenu}>Iniciar sesión</Link>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;