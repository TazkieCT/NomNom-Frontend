import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { GuestRoute, PrivateRoute } from './components/ProtectedRoute'
import Marketplace from './pages/Marketplace'
import AboutUs from './pages/AboutUs'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ItemDetail from './pages/ItemDetail'
import BecomeSeller from './pages/BecomeSeller'
import CreateStore from './pages/CreateStore'
import Dashboard from './pages/Dashboard'
import Header from './components/header'
import Footer from './components/footer'

function App() {
  return (
    <AuthProvider>
      <div>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/deal/:id" element={<ItemDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Guest routes */}
            <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
            
            {/* Protected routes */}
            <Route path="/become-seller" element={<PrivateRoute><BecomeSeller /></PrivateRoute>} />
            <Route path="/create-store" element={<PrivateRoute><CreateStore /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
