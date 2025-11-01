import { useState, useEffect } from "react";
// Usando 'api' para consistência com os outros componentes do aluno
import api from "../../../services/api";
import "../horario/style.css"; // Reutilizando o mesmo CSS

/**
 * Componente para Alunos visualizarem seu horário de aula.
 *
 * Esta versão assume que:
 * 1. O objeto 'user' no localStorage (aluno) contém 'turmaIdt'.
 * 2. A API GET /api/horarios/turma/:idt (que existe no seu backend)
 * retorna a lista de horários daquela turma.
 */
export default function AlunoHorario() {

  // Definições padrão de dias e horários (baseado no seu CoodHorario)
  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const horariosPadrao = [
    ["07:30", "08:20"],
    ["08:20", "09:10"],
    ["09:10", "10:00"],
    ["10:20", "11:10"], // Intervalo 10:00 - 10:20
    ["11:10", "12:00"],
    ["12:30", "13:20"], // Intervalo 12:00 - 12:30
    ["13:20", "14:10"],
    ["14:10", "15:00"],
    ["15:20", "16:10"], // Intervalo 15:00 - 15:20
  ];

  // Converte para um formato mais fácil de usar no map
  const timeSlots = horariosPadrao.map(([inicio, fim]) => ({ inicio, fim }));

  // States
  const [horarios, setHorarios] = useState([]); // Array com dados da API
  const [user, setUser] = useState({ name: "Aluno" });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Busca os horários da turma específica do aluno
  const buscarHorarios = async (turmaId) => {
    if (!turmaId) {
      setErro("Não foi possível identificar sua turma.");
      return;
    }

    setLoading(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");

      // Rota GET do seu backend que busca horários por ID de turma
      const response = await api.get(`/api/horarios/turma/${turmaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // A API retorna um array de objetos:
      // [{ dia: "Segunda", horaInicio: "07:30", materia: { nome: "Matemática" } }, ...]
      setHorarios(response.data);

    } catch (err) {
      console.error("Erro ao carregar horários:", err);
      setErro("Falha ao carregar o horário.");
    } finally {
      setLoading(false);
    }
  };

  // Efeito principal: Carrega dados do usuário e busca horários
  useEffect(() => {
    let minhaTurmaId = null;

    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userFromStorage) {
      setUser(userFromStorage);
      minhaTurmaId = userFromStorage.turmaIdt;
    }

    if (minhaTurmaId) {
      buscarHorarios(minhaTurmaId);
    } else {
      setErro("Erro: ID da sua turma não foi encontrado no seu usuário.");
      setLoading(false);
    }
  }, []); // Executa 1 vez na montagem

  /**
   * Helper para encontrar a matéria para um dia/horário específico
   * A API (include: { materia: true }) deve retornar o nome da matéria
   */
  const getMateria = (dia, horaInicio) => {
    const horarioEncontrado = horarios.find(
      (h) => h.dia === dia && h.horaInicio === horaInicio
    );

    // Se encontrou, e a matéria existe (não é intervalo)
    if (horarioEncontrado && horarioEncontrado.materia) {
      return horarioEncontrado.materia.nome;
    }

    // Se for um horário vago ou intervalo
    return "---";
  };


  return (
    <div className="centro">
      {/* Sidebar (Menu) do Aluno */}
      <div className="sidebar">
        <a href="/aluno/dash"><i className="fas fa-home"></i> INICIO</a>
        <a href="/aluno/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/aluno/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="#" className="active"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/aluno/notas"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
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
            <a href="/aluno/chat"><i className="fas fa-envelope"></i></a>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        <div className="horario-section">
          <h2>Meu Horário de Aulas</h2>

          {erro && <div className="error">{erro}</div>}
          {loading && <p>Carregando horário...</p>}

          {!loading && !erro && (
            // Reutiliza a classe 'horario-tabela' do seu CSS
            <div className="horario-tabela">
              {/* Renderiza como uma <table> HTML padrão */}
              <table>
                <thead>
                  <tr>
                    <th>Horário</th>
                    {dias.map((dia) => (
                      <th key={dia}>{dia}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.inicio}>
                      {/* Célula do Horário (ex: 07:30 - 08:20) */}
                      <td className="horario-hora">
                        {slot.inicio} - {slot.fim}
                      </td>

                      {/* Células das Matérias (Segunda a Sexta) */}
                      {dias.map((dia) => (
                        <td key={`${dia}-${slot.inicio}`}>
                          {getMateria(dia, slot.inicio)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}