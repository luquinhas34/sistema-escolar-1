import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "../atividades/style.css";

function AlunoAtividades() {
  const [atividades, setAtividades] = useState([]);
  const [user, setUser] = useState(null);
  const [turma, setTurma] = useState(null);
  const navigate = useNavigate();

  const buscarAtividades = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/atividades", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filtra só atividades da turma do aluno
      const atividadesFiltradas = turma
        ? response.data.filter((a) => a.turmaIdt === turma.idt)
        : [];

      setAtividades(atividadesFiltradas);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Buscar a turma do aluno
    const buscarTurmaAluno = async () => {
      try {
        const response = await api.get(`/api/turmas/aluno/${parsedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurma(response.data);
      } catch (error) {
        console.error("Erro ao buscar turma do aluno:", error);
      }
    };

    buscarTurmaAluno();
    buscarAtividades();
  }, [navigate]);

  return (
    <div className="centro">
      <div className="sidebar">
        <a href="/aluno/dash">
          <i className="fas fa-home"></i> INICIO
        </a>
        <a href="#" className="active">
          <i className="fas fa-tasks"></i> ATIVIDADES
        </a>
        <a href="/aluno/avaliacoes">
          <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
        </a>
        <a href="/aluno/avisos">
          <i className="fas fa-bell"></i> AVISOS
        </a>
        <a href="/aluno/horario">
          <i className="fa-solid fa-clock"></i> HORÁRIO
        </a>
        <a href="/aluno/notas">
          <i className="fa-solid fa-note-sticky"></i>NOTAS
        </a>
        <a href="/">
          <i className="fas fa-sign-out-alt"></i> SAIR
        </a>
      </div>

      <div className="content">
        <div className="header">
          <div className="welcome">
            Olá, <strong>{user ? user.nome || user.name : ""}</strong>
          </div>
          <div className="icons">
            <a href="/aluno/chat" className="active">
              <i className="fas fa-envelope"></i>
            </a>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        <h2>Atividades da Turma</h2>

        <div className="atividade-list">
          {atividades.length === 0 ? (
            <div className="sem-atividades">
              Nenhuma atividade disponível no momento.
            </div>
          ) : (
            atividades.map((atividade) => (
              <div key={atividade.id} className="atividade-item">
                <h3>{atividade.titulo}</h3>
                <p>{atividade.descricao}</p>
                <p>
                  Data Início:{" "}
                  {new Date(atividade.dataInicio).toLocaleString()}
                </p>
                <p>Data Fim: {new Date(atividade.dataFim).toLocaleString()}</p>

                {atividade.documento && (
                  <a
                    href={atividade.documento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    📂 Baixar Documento
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AlunoAtividades;
