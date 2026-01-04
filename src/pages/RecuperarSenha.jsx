import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from "../components/image/fundo-casinha-do-montador.jpg";
import { useAuth } from "../context/AuthContext";
import "./RecuperarSenha.css";

export default function RecuperarSenha() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      await resetPassword(email);
      setMensagem("Verifique seu email para redefinir a senha.");
    } catch {
      setErro("Erro ao enviar recuperação. Verifique o email.");
    }
  };

  return (
    <div className="recuperar-container">
      <div className="logo-area">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1>Casinha do Montador</h1>
      </div>

      <form onSubmit={handleSubmit} className="recuperar-box">
        <h2>Recuperar Senha</h2>

        {mensagem && <p className="mensagem">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Enviar recuperação</button>

        <p className="termos">
          Você receberá um link para redefinir sua senha por email.
          <br/>
          <Link to="/">Lembrou a senha? Faça login</Link>
        </p>
        </form>
      </div>
    );
  }
