import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGoogle, FaFacebookF, FaInstagram, FaLinkedin, FaMoon, FaSun } from "react-icons/fa";
import "./Saudacao.css";
import logo from "../components/image/fundo-casinha-do-montador.jpg";

export default function Saudacao() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [role, setRole] = useState("pessoal");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("pt");
  const navigate = useNavigate();

  const avatarURL = email
    ? `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=007bff&color=fff`
    : "";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha, role);
      navigate(`/${role}`);
    } catch {
      setErro(lang === "pt" ? "Email ou senha inválidos." : "Invalid email or password.");
    }
  };

  const toggleLang = () => setLang(lang === "pt" ? "en" : "pt");

  // 🔧 Aqui está o segredo: aplicar/remover classe no body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="saudacao-wrapper">
      {/* Lado esquerdo */}
      <section className="saudacao-left">
        <h1>Casinha do Montador</h1>
        <p>
          {lang === "pt"
            ? "Conectamos Clientes e Profissionais de montagem com agilidade, confiança e praticidade. Tudo em um só lugar."
            : "We connect Clients and Assembly Professionals with agility, trust and practicality. All in one place."}
        </p>
        <p className="slogan">
          {lang === "pt" ? "Montagem com confiança e carinho." : "Assembly with trust and care."}
        </p>
        <div className="social-icons">
          <FaInstagram aria-label="Instagram" />
          <FaLinkedin aria-label="LinkedIn" />
          <FaFacebookF aria-label="Facebook" />
        </div>
      </section>

      {/* Lado direito */}
      <section className="saudacao-right">
        <div className="logo-login">
          <img src={logo} alt="Logo Casinha do Montador" className="logo-img" />
        </div>

        <h2>{lang === "pt" ? "Login" : "Sign In"}</h2>

        <div className="tabs">
          <button
            type="button"
            className={role === "pessoal" ? "active" : ""}
            onClick={() => setRole("pessoal")}
          >
            {lang === "pt" ? "Pessoal" : "Personal"}
          </button>
          <button
            type="button"
            className={role === "profissional" ? "active" : ""}
            onClick={() => setRole("profissional")}
          >
            {lang === "pt" ? "Profissional" : "Professional"}
          </button>
        </div>


        {erro && <p className="erro">{erro}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={lang === "pt" ? "Email" : "Email Address"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={lang === "pt" ? "Senha" : "Password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" className="btn-login">
            {lang === "pt" ? "Entrar" : "Sign In"}
          </button>
        </form>

        {email && (
          <p className="welcome-message">
            {lang === "pt" ? `Olá, ${email.split("@")[0]}!` : `Hello, ${email.split("@")[0]}!`}
          </p>
        )}

        <div className="social-login">
          <button className="btn-google" onClick={() => loginWithGoogle(role)}>
            <FaGoogle aria-hidden="true" /> {lang === "pt" ? "Entrar com Conta Google" : "Sign in with Google"}
          </button>
          <button className="btn-facebook" onClick={() => loginWithFacebook(role)}>
            <FaFacebookF aria-hidden="true" /> {lang === "pt" ? "Entrar com Conta Facebook" : "Sign in with Facebook"}
          </button>
        </div>

        <div className="links">
          <p onClick={() => navigate("/cadastro")}>
            {lang === "pt" ? "Cadastrar-se" : "Sign Up"}
          </p>
          <p onClick={() => navigate("/recuperar")}>
            {lang === "pt" ? "Esqueceu a senha?" : "Forgot Password?"}
          </p>
        </div>

        {avatarURL && <img src={avatarURL} alt="Avatar do usuário" className="avatar-preview" />}

        {/* Toggle bar */}
        <div className="toggle-bar">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={toggleLang}>{lang === "pt" ? "EN" : "PT"}</button>
        </div>
      </section>
    </div>
  );
}
