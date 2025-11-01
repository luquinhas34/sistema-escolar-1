import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../avaliacoes/style.css"; // Reutilizando o CSS de avaliações

/**
 * Componente para Alunos visualizarem suas Avaliações.
 *
 * Esta versão assume que:
 * 1. O objeto 'user' no localStorage (logado como aluno)
 * contém o campo 'turmaIdt'.
 * 2. A API GET /api/avaliacoes?turmaId=[ID] retorna as avaliações
 * filtradas para a turma do aluno.
 */
function AlunoAvaliacoes() {
  // States
  const [avaliacoes, setAvaliacoes] = useState([]); // Lista de avaliações do aluno
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [user, setUser] = useState({ name: "Aluno" });
  const [loading, setLoading] = useState(false); // Para feedback ao usuário

  /**
   * Busca avaliações na API, filtrando pelo ID da turma
   * fornecido como argumento.
   */
  const buscarAvaliacoesDaMinhaTurma = async (turmaId) => {
    if (!turmaId) {
      setErro("Não foi possível identificar sua turma. Faça login novamente.");
      return;
    }

    setLoading(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");

      // Chama a API de avaliações com o filtro de turma
      // Ex: /api/avaliacoes?turmaId=11
      const response = await api.get(`/api/avaliacoes?turmaId=${turmaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAvaliacoes(response.data);

    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setErro("Falha ao carregar as avaliações. Tente novamente mais tarde.");
      console.log('Resposta do servidor:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Efeito 1: Executa 1 vez na montagem
  useEffect(() => {
    let minhaTurmaId = null;

    // 1. Busca dados do usuário logado (usando 'user' como chave)
    const userFromStorage = JSON.parse(localStorage.getItem("user"));

    if (userFromStorage) {
      setUser(userFromStorage);

      // 2. Extrai o ID da turma do objeto do usuário
      minhaTurmaId = userFromStorage.turmaIdt;
    }

    // 3. Busca as avaliações filtradas
    if (minhaTurmaId) {
      buscarAvaliacoesDaMinhaTurma(minhaTurmaId);
    } else {
      setErro("Erro: ID da sua turma não foi encontrado no seu usuário. (Verifique se a API de login está correta).");
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
        <a href="/aluno/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="#" className="active"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="/aluno/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/aluno/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
        <a href="/aluno/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="content">
        <div className="header">
          <div className="welcome">
            {/* Exibe o nome do usuário logado */}
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

        {/* Botão de adicionar, formulário e modal foram removidos */}

        {/* Lista de Avaliações */}
        <div className="atividade-list"> {/* Usando a mesma classe do professor */}
          <h2>Minhas Avaliações</h2>

          {loading ? (
            <p>Carregando avaliações...</p>
          ) : avaliacoes.length > 0 ? (
            avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="atividade-item">
                <h3>{avaliacao.titulo}</h3>
                <p>{avaliacao.descricao}</p>
                {/* Assumindo que a API retorna o NOME ou ID da turma */}
                <p>Turma: {avaliacao.turmaIdt}</p>
                <p>Data Início: {new Date(avaliacao.dataInicio).toLocaleString()}</p>
                <p>Data Fim: {new Date(avaliacao.dataFim).toLocaleString()}</p>

                {/* Adiciona link para o documento, se existir */}
                {avaliacao.documentoUrl && (
                  <p>
                    <a
                      href={avaliacao.documentoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      <i className="fas fa-file-download"></i> Baixar Documento
                    </a>
                  </p>
                )}

                {/* Botões de Editar e Excluir removidos */}
              </div>
            ))
          ) : (
            <p>Nenhuma avaliação encontrada para sua turma.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlunoAvaliacoes;