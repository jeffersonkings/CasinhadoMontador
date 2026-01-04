import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ServiceProvider } from './context/ServiceContext';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import PessoalDashboard from './pages/PessoalDashboard'; // renomeado
import ProfissionalDashboard from './pages/ProfissionalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Historico from './pages/Historico';
import Home from './pages/Home'; // nova tela principal
import Header from './components/Header';
import ProtectedRoute from './routes/ProtectedRoute';

function AppContent() {
  const { user } = React.useContext(AuthContext);

  return (
    <>
      {user && <Header />}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar" element={<RecuperarSenha />} />

        {/* Tela principal protegida */}
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={["cliente", "profissional", "admin"]}>
            <Home />
          </ProtectedRoute>
        } />

        {/* Painéis protegidos */}
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

        {/* Rota fallback */}
        <Route path="/unauthorized" element={<p>Acesso não autorizado.</p>} />
      </Routes>
    </>
  );
}

export default function app() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <Router>
          <AppContent />
        </Router>
      </ServiceProvider>
    </AuthProvider>
  );
}
