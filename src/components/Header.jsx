import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaEllipsisV } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const { user, role, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const primeiroNome = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  return (
    <header className="header">
      <h1 className="logo">Casinha do Montador</h1>
      <nav className="nav">
        <Link to="/home">
          <FaHome style={{ marginRight: "6px" }} />
          Home
        </Link>
        <Link to={`/${role}`}>Dashboard</Link>
        <Link to="/historico">Histórico</Link>

        {user && (
          <div className="user-menu" ref={menuRef}>
            <div className="menu-icon" onClick={() => setMenuAberto(!menuAberto)}>
              <FaEllipsisV />
            </div>

            {menuAberto && (
              <div className={`menu-dropdown ${menuAberto ? "show" : ""}`}>
                <p><strong>{role === "admin" ? "Administrador" : role === "profissional" ? "Profissional" : "Pessoal"}</strong></p>
                <p>{primeiroNome}</p>
                <hr />
                <p onClick={handlePerfil} style={{ cursor: "pointer", color: "#007bff" }}>
                  Configurar perfil
                </p>
                <p onClick={handleLogout} style={{ cursor: "pointer", color: "#007bff" }}>
                  Sair
                </p>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
