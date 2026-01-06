import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../components/image/fundo-casinha-do-montador.jpg";
import "./Saudacao.css";

export default function Saudacao() {
  const navigate = useNavigate();

  return (
    <div className="saudacao-container">
      <img src={logo} alt="Logo" className="logo-img" />
      <h1>Casinha do Montador</h1>
      <p>Conectamos Clientes e Profissionais de montagem com agilidade, confiança e praticidade.</p>
      <button onClick={() => navigate("/login")}>Acessar o Painel</button>
    </div>
  );
}
