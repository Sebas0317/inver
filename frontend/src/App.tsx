import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Páginas placeholder
function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Athena ERP</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Sistema de Gestión de Máquinas Electrónicas
      </p>
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Estado del Proyecto</h2>
        <p><strong>Fase 1:</strong> Infraestructura Base</p>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          La infraestructura base está configurada. Los próximos pasos incluyen:
        </p>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', color: '#666' }}>
          <li>Autenticación JWT</li>
          <li>Gestión de usuarios</li>
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App