import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./PessoalDashboard.css"; 

export default function PessoalDashboard() {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [nova, setNova] = useState({ tipo: "", outroTipo: "", data: "", turno: "" });

  useEffect(() => {
    const q = query(collection(db, "solicitacoes"), orderBy("data"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => s.cliente === user.email);
      setSolicitacoes(lista);
    });
    return () => unsubscribe();
  }, [user]);

  const handleNovaSolicitacao = async () => {
    const tipoFinal = nova.tipo === "Outros" ? nova.outroTipo : nova.tipo;
    if (tipoFinal && nova.data && nova.turno) {
      await addDoc(collection(db, "solicitacoes"), {
        tipo: tipoFinal,
        data: new Date(nova.data), // salva como objeto Date
        turno: nova.turno,
        status: "Aguardando",
        profissional: null,
        cliente: user.email,
        cidade: "São Paulo"
      });
      setNova({ tipo: "", outroTipo: "", data: "", turno: "" });
      toast.success("Solicitação cadastrada com sucesso!");
    } else {
      toast.error("Preencha todos os campos antes de cadastrar.");
    }
  };

  return (
    <div className="pessoal-container">
    
      <h2>Painel De Serviços</h2>
      
      <h3> Nova Solicitações</h3>

      <div className="nova-solicitacao">
        <select value={nova.tipo} onChange={(e) => setNova({ ...nova, tipo: e.target.value })}>
          <option value="">Selecione o serviço</option>
          <option value="Montagem">Montagem</option>
          <option value="Desmontagem">Desmontagem</option>
          <option value="Instalação">Instalação</option>
          <option value="Desinstalação">Desinstalação</option>
          <option value="Montagem e Instalação">Montagem e Instalação</option>
          <option value="Desinstalação e Desmontagem">Desinstalação e Desmontagem</option>
          <option value="Outros">Outros</option>
        </select>

        {nova.tipo === "Outros" && (
          <input
            type="text"
            placeholder="Descreva o serviço"
            value={nova.outroTipo}
            onChange={(e) => setNova({ ...nova, outroTipo: e.target.value })}
          />
        )}

        <input
          type="date"
          value={nova.data}
          onChange={(e) => setNova({ ...nova, data: e.target.value })}
        />

        <select value={nova.turno} onChange={(e) => setNova({ ...nova, turno: e.target.value })}>
          <option value="">Selecione o turno</option>
          <option value="Manhã">Manhã</option>
          <option value="Tarde">Tarde</option>
        </select>

        <button onClick={handleNovaSolicitacao}>Cadastrar Solicitação</button>
      </div>

      <h3> Minhas Solicitações</h3>
      <div className="solicitacoes-lista">
        {solicitacoes.map((s) => (
          <div key={s.id} className="card">
            <h4>{s.tipo}</h4>
            <p><strong>Status:</strong> {s.status}</p>
            <p><strong>Data:</strong> {s.data?.toDate ? s.data.toDate().toLocaleDateString("pt-BR") : ""}</p>
            <p><strong>Turno:</strong> {s.turno}</p>
            <p><strong>Profissional:</strong> {s.profissional || "—"}</p>
          </div>
        ))}
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}
