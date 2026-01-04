import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./Perfil.css";

export default function Perfil() {
  const { user, role } = useAuth();
  const [dados, setDados] = useState({});
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      if (user) {
        const refDoc = doc(db, "users", user.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          setDados(snap.data());
        }
      }
    };
    carregarDados();
  }, [user]);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const salvarAlteracoes = async () => {
    try {
      const refDoc = doc(db, "users", user.uid);
      await updateDoc(refDoc, dados);
      setMensagem("Dados atualizados com sucesso!");
      setEditando(false);
    } catch (err) {
      setMensagem("Erro ao atualizar: " + err.message);
    }
  };

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <div className="perfil-box">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Papel:</strong> {role}</p>

        {editando && (
          <div>
            <label>Link da Foto de Perfil:</label>
            <input
              type="text"
              name="fotoURL"
              value={dados.fotoURL || ""}
              onChange={handleChange}
            />
          </div>
        )}

        {dados.fotoURL && (
          <p>
            <img src={dados.fotoURL} alt="Foto de perfil" style={{ width: "100px", borderRadius: "50%" }} />
          </p>
        )}

        {role === "cliente" && (
          <div>
            <label>Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={dados.endereco || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>
        )}

        {role === "profissional" && (
          <>
            <div>
              <label>CPF:</label>
              <input
                type="text"
                name="cpf"
                value={dados.cpf || ""}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
            <div>
              <label>Documento (RG ou CNH):</label>
              <input
                type="text"
                name="documento"
                value={dados.documento || ""}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
            {editando && (
              <div>
                <label>Link do Documento (RG/CNH):</label>
                <input
                  type="text"
                  name="documentoURL"
                  value={dados.documentoURL || ""}
                  onChange={handleChange}
                />
              </div>
            )}
            {!editando && dados.documentoURL && (
              <p>
                <a href={dados.documentoURL} target="_blank" rel="noopener noreferrer">
                  Ver documento atual
                </a>
              </p>
            )}
          </>
        )}

        <div className="perfil-botoes">
          {!editando ? (
            <button onClick={() => setEditando(true)}>Editar</button>
          ) : (
            <>
              <button onClick={salvarAlteracoes}>Salvar</button>
              <button onClick={() => setEditando(false)}>Cancelar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
