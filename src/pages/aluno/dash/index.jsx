import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "../dash/style.css";

function Alunohome() {
  const [dados, setDados] = useState({
    atividades: 0,
    avaliacoes: 0,
    diarios: 0,
    avisos: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pega usuário do localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      navigate("/");
      return;
    }

    const fetchDados = async () => {
      try {
        const endpoints = [
          { key: "atividades", url: "/api/atividades" },
          { key: "avaliacoes", url: "/api/avaliacoes" },
          { key: "diarios", url: "/api/diarios" },
          { key: "avisos", url: "/api/avisos" },
        ];

        for (const { key, url } of endpoints) {
          const res = await api.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setDados((prev) => ({
            ...prev,
            [key]: key === "avisos" ? (Array.isArray(res.data) ? res.data : []) : res.data.length,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [navigate, user]);

  if (!user) return <div>Usuário não autenticado!</div>;
  if (loading) return <div>Carregando dados...</div>;

  return (
    <div className="centro">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />
      <div className="sidebar">
        <a href="#" className="active"><i className="fas fa-home"></i> INICIO</a>
        <a href="/aluno/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/aluno/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="/aluno/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/aluno/notas"><i className="fa-solid fa-note-sticky"></i> NOTAS</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong>{user.nome || user.name}</strong>
          </div>
          <div className="icons">
            <a href="/diret/chat" className="active"><i className="fas fa-envelope"></i></a>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        <div className="coodhome-info-cards">
          <div className="coodhome-info-card">
            <h3>Número de atividades cadastradas</h3>
            <p>{dados.atividades} <span>Total</span></p>
          </div>
          <div className="coodhome-info-card">
            <h3>Número de avaliações cadastradas</h3>
            <p>{dados.avaliacoes} <span>Total</span></p>
          </div>
          <div className="coodhome-info-card">
            <h3>Número de diários cadastrados</h3>
            <p>{dados.diarios} <span>Total</span></p>
          </div>
        </div>

        <div className="coodhome-section">
          <h2>Avisos</h2>
          <div className="coodhome-cards">
            {dados.avisos.length === 0 ? (
              <p>Não há avisos disponíveis.</p>
            ) : (
              dados.avisos.map((aviso, index) => (
                <div key={index} className="coodhome-card">
                  <h3>Titulo {aviso.titulo}</h3>
                  <p><strong>Descrição:</strong> {aviso.descricao}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alunohome;
