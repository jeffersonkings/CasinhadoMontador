import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProtectedRouter.css";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, authLoading } = useAuth();

  // Enquanto carrega dados do usuário
 if (authLoading) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Carregando...</p>
      <div className="loader"></div>
    </div>
  );
}
  // Se não estiver logado
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se o papel não for permitido
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Acesso permitido
  return children;
}
