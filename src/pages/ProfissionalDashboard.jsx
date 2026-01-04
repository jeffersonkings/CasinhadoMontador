import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import DesempenhoGraficos from "./DesempenhoGraficos";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle, FaClipboardList, FaSpinner } from "react-icons/fa";
import "./ProfissionalDashboard.css";

export default function ProfissionalDashboard() {
  const { user } = useAuth();
  const [disponiveis, setDisponiveis] = useState([]);
  const [aceitos, setAceitos] = useState([]);
  const [concluidos, setConcluidos] = useState([]);

  const nomeProfissional = user?.email;

  useEffect(() => {
    const q = query(collection(db, "solicitacoes"), where("status", "==", "Aguardando"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const dados = change.doc.data();
          toast.info(`Novo serviço disponível: ${dados.tipo} em ${dados.cidade}`);
        }
      });

      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisponiveis(lista);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "solicitacoes"), where("profissional", "==", nomeProfissional));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAceitos(lista.filter(s => s.status !== "Concluído"));
      setConcluidos(lista.filter(s => s.status === "Concluído"));
    });
    return () => unsubscribe();
  }, [nomeProfissional]);

  const aceitarServico = async (servico) => {
    const ref = doc(db, "solicitacoes", servico.id);
    await updateDoc(ref, {
      status: "Em andamento",
      profissional: nomeProfissional
    });
  };

  const concluirServico = async (servico) => {
    const ref = doc(db, "solicitacoes", servico.id);
    await updateDoc(ref, {
      status: "Concluído"
    });
    toast.success(`Serviço ${servico.tipo} marcado como concluído!`);
  };

  const progresso = aceitos.length + concluidos.length > 0
    ? Math.round((concluidos.length / (aceitos.length + concluidos.length)) * 100)
    : 0;

  return (
    <div className="profissional-container">
      <h2><FaClipboardList /> Serviços Disponíveis</h2>
      <div className="servicos-lista">
        {disponiveis.map((s) => (
          <div key={s.id} className="card">
            <h4>{s.tipo}</h4>
            <p><strong>Cliente:</strong> {s.cliente}</p>
            <p><strong>Cidade:</strong> {s.cidade}</p>
            <p><strong>Data:</strong> {new Date(s.data).toLocaleString("pt-BR")}</p>
            <button onClick={() => aceitarServico(s)}>Aceitar</button>
          </div>
        ))}
      </div>

      <h3><FaSpinner className="spin" /> Serviços a Executar</h3>
      <div className="servicos-lista">
        {aceitos.map((s) => (
          <div key={s.id} className="card">
            <h4>{s.tipo}</h4>
            <p><strong>Cliente:</strong> {s.cliente}</p>
            <p><strong>Data:</strong> {new Date(s.data).toLocaleString("pt-BR")}</p>
            <p><strong>Status:</strong> {s.status}</p>
            <button onClick={() => concluirServico(s)}>Serviço Executado</button>
          </div>
        ))}
      </div>

      <h3><FaCheckCircle color="green" /> Serviços Concluídos</h3>
      <div className="servicos-lista">
        {concluidos.map((s) => (
          <div key={s.id} className="card concluido">
            <h4>{s.tipo}</h4>
            <p><strong>Cliente:</strong> {s.cliente}</p>
            <p><strong>Data:</strong> {new Date(s.data).toLocaleString("pt-BR")}</p>
            <p><strong>Status:</strong> {s.status}</p>
          </div>
        ))}
      </div>

      <div className="grafico-progresso">
        <h4>Progresso Geral</h4>
        <div className="barra">
          <div className="preenchido" style={{ width: `${progresso}%` }}>
            {progresso}%
          </div>
        </div>
      </div>
      
      <DesempenhoGraficos />
      
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}
