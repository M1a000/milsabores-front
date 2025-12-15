import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Importamos tus componentes
import Navbar from './Navbar';
import Footer from './Footer';
import Productos from './Productos';
import Registro from './Registro';
import Login from './Login';
import Carrito from './Carrito';
import Perfil from './Perfil';
import Historial from './Historial';
import Blog from './Blog';
import Contacto from './Contacto';
import Home from './Home';
import AdminPanel from './AdminPanel';
import SobreNosotros from './SobreNosotros';

// --- COMPONENTE INTERNO QUE CONTROLA LA VISIBILIDAD ---
function Layout() {
  const location = useLocation(); // Hook para saber la URL actual
  
  // Verificamos si estamos en la ruta "/admin"
  const esPanelAdmin = location.pathname === '/admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* LÓGICA: Si NO es panel admin, mostramos el Navbar */}
      {!esPanelAdmin && <Navbar />}

      {/* El contenido principal crece */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Productos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/nosotros" element={<SobreNosotros />} />
        </Routes>
      </div>

      {/* LÓGICA: Si NO es panel admin, mostramos el Footer */}
      {!esPanelAdmin && <Footer />}

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Llamamos al componente Layout que tiene la lógica */}
      <Layout />
    </BrowserRouter>
  )
}

export default App;