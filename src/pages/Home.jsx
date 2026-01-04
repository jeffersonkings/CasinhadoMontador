import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/image/fundo-casinha-do-montador.jpg";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { FaClipboardList, FaCog, FaBell } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const primeiroNome = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0];

  const [notificacoes, setNotificacoes] = useState([]);
  const [pendentes, setPendentes] = useState(0);
  const [agenda, setAgenda] = useState([]);

  useEffect(() => {
    if (!user) return;

    // 🔔 Notificações
    const qNotificacoes = query(collection(db, "notificacoes"), where("destinatario", "==", user.email));
    const unsubNotificacoes = onSnapshot(qNotificacoes, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotificacoes(lista);
    });

    // 📋 Solicitações pendentes
    const qPendentes = query(
      collection(db, "solicitacoes"),
      where("cliente", "==", user.email),
      where("status", "==", "Aguardando")
    );
    const unsubPendentes = onSnapshot(qPendentes, (snapshot) => {
      setPendentes(snapshot.docs.length);
    });

    // 📅 Agenda de serviços confirmados
    const hoje = new Date();
    const qAgenda = query(
      collection(db, "solicitacoes"),
      where("cliente", "==", user.email),
      where("status", "==", "Em andamento")
    );
    const unsubAgenda = onSnapshot(qAgenda, (snapshot) => {
      const futuros = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => s.data?.toDate?.() >= hoje);
      setAgenda(futuros);
    });

    return () => {
      unsubNotificacoes();
      unsubPendentes();
      unsubAgenda();
    };
  }, [user]);

  const handlePainel = () => {
    navigate(`/${role}`);
  };

  return (
    <div className="home-container">
      <div className="logo-area">
        <img src={Logo} alt="Logo da Casinha do Montador" className="logo-img" />
        <h1>Casinha do Montador</h1>
      </div>

      <div className="home-box">
        <h2>Bem-vindo(a), {primeiroNome}!</h2>
        <p>Você está acessando o painel
          <strong>
           { 
            role === "admin" ? "Administrador" :
            role === "profissional" ? "Profissional" : "Pessoal"
           }
          </strong>.
        </p>
        <p>Aqui você pode acompanhar suas solicitações, configurar seu perfil e explorar os serviços disponíveis.</p>

        <button onClick={handlePainel}>Ir para o painel</button>

        <div className="card-area">
          <div className="card" onClick={() => navigate("/historico")}>
            <FaClipboardList size={24} color="#ff9800" />
            <h4>Solicitações</h4>
            <p>Visualize e gerencie suas solicitações.</p>
          </div>

          <div className="card" onClick={() => navigate("/perfil")}>
            <FaCog size={24} color="#2196f3" />
            <h4>Configurar perfil</h4>
            <p>Atualize suas informações pessoais.</p>
          </div>

          <div className="card">
            <FaBell size={24} color="#9c27b0" />
            <h4>Notificações</h4>
            <p>{notificacoes.length} nova(s)</p>
          </div>
        </div>

        <div className="info-area">
          <div className="info-box">
            <h4>🔔 Notificações</h4>
            {notificacoes.length === 0 ? (
              <p>Nenhuma nova notificação.</p>
            ) : (
              notificacoes.map(n => <p key={n.id}>{n.mensagem}</p>)
            )}
          </div>

          <div className="info-box">
            <h4>📋 Solicitações pendentes</h4>
            <p>{pendentes} em aberto</p>
          </div>

          <div className="info-box">
            <h4>📅 Agenda de serviços</h4>
            {agenda.length === 0 ? (
              <p>Sem serviços agendados.</p>
            ) : (
              agenda.map(a => (
                <p key={a.id}>
                  {a.tipo} em {a.data?.toDate ? a.data.toDate().toLocaleDateString("pt-BR") : "Data inválida"}

                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
