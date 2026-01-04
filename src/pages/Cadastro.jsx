import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../components/image/fundo-casinha-do-montador.jpg";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { isCPF } from "validation-br";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

import "./Cadastro.css";

export default function Cadastro() {
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("pessoal");
  const [form, setForm] = useState({
    email: "",
    password: "",
    endereco: "",
    cpf: "",
    documento: "",
    documentoFile: null
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    if (role === "profissional" && !isCPF(form.cpf)) {
      setError("CPF inválido.");
      setLoading(false);
      return;
    }

    let documentoURL = "";
    if (role === "profissional" && form.documentoFile) {
      const storageRef = ref(storage, `documentos/${Date.now()}_${form.documentoFile.name}`);
      await uploadBytes(storageRef, form.documentoFile);
      documentoURL = await getDownloadURL(storageRef);
    }

    const extraData = {
      endereco: form.endereco || "",
      cpf: form.cpf || "",
      documento: form.documento || "",
      documentoURL
    };

    await register(form.email, form.password, role, extraData);
    navigate(`/${role}`);
  } catch (err) {
    setError("Erro ao cadastrar: " + err.message);
  } finally {
    setLoading(false);
  }
};


  const handleGoogle = async () => {
    try {
      await loginWithGoogle(role);
      navigate(`/${role}`);
    } catch {
      setError("Erro ao entrar com Google.");
    }
  };

  const handleFacebook = async () => {
    try {
      await loginWithFacebook(role);
      navigate(`/${role}`);
    } catch {
      setError("Erro ao entrar com Facebook.");
    }
  };

  return (
    <div className="cadastro-container">
      <div className="logo-area">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1>Casinha do Montador</h1>
      </div>

      <form onSubmit={handleSubmit} className="cadastro-box">
        <h2>Cadastro</h2>

        <div className="social-buttons">
          <button type="button" onClick={handleGoogle}>
            <FaGoogle /> Criar conta com Google
          </button>
          <button type="button" onClick={handleFacebook}>
            <FaFacebookF /> Criar conta com Facebook
          </button>
        </div>

        <div className="divider">ou</div>

        <div className="role-toggle"> 
          <button type="button" className={role === "pessoal" ? "active" : ""} onClick={() => setRole("pessoal")}>Pessoal</button> 
          <button type="button" className={role === "profissional" ? "active" : ""} onClick={() => setRole("profissional")}>Profissional</button> 
          <button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>Administrador</button> 
        </div>

        {error && <p className="error">{error}</p>}

        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Senha" value={form.password} onChange={handleChange} required />

        {role === "pessoal" && (
          <input type="text" name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} required />
        )}

        {role === "profissional" && (
          <>
            <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
            <input type="text" name="documento" placeholder="RG ou CNH" value={form.documento} onChange={handleChange} required />
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, documentoFile: e.target.files[0] })} />
          </>
        )}

        <button type="submit" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</button>

        <p className="termos">
          Ao se cadastrar, você concorda com nossos <strong>Termos de Uso</strong> e <strong>Política de Privacidade</strong>.
        </p>
      </form>
    </div>
  );
}
