import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../components/image/fundo-casinha-do-montador.jpg";
import { useAuth } from "../context/AuthContext";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [role, setRole] = useState("pessoal");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha, role);
      navigate(`/${role}`);
    } catch {
      setErro("Email ou senha inválidos.");
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle(role);
      navigate(`/${role}`);
    } catch {
      setErro("Erro ao entrar com Google.");
    }
  };

  const handleFacebook = async () => {
    try {
      await loginWithFacebook(role);
      navigate(`/${role}`);
    } catch {
      setErro("Erro ao entrar com Facebook.");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-area">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1>Casinha do Montador</h1>
      </div>

      <form onSubmit={handleLogin} className="login-box">
        <h2>Login</h2>

        <div className="role-toggle">
          <button type="button" className={role === "pessoal" ? "active" : ""} onClick={() => setRole("pessoal")}>Pessoal</button>
          <button type="button" className={role === "profissional" ? "active" : ""} onClick={() => setRole("profissional")}>Profissional</button>
        </div>

        {erro && <p className="erro">{erro}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>

        <button type="button" className="google-btn" onClick={handleGoogle}>
          <FaGoogle /> Entrar com Conta Google
        </button>

        <button type="button" className="facebook-btn" onClick={handleFacebook}>
          <FaFacebookF /> Entrar com Conta Facebook
        </button>

        <div className="login-links">
          <span onClick={() => navigate("/cadastro")}>Cadastrar-se</span>
          <span onClick={() => navigate("/recuperar")}>Esqueceu a senha?</span>
        </div>
      </form>
    </div>
  );
}
