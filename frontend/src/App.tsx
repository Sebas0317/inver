import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { UsersPage } from './pages/UsersPage'
import './styles/Loading.css'
import './styles/Layout.css'

// Layout con navegación lateral
function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Usuarios', icon: '👥' },
    { path: '/operators', label: 'Operadores', icon: '🏢' },
    { path: '/locations', label: 'Puntos', icon: '📍' },
    { path: '/machines', label: 'Máquinas', icon: '🎰' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🏛️</span>
          <h1>Athena ERP</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.full_name.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name">{user?.full_name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

// Dashboard principal
function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Bienvenido al sistema de gestión de máquinas electrónicas</p>

      <div className="dashboard-grid">
        <div className="dashboard-card status-card">
          <div className="card-icon">📊</div>
          <h3>Estado del Proyecto</h3>
          <p className="status-badge-complete">Fase 1.2 - Completa</p>
          <ul>
            <li>✅ Autenticación JWT</li>
            <li>✅ Gestión de Usuarios</li>
            <li>⏳ Operadores</li>
            <li>⏳ Puntos de Operación</li>
            <li>⏳ Máquinas</li>
          </ul>
        </div>

        <div className="dashboard-card info-card">
          <div className="card-icon">📚</div>
          <h3>Módulos Disponibles</h3>
          <ul>
            <li><strong>Usuarios:</strong> CRUD completo de usuarios del sistema</li>
            <li><strong>Operadores:</strong> Gestión de clientes y porcentajes</li>
            <li><strong>Puntos:</strong> Ubicación de máquinas por operador</li>
            <li><strong>Máquinas:</strong> Catálogo de equipos y tipos</li>
          </ul>
        </div>

        <div className="dashboard-card docs-card">
          <div className="card-icon">📖</div>
          <h3>Documentación</h3>
          <p>Consulta la documentación completa en la carpeta <code>docs/</code></p>
          <ul>
            <li><a href="http://localhost:8000/api/docs/" target="_blank" rel="noreferrer">Swagger API</a></li>
            <li><a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer">Django Admin</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App