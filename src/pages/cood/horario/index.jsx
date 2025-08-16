import { useState, useEffect } from "react";
import axios from "axios";
import "../horario/style.css";

export default function Horario() {
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const turnos = [
    { value: "manha", label: "Manhã" },
    { value: "tarde", label: "Tarde" },
    { value: "noite", label: "Noite" },
    { value: "integral", label: "Integral" },
  ];
  const turmaId = 1;

  const [diaSelecionado, setDiaSelecionado] = useState("Seg");
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tituloHorario, setTituloHorario] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [diaModal, setDiaModal] = useState("Seg"); // inicializa com 'Seg' para não ficar vazio
  const [turnoModal, setTurnoModal] = useState("manha"); // inicializa com 'manha' para não ficar vazio
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  useEffect(() => {
    async function carregarHorarios() {
      try {
        const res = await axios.get(`http://localhost:3000/api/horarios/${turmaId}`);
        setHorarios(res.data);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
      }
    }
    carregarHorarios();
  }, [turmaId]);

  function limparFormulario() {
    setTituloHorario("");
    setHoraInicio("");
    setHoraFim("");
    setDiaModal(diaSelecionado); // já com o dia selecionado para facilitar
    setTurnoModal(turnoSelecionado || "manha"); // turno selecionado ou padrão manhã
    setHorarioSelecionado(null);
  }

  async function handleSalvarHorario() {
    if (!diaModal || !turnoModal || !tituloHorario || !horaInicio || !horaFim) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novoHorario = {
      dia: diaModal,
      turno: turnoModal,
      atividade: tituloHorario,
      horaInicio,
      horaFim,
      turmaId,
    };

    try {
      if (modoEdicao && horarioSelecionado) {
        await axios.put(`http://localhost:3000/api/horarios/${horarioSelecionado.id}`, novoHorario);
      } else {
        await axios.post("http://localhost:3000/api/horarios", novoHorario);
      }
      const res = await axios.get(`http://localhost:3000/api/horarios/${turmaId}`);
      setHorarios(res.data);
      limparFormulario();
      setShowModal(false);
      setModoEdicao(false);
    } catch (err) {
      console.error("Erro ao salvar horário:", err);
      alert("Erro ao salvar horário. Veja o console.");
    }
  }

  async function handleAdicionarOutro() {
    if (!diaModal || !turnoModal || !tituloHorario || !horaInicio || !horaFim) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novoHorario = {
      dia: diaModal,
      turno: turnoModal,
      atividade: tituloHorario,
      horaInicio,
      horaFim,
      turmaId,
    };

    try {
      await axios.post("http://localhost:3000/api/horarios", novoHorario);
      const res = await axios.get(`http://localhost:3000/api/horarios/${turmaId}`);
      setHorarios(res.data);
      limparFormulario();
    } catch (err) {
      console.error("Erro ao adicionar horário:", err);
      alert("Erro ao adicionar horário. Veja o console.");
    }
  }

  async function handleExcluir(id) {
    if (!window.confirm("Deseja realmente excluir este horário?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/horarios/${id}`);
      setHorarios((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Erro ao excluir horário:", err);
      alert("Erro ao excluir horário. Veja o console.");
    }
  }

  // Filtra horários para exibir na tabela, só se tiver turnoSelecionado
  const horariosFiltrados = turnoSelecionado
    ? horarios.filter((h) => h.dia === diaSelecionado && h.turno === turnoSelecionado)
    : [];

  return (
    <div className="centro">
      <div className="sidebar">
        <a href="/cood/dash"><i className="fas fa-home"></i> INICIO</a>
        <a href="/cood/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/cood/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="#" className="active"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/cood/notas"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
        <a href="/cood/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
        <a href="/cood/professor"><i className="fa-solid fa-person-chalkboard"></i>PROFESSOR</a>
        <a href="/cood/aluno"><i className="fa-circle-user"></i>ALUNOS</a>
        <a href="/cood/turmas"><i className="fa-circle-user"></i> TURMAS</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong>Carlos Pereira</strong>
          </div>
          <div className="icons">
            <a href="/cood/chat"><i className="fas fa-envelope"></i></a>
            <div className="user"><i className="fas fa-user-circle"></i></div>
          </div>
        </div>

        <div className="horario-section">
          <h2>Horários</h2>

          <div className="horario-top-bar">
            <select
              value={turnoSelecionado}
              onChange={(e) => setTurnoSelecionado(e.target.value)}
            >
              <option value="">Selecione o turno</option>
              {turnos.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <button
              className="btn-editar"
              disabled={!turnoSelecionado} // só habilita editar se um turno estiver selecionado
              onClick={() => {
                const primeiro = horarios.find(
                  (h) => h.dia === diaSelecionado && h.turno === turnoSelecionado
                );
                if (primeiro) {
                  setModoEdicao(true);
                  setTituloHorario(primeiro.atividade);
                  setHoraInicio(primeiro.horaInicio);
                  setHoraFim(primeiro.horaFim);
                  setDiaModal(primeiro.dia);
                  setTurnoModal(primeiro.turno);
                  setHorarioSelecionado(primeiro);
                  setShowModal(true);
                } else {
                  alert("Nenhum horário encontrado para editar neste dia e turno.");
                }
              }}
            >
              <i className="fas fa-pen"></i> Editar
            </button>

            <button
              className="btn-adicionar"
              onClick={() => {
                setModoEdicao(false);
                limparFormulario();
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus"></i> Adicionar horário
            </button>
          </div>

          <div className="dias-semana">
            {dias.map((dia) => (
              <button
                key={dia}
                className={`dia-btn ${diaSelecionado === dia ? "ativo" : ""}`}
                onClick={() => setDiaSelecionado(dia)}
              >
                {dia}
              </button>
            ))}
          </div>

          <div className="horario-tabela">
            {turnoSelecionado === "" && (
              <p className="info-msg">Selecione um turno para exibir os horários.</p>
            )}
            {horariosFiltrados.length === 0 && turnoSelecionado !== "" && (
              <p className="info-msg">Nenhum horário cadastrado para este dia e turno.</p>
            )}
            {horariosFiltrados.map((h) => (
              <div className="linha-horario" key={h.id}>
                <span>{h.atividade}</span>
                <span>
                  {h.horaInicio} até {h.horaFim}
                </span>
                <button
                  onClick={() => handleExcluir(h.id)}
                  className="btn-excluir"
                  title="Excluir horário"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modoEdicao ? "Editar Horário" : "Adicionar Horário"}</h3>

            <input
              type="text"
              placeholder="Título do Horário"
              value={tituloHorario}
              onChange={(e) => setTituloHorario(e.target.value)}
            />

            <label>Início:</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />

            <label>Término:</label>
            <input
              type="time"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
            />

            <label>Dia da Semana:</label>
            <select value={diaModal} onChange={(e) => setDiaModal(e.target.value)}>
              {dias.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>

            <label>Turno:</label>
            <select value={turnoModal} onChange={(e) => setTurnoModal(e.target.value)}>
              {turnos.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="botoes-modal">
              <button onClick={handleSalvarHorario}>
                {modoEdicao ? "Salvar Alterações" : "Salvar"}
              </button>
              {!modoEdicao && (
                <button onClick={handleAdicionarOutro}>Adicionar Outro</button>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
                  setModoEdicao(false);
                  limparFormulario();
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
