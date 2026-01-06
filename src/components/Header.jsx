import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const { user, role, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const primeiroNome = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0];
  const avatarURL = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(primeiroNome)}&background=007bff&color=fff`;

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
    setMenuAberto(false);
  };

  return (
    <>
      <header className="header">
        <h1 className="logo">Casinha do Montador</h1>
        <div className="menu-toggle" onClick={() => setMenuAberto(true)}>
          <img src={avatarURL} alt="Avatar" className="avatar" />
          <FaBars className="hamburguer" />
        </div>
      </header>

      <div className={`side-menu ${menuAberto ? "open" : ""}`} ref={menuRef}>
        <div className="side-menu-header">
          <img src={avatarURL} alt="Avatar" className="avatar-large" />
          <div>
            <strong>{primeiroNome}</strong>
            <p className="role-label">
              {role === "admin" ? "Administrador" : role === "profissional" ? "Profissional" : "Pessoal"}
            </p>
          </div>
          <FaTimes className="close-icon" onClick={() => setMenuAberto(false)} />
        </div>
        <nav className="side-nav">
          <Link to="/home" onClick={() => setMenuAberto(false)}>🏠 Home</Link>
          <Link to={`/${role}`} onClick={() => setMenuAberto(false)}>📋 Dashboard</Link>
          <Link to="/historico" onClick={() => setMenuAberto(false)}>📑 Histórico</Link>
          <Link to="/perfil" onClick={handlePerfil}>⚙️ Perfil</Link>
          <span onClick={handleLogout}>🚪 Sair</span>
        </nav>
      </div>

      {menuAberto && <div className="overlay" onClick={() => setMenuAberto(false)} />}
    </>
  );
}
