import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./Profhome.css";

function Profhome() {
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState({
    atividades: 0,
    avaliacoes: 0,
    diarios: 0,
    avisos: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchUserAndData() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Usuário não autenticado!");
      navigate("/");
      return;
    }

    try {
      console.log("Buscando dados do usuário...");
      const userRes = await api.get("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const endpoints = [
        { key: "atividades", url: "/api/atividades" },
        { key: "avaliacoes", url: "/api/avaliacoes" },
        { key: "diarios", url: "/api/diarios" },
        { key: "avisos", url: "/api/avisos" },
      ];

      for (const { key, url } of endpoints) {
        const res = await api.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setDados((prev) => ({
          ...prev,
          [key]: key === "avisos" ? (Array.isArray(res.data) ? res.data : []) : res.data.length,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error.message);
      navigate("/prof/dash");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserAndData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não autenticado!</div>;

  return (
    <div className="display-flex">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />
      <div className="sidebar">
        <Link to="#" className="active">
          <i className="fas fa-home"></i> INÍCIO
        </Link>
        <Link to="/prof/atividades">
          <i className="fas fa-tasks"></i> ATIVIDADES
        </Link>
        <Link to="/prof/avaliacoes">
          <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
        </Link>

        <Link to="/prof/diarios">
          <i className="fas fa-book"></i> DIÁRIOS
        </Link>
        <Link to="/prof/avisos">
          <i className="fas fa-bell"></i> AVISOS
        </Link>
        <Link to="/">
          <i className="fas fa-sign-out-alt"></i> SAIR
        </Link>
      </div>
      <div className="main-content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong><h1>{user?.name}</h1></strong>
          </div>
          <div className="icons">
            <i className="fas fa-envelope"></i>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>
        <div className="info-cards">
          <div className="info-card">
            <h3>Número de atividades cadastradas</h3>
            <p>{dados.atividades} <span>Total</span></p>
          </div>
          <div className="info-card">
            <h3>Número de avaliações cadastradas</h3>
            <p>{dados.avaliacoes} <span>Total</span></p>
          </div>
          <div className="info-card">
            <h3>Número de diários cadastrados</h3>
            <p>{dados.diarios} <span>Total</span></p>
          </div>
        </div>
        <div className="section">
          <h2>Avisos</h2>
          <div className="cards">
            {dados.avisos.length === 0 ? (
              <p>Não há avisos disponíveis.</p>
            ) : (
              dados.avisos.map((aviso, index) => (
                <div key={index} className="card">
                  <h3>{aviso.titulo}</h3>
                  <p><strong>Data:</strong> {aviso.data}</p>
                  <p><strong>Tipo:</strong> {aviso.tipo}</p>
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

export default Profhome;
