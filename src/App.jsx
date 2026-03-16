import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes'
import './assets/styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <AppRoutes />
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              background: '#FDFAF5',
              color: '#3D2B1F',
              border: '1px solid #D8CAB5',
              borderRadius: 10,
            },
            success: { iconTheme: { primary: '#4A6741', secondary: '#FDFAF5' } },
            error:   { iconTheme: { primary: '#B84A2A', secondary: '#FDFAF5' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
