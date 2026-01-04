import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Historico.css";

export default function Historico() {
  const { user, role } = useAuth();
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    if (!user) return;

    const campo = role === "cliente" ? "cliente" : "profissional";
    const q = query(collection(db, "solicitacoes"), where(campo, "==", user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistorico(lista);
    });

    return () => unsubscribe();
  }, [user, role]);

  return (
    <div className="historico-container">
      <h2>Histórico de Serviços</h2>
      <div className="historico-lista">
        {historico.map((s) => (
          <div key={s.id} className="card">
            <h4>{s.tipo}</h4>
            <p><strong>Status:</strong> {s.status}</p>
            <p><strong>Data:</strong> {new Date(s.data).toLocaleString("pt-BR")}</p>
            <p><strong>{role === "cliente" ? "Profissional" : "Cliente"}:</strong> {role === "cliente" ? s.profissional : s.cliente}</p>
            <p><strong>Cidade:</strong> {s.cidade}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
