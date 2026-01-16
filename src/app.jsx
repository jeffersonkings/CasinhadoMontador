import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ServiceProvider } from './context/ServiceContext';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import PessoalDashboard from './pages/PessoalDashboard';
import ProfissionalDashboard from './pages/ProfissionalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Historico from './pages/Historico';
import Saudacao from './pages/Saudacao';
import Home from './pages/Home';
import Header from './components/Header';
import ProtectedRoute from './routes/ProtectedRoute';
import './Global.css';


function AppContent() {
  const { user, authLoading } = React.useContext(AuthContext);

  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Carregando aplicação...</p>
      </div>
    );
  }

  return (
    <>
      {user && <Header />}
      <Routes>
       <Route path="/" element={user ? <Navigate to="/home" /> : <Saudacao />} /> 
       <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar" element={<RecuperarSenha />} />

        <Route path="/home" element={
          <ProtectedRoute allowedRoles={["cliente", "profissional", "admin"]}>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/cliente" element={
          <ProtectedRoute allowedRoles={["cliente"]}>
            <PessoalDashboard />
          </ProtectedRoute>
        } />

        <Route path="/profissional" element={
          <ProtectedRoute allowedRoles={["profissional"]}>
            <ProfissionalDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/historico" element={
          <ProtectedRoute allowedRoles={["cliente", "profissional"]}>
            <Historico />
          </ProtectedRoute>
        } />

        <Route path="/perfil" element={
          <ProtectedRoute allowedRoles={["cliente", "profissional"]}>
            <Perfil />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<p>Acesso não autorizado.</p>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <BrowserRouter basename="/CasinhadoMontador">
          <AppContent />
        </BrowserRouter>
      </ServiceProvider>
    </AuthProvider>
  );
}
