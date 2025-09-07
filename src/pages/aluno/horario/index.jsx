import { useState, useEffect } from "react";
import axios from "axios";
import "../horario/style.css";

// 🔹 Helper para pegar usuário do localStorage
function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Horario() {
  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const turnos = [
    { value: "manha", label: "Manhã" },
    { value: "tarde", label: "Tarde" },
    { value: "noite", label: "Noite" },
    { value: "integral", label: "Integral" },
  ];
  const turmaId = 1; // ✅ nome correto

  const [diaSelecionado, setDiaSelecionado] = useState("Segunda");
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tituloHorario, setTituloHorario] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [diaModal, setDiaModal] = useState("Segunda");
  const [turnoModal, setTurnoModal] = useState("manha");
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // 🔹 Pega usuário logado
  const user = getStoredUser();
  const nomeUsuario = user?.nome || user?.name || "Usuário";

  useEffect(() => {
    async function carregarHorarios() {
      try {
        const res = await axios.get(`http://localhost:3000/api/horarios/${turmaId}`);
        setHorarios(res.data);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
        setErro("Erro ao carregar horários.");
      }
    }
    carregarHorarios();
  }, [turmaId]);

  function limparFormulario() {
    setTituloHorario("");
    setHoraInicio("");
    setHoraFim("");
    setDiaModal(diaSelecionado);
    setTurnoModal(turnoSelecionado || "manha");
    setHorarioSelecionado(null);
  }

  async function handleSalvarHorario() {
    if (!diaModal || !turnoModal || !tituloHorario || !horaInicio || !horaFim) {
      setErro("Preencha todos os campos.");
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
        await axios.put(
          `http://localhost:3000/api/horarios/${horarioSelecionado.id}`,
          novoHorario
        );
        setMensagem("Horário editado com sucesso!");
      } else {
        await axios.post("http://localhost:3000/api/horarios", novoHorario);
        setMensagem("Horário adicionado com sucesso!");
      }
      const res = await axios.get(`http://localhost:3000/api/horarios/${turmaId}`);
      setHorarios(res.data);
      limparFormulario();
      setShowModal(false);
      setModoEdicao(false);
    } catch (err) {
      console.error("Erro ao salvar horário:", err);
      setErro("Erro ao salvar horário.");
    }
  }

  async function handleAdicionarOutro() {
    if (!diaModal || !turnoModal || !tituloHorario || !horaInicio || !horaFim) {
      setErro("Preencha todos os campos.");
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
      setMensagem("Horário adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar horário:", err);
      setErro("Erro ao adicionar horário.");
    }
  }

  async function handleExcluir(id) {
    if (!window.confirm("Deseja realmente excluir este horário?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/horarios/${id}`);
      setHorarios((prev) => prev.filter((h) => h.id !== id));
      setMensagem("Horário excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir horário:", err);
      setErro("Erro ao excluir horário.");
    }
  }

  const horariosFiltrados = turnoSelecionado
    ? horarios.filter((h) => h.dia === diaSelecionado && h.turno === turnoSelecionado)
    : [];

  const diaAtual = new Date().getDay(); // Domingo=0, Segunda=1, etc.
  const diaAtualNome = dias[diaAtual - 1] || "";

  return (
    <div className="centro">
      <div className="sidebar">
        <a href="/aluno/dash"><i className="fas fa-home"></i> INICIO</a>
        <a href="/aluno/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/aluno/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="#" className="active"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/aluno/notas"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong>{nomeUsuario}</strong>
          </div>
          <div className="icons">
            <a href="/cood/chat"><i className="fas fa-envelope"></i></a>
            <div className="user"><i className="fas fa-user-circle"></i></div>
          </div>
        </div>

        {/* --- Mensagens --- */}
        {mensagem && <div className="success-msg">{mensagem}</div>}
        {erro && <div className="error-msg">{erro}</div>}

        <div className="horario-section">
          <h2>Horários</h2>

          {/* --- Barra superior --- */}
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
              disabled={!turnoSelecionado}
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
                  setErro("Nenhum horário encontrado para editar neste dia e turno.");
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

          {/* --- Dias da semana --- */}
          <div className="dias-semana">
            {dias.map((dia) => (
              <button
                key={dia}
                className={`dia-btn ${diaSelecionado === dia ? "ativo" : ""} ${dia === diaAtualNome ? "hoje" : ""}`}
                onClick={() => setDiaSelecionado(dia)}
              >
                {dia}
              </button>
            ))}
          </div>

          {/* --- Tabela de horários --- */}
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

      {/* --- Modal --- */}
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
