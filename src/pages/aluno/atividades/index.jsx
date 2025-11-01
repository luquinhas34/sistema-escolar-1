import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../atividades/style.css"; // Reutilizando o mesmo CSS

/**
 * Componente para Alunos visualizarem suas atividades.
 *
 * CORRIGIDO: Agora busca 'user' no localStorage (com base na ÚLTIMA imagem).
 *
 * ATENÇÃO: Isto só funcionará se a sua API de LOGIN
 * salvar o ID da turma do aluno (ex: "turmaIdt")
 * dentro do objeto 'user' no localStorage.
 */
function AlunoActive() {
  // States
  const [atividades, setAtividades] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [user, setUser] = useState({ name: "Aluno" });
  const [loading, setLoading] = useState(false);

  const buscarAtividadesDaMinhaTurma = async (turmaId) => {
    if (!turmaId) {
      setErro("Não foi possível identificar sua turma. Faça login novamente.");
      return;
    }

    setLoading(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/atividades?turmaId=${turmaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      setErro("Falha ao carregar as atividades. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Efeito 1: Executa 1 vez na montagem
  useEffect(() => {
    let minhaTurmaId = null;

    // ===================================================================
    // ▼▼▼ CORREÇÃO APLICADA AQUI (baseado na sua última foto) ▼▼▼
    //
    // Buscando 'user' ao invés de 'usuario'
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    // ===================================================================

    if (userFromStorage) {
      setUser(userFromStorage);

      // ===================================================================
      // ▼▼▼ O PROBLEMA ESTÁ AQUI ▼▼▼
      //
      // O seu objeto 'user' NÃO TEM o campo 'turmaIdt'.
      // Você precisa corrigir sua API DE LOGIN para incluir esse campo
      // quando o aluno fizer login.
      //
      // Se o nome do campo for outro (ex: 'turmaId'), ajuste aqui:
      minhaTurmaId = userFromStorage.turmaIdt;
      // ===================================================================
    }

    if (minhaTurmaId) {
      buscarAtividadesDaMinhaTurma(minhaTurmaId);
    } else {
      // Este erro continuará aparecendo até você corrigir sua API de LOGIN
      setErro("Erro: ID da sua turma não foi encontrado no seu usuário. (Sua API de login precisa enviar o 'turmaIdt').");
      setLoading(false);
    }

  }, []); // Array vazio = executa 1 vez na montagem

  // Efeito para limpar mensagens
  useEffect(() => {
    if (mensagem || erro) {
      const timer = setTimeout(() => {
        setMensagem("");
        setErro("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [mensagem, erro]);

  return (
    <div className="centro">
      {/* Sidebar (Menu) do Aluno */}
      <div className="sidebar">
        <a href="/aluno/dash" ><i className="fas fa-home"></i> INICIO</a>
        <a href="#" className="active"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/aluno/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="/aluno/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/aluno/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
        <a href="/aluno/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong>{user.name}</strong>
          </div>
          <div className="icons">
            <a href="/aluno/chat" className="active"><i className="fas fa-envelope"></i></a>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        {erro && <div className="error">{erro}</div>}
        {mensagem && <div className="success">{mensagem}</div>}

        {/* Lista de Atividades */}
        <div className="atividade-list">
          <h2>Minhas Atividades</h2>

          {loading ? (
            <p>Carregando atividades...</p>
          ) : atividades.length > 0 ? (
            atividades.map((atividade) => (
              <div key={atividade.id} className="atividade-item">
                <h3>{atividade.titulo}</h3>
                <p>{atividade.descricao}</p>
                <p>Turma: {atividade.turmaIdt}</p>
                <p>Data Início: {new Date(atividade.dataInicio).toLocaleString()}</p>
                <p>Data Fim: {new Date(atividade.dataFim).toLocaleString()}</p>

                {atividade.documentoUrl && (
                  <p>
                    <a
                      href={atividade.documentoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      <i className="fas fa-file-download"></i> Baixar Documento
                    </a>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>Nenhuma atividade encontrada para sua turma.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlunoActive;