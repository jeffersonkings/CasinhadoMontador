import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "solicitacoes"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSolicitacoes(lista);
    });
    return () => unsubscribe();
  }, []);

  // Aplica os filtros
  const solicitacoesFiltradas = solicitacoes.filter((s) => {
    const statusMatch = filtroStatus === "" || s.status === filtroStatus;
    const cidadeMatch = filtroCidade === "" || (s.cidade && s.cidade.toLowerCase().includes(filtroCidade.toLowerCase()));
    const tipoMatch = filtroTipo === "" || (s.tipo && s.tipo.toLowerCase().includes(filtroTipo.toLowerCase()));
    return statusMatch && cidadeMatch && tipoMatch;
  });

  return (
    <div className="admin-container">
      <h2>Painel do Administrador</h2>

      <div className="admin-filtros">
        <select onChange={(e) => setFiltroStatus(e.target.value)} value={filtroStatus}>
          <option value="">Todos os Status</option>
          <option value="Aguardando">Aguardando</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
        </select>

        <input
          type="text"
          placeholder="Filtrar por cidade"
          value={filtroCidade}
          onChange={(e) => setFiltroCidade(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por tipo"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        />
      </div>

      <div className="admin-lista">
        {solicitacoesFiltradas.map((s) => (
          <div key={s.id} className="admin-card">
            <h4>{s.tipo}</h4>
            <p><strong>Cliente:</strong> {s.cliente}</p>
            <p><strong>Profissional:</strong> {s.profissional || "—"}</p>
            <p><strong>Status:</strong> {s.status}</p>
            <p><strong>Data:</strong> {new Date(s.data).toLocaleString("pt-BR")}</p>
            <p><strong>Cidade:</strong> {s.cidade}</p>

            {/* Dados extras */}
            {s.endereco && <p><strong>Endereço:</strong> {s.endereco}</p>}
            {s.cpf && <p><strong>CPF:</strong> {s.cpf}</p>}
            {s.documento && <p><strong>Documento:</strong> {s.documento}</p>}
            {s.documentoURL && (
              <p>
                <strong>Arquivo:</strong>{" "}
                <a href={s.documentoURL} target="_blank" rel="noopener noreferrer">
                  Ver Documento
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
