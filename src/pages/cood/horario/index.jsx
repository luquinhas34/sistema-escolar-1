import { useState, useEffect } from "react";
import axios from "axios";
import "../horario/style.css";

export default function AdicionarHorarios() {
  const turnos = [
    { value: "manha", label: "Manhã" },
    { value: "tarde", label: "Tarde" },
    { value: "noite", label: "Noite" },
    { value: "integral", label: "Integral" },
  ];

  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const [turmas, setTurmas] = useState([]);
  const [materias, setMaterias] = useState([]);

  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState("");

  const [aulas, setAulas] = useState([]);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loadingMaterias, setLoadingMaterias] = useState(true);

  // Carrega turmas e matérias do backend
  useEffect(() => {
    async function carregarDados() {
      try {
        const resTurmas = await axios.get("http://localhost:3000/api/turmas");
        console.log("Resposta turmas:", resTurmas.data);
        setTurmas(resTurmas.data || []);
        setLoadingTurmas(false);

        const resMaterias = await axios.get(
          "http://localhost:3000/api/materia/listar"
        );
        console.log("Resposta matérias:", resMaterias.data);
        setMaterias(resMaterias.data || []);
        setLoadingMaterias(false);
      } catch (err) {
        console.error("Erro ao carregar turmas ou matérias:", err);
        setLoadingTurmas(false);
        setLoadingMaterias(false);
      }
    }
    carregarDados();
  }, []);

  // Inicializa as 9 aulas quando turno, dia e turma são selecionados
  useEffect(() => {
    if (turnoSelecionado && diaSelecionado && turmaSelecionada && materias.length) {
      const horariosPadrao = [
        ["07:30", "08:20"],
        ["08:20", "09:10"],
        ["09:10", "10:00"],
        ["10:20", "11:10"],
        ["11:10", "12:00"],
        ["12:30", "13:20"],
        ["13:20", "14:10"],
        ["14:10", "15:00"],
        ["15:20", "16:10"],
      ];

      const aulasInicial = horariosPadrao.map(([inicio, fim], index) => ({
        id: index,
        horaInicio: inicio,
        horaFim: fim,
        materiaId: materias[0]?.id?.toString() || "",
      }));

      setAulas(aulasInicial);
    } else {
      setAulas([]);
    }
  }, [turnoSelecionado, diaSelecionado, turmaSelecionada, materias]);

  function handleMateriaChange(id, materiaId) {
    setAulas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, materiaId } : a))
    );
  }

  async function handleSalvarTodos() {
    if (!turnoSelecionado || !diaSelecionado || !turmaSelecionada) {
      alert("Selecione turno, dia e turma.");
      return;
    }

    const turmaIdNumber = Number(turmaSelecionada);
    if (isNaN(turmaIdNumber)) {
      alert("Turma inválida. Selecione uma turma válida.");
      return;
    }

    const payload = aulas
      .filter(
        (a) =>
          a.materiaId &&
          !isNaN(Number(a.materiaId)) &&
          turmaSelecionada &&
          !isNaN(Number(turmaSelecionada))
      )
      .map((a) => ({
        dia: diaSelecionado,
        turno: turnoSelecionado,
        horaInicio: a.horaInicio,
        horaFim: a.horaFim,
        turmaId: turmaIdNumber,
        materiaId: Number(a.materiaId),
      }));

    if (payload.length === 0) {
      alert("Selecione pelo menos uma aula com matéria válida.");
      return;
    }

    try {
      console.log("Payload enviado:", payload);

      await axios.post("http://localhost:3000/api/horario/multiplos", payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Horários adicionados com sucesso!");

      setTurnoSelecionado("");
      setDiaSelecionado("");
      setTurmaSelecionada("");
      setAulas([]);
    } catch (err) {
      console.error("Erro ao salvar horários:", err);
      alert("Erro ao salvar horários. Veja o console.");
    }
  }

  return (
    <div className="centro">
      <div className="sidebar">
        <a href="/cood/dash">
          <i className="fas fa-home"></i> INICIO
        </a>
        <a href="/cood/atividades">
          <i className="fas fa-tasks"></i> ATIVIDADES
        </a>
        <a href="/cood/avaliacoes">
          <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
        </a>
        <a href="/cood/avisos">
          <i className="fas fa-bell"></i> AVISOS
        </a>
        <a href="#" className="active">
          <i className="fa-solid fa-clock"></i> HORÁRIO
        </a>
        <a href="/cood/notas">
          <i className="fa-solid fa-note-sticky"></i> NOTAS
        </a>
        <a href="/cood/frequencia">
          <i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA
        </a>
        <a href="/cood/professor">
          <i className="fa-solid fa-person-chalkboard"></i> PROFESSOR
        </a>
        <a href="/cood/aluno">
          <i className="fa-circle-user"></i> ALUNOS
        </a>
        <a href="/cood/turmas">
          <i className="fa-circle-user"></i> TURMAS
        </a>
        <a href="/">
          <i className="fas fa-sign-out-alt"></i> SAIR
        </a>
      </div>

      <div className="content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong>Carlos Pereira</strong>
          </div>
          <div className="icons">
            <a href="/cood/chat">
              <i className="fas fa-envelope"></i>
            </a>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        <div className="horario-section">
          <h2>Adicionar Horários do Dia</h2>

          <div className="horario-top-bar">
            <select
              value={turnoSelecionado}
              onChange={(e) => setTurnoSelecionado(e.target.value)}
            >
              <option value="">Selecione o turno</option>
              {turnos.map((t) => (
                <option key={`turno-${t.value}`} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <select
              value={diaSelecionado}
              onChange={(e) => setDiaSelecionado(e.target.value)}
            >
              <option value="">Selecione o dia</option>
              {dias.map((d) => (
                <option key={`dia-${d}`} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
            >
              <option value="">
                {loadingTurmas ? "Carregando turmas..." : "Selecione a turma"}
              </option>
              {turmas.map((t) => (
                <option key={t.idt} value={t.idt.toString()}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          {aulas.length > 0 && (
            <div className="horario-tabela">
              {aulas.map((a) => (
                <div className="linha-horario" key={`linha-${a.id}`}>
                  <span className="horario-hora">
                    {a.horaInicio} - {a.horaFim}
                  </span>
                  <select
                    value={a.materiaId || ""}
                    onChange={(e) => handleMateriaChange(a.id, e.target.value)}
                    className="horario-materia"
                  >
                    <option value="">
                      {loadingMaterias
                        ? "Carregando matérias..."
                        : "Selecione a matéria"}
                    </option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.id.toString()}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                onClick={handleSalvarTodos}
                className="btn-adicionar"
                style={{ marginTop: "20px" }}
              >
                Salvar Todos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
