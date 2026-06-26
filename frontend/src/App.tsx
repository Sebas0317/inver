import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import './styles/Loading.css'

// Dashboard provisional
function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Athena ERP - Dashboard</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Sistema de Gestión de Máquinas Electrónicas
      </p>
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Estado del Proyecto</h2>
        <p><strong>Fase 1:</strong> Infraestructura Base + Autenticación</p>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          La autenticación JWT está configurada. Próximamente:
        </p>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', color: '#666' }}>
          <li>Gestión de usuarios (CRUD)</li>
          <li>Catálogo de operadores</li>
          <li>Catálogo de puntos</li>
          <li>Catálogo de máquinas</li>
        </ul>
      </div>
    </div>
  )
}

function App() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App