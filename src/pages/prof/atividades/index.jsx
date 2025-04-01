import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../atividades/index.css";

function ProfAtive() {
  const [loading, setLoading] = useState(true);
  const [atividades, setAtividades] = useState([]);
  const [novaAtividade, setNovaAtividade] = useState({
    titulo: "",
    descricao: "",
    turmaId: "", // Garantido que é 'turmaId'
    dataInicio: "",
    dataFim: "",
    documento: null,
    userId: "",
  });
  const [erro, setErro] = useState("");
  const [atividadeParaEditar, setAtividadeParaEditar] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [atividadeIdParaExcluir, setAtividadeIdParaExcluir] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Usuário não autenticado!");
      return;
    }

    async function fetchUserData() {
      try {
        const res = await api.get("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setNovaAtividade((prev) => ({
          ...prev,
          userId: res.data.id,
        }));
      } catch (error) {
        console.error("Erro ao buscar dados do usuário", error);
        setErro("Erro ao buscar dados do usuário.");
      }
    }

    async function fetchAtividades() {
      try {
        const res = await api.get("/api/atividades", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAtividades(res.data || []);
      } catch (error) {
        console.error("Erro ao buscar atividades", error);
        setAtividades([]);
        setErro("Erro ao buscar atividades.");
      }
    }

    fetchUserData();
    fetchAtividades();
  }, []);

  const handleInputChange = (e) => {
    setNovaAtividade((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setNovaAtividade({ ...novaAtividade, documento: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Verificação de campos obrigatórios
    if (!novaAtividade.titulo || !novaAtividade.descricao || !novaAtividade.turmaId || !novaAtividade.dataInicio || !novaAtividade.dataFim) {
      setErro("Preencha todos os campos.");
      return;
    }

    // Garantir que a turmaId seja um número
    const turmaId = Number(novaAtividade.turmaId);
    if (isNaN(turmaId)) {
      setErro("O campo 'Turma' deve ser um número válido.");
      return;
    }

    // Verificação de data
    const dataInicio = new Date(novaAtividade.dataInicio);
    const dataFim = new Date(novaAtividade.dataFim);
    if (dataInicio > dataFim) {
      setErro("A data de início deve ser anterior à data de fim.");
      return;
    }

    // Logar para depuração
    console.log("Enviando dados para a API: ", {
      titulo: novaAtividade.titulo,
      descricao: novaAtividade.descricao,
      turmaId: turmaId, // Aqui já passamos como número
      dataInicio: novaAtividade.dataInicio,
      dataFim: novaAtividade.dataFim,
      documento: novaAtividade.documento,
    });

    const formData = new FormData();
    formData.append("titulo", novaAtividade.titulo);
    formData.append("descricao", novaAtividade.descricao);
    formData.append("turmaId", turmaId); // Passando como número
    formData.append("dataInicio", novaAtividade.dataInicio);
    formData.append("dataFim", novaAtividade.dataFim);
    if (novaAtividade.documento) formData.append("documento", novaAtividade.documento);

    try {
      let res;
      if (atividadeParaEditar) {
        res = await api.patch(`/api/atividades/${atividadeParaEditar.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem("Atividade atualizada com sucesso!");
      } else {
        res = await api.post("/api/atividades", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem("Atividade criada com sucesso!");
      }

      setAtividades((prev) =>
        atividadeParaEditar
          ? prev.map((a) => (a.id === atividadeParaEditar.id ? res.data : a))
          : [...prev, res.data]
      );

      setNovaAtividade({
        titulo: "",
        descricao: "",
        turmaId: "",
        dataInicio: "",
        dataFim: "",
        documento: null,
        userId: user?.id || "",
      });
      setAtividadeParaEditar(null);
      setMostrarFormulario(false);
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao adicionar/editar atividade", error.response?.data || error);
      setErro(error.response?.data?.message || "Erro ao adicionar/editar atividade.");
      setTimeout(() => setErro(""), 3000);
    }
  };


  const handleRemoverAtividade = (id) => {
    setAtividadeIdParaExcluir(id);
    setMostrarModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    const token = localStorage.getItem("token");

    try {
      await api.delete(`/api/atividades/${atividadeIdParaExcluir}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAtividades((prev) => prev.filter((atividade) => atividade.id !== atividadeIdParaExcluir));
      setMensagem("Atividade removida com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
      setMostrarModalExcluir(false);
    } catch (error) {
      console.error("Erro ao remover atividade", error.response || error);
      setErro(error.response?.data?.message || "Erro ao remover atividade.");
      setTimeout(() => setErro(""), 3000);
      setMostrarModalExcluir(false);
    }
  };

  const cancelarExclusao = () => {
    setMostrarModalExcluir(false);
  };

  const handleEditarAtividade = (atividade) => {
    setAtividadeParaEditar(atividade);
    setNovaAtividade({
      titulo: atividade.titulo,
      descricao: atividade.descricao,
      turmaId: atividade.turmaId,
      dataInicio: atividade.dataInicio,
      dataFim: atividade.dataFim,
      documento: atividade.documento,
      userId: atividade.userId,
    });
    setMostrarFormulario(true);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <a href="/prof/dash"><i className="fas fa-home"></i> INICIO</a>
        <a href="#" className="active"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/prof/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/prof/diarios"><i className="fas fa-book"></i> DIÁRIOS</a>
        <a href="/prof/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong><h1>{user?.name || "Usuário"}</h1></strong>
          </div>
          <div className="icons">
            <i className="fas fa-envelope"></i>
            <div className="user"><i className="fas fa-user-circle"></i></div>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="add-button"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {atividadeParaEditar ? "Cancelar Edição" : "Adicionar Atividade"}
          </button>
        </div>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit}>
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              value={novaAtividade.titulo}
              onChange={handleInputChange}
            />
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={novaAtividade.descricao}
              onChange={handleInputChange}
            />
            <label>Turma ID</label>
            <input
              type="number"
              name="turmaId"
              value={novaAtividade.turmaId}
              onChange={handleInputChange}
            />

            <label>Data Início</label>
            <input
              type="datetime-local"
              name="dataInicio"
              value={novaAtividade.dataInicio}
              onChange={handleInputChange}
            />
            <label>Data Fim</label>
            <input
              type="datetime-local"
              name="dataFim"
              value={novaAtividade.dataFim}
              onChange={handleInputChange}
            />
            <label>Documento</label>
            <input
              type="file"
              name="documento"
              onChange={handleFileChange}
            />
            <button type="submit">{atividadeParaEditar ? "Editar Atividade" : "Criar Atividade"}</button>
          </form>
        )}

        {erro && <div className="error">{erro}</div>}
        {mensagem && <div className="success">{mensagem}</div>}

        <div className="atividade-list">
          {atividades.map((atividade) => (
            <div key={atividade.id} className="atividade-item">
              <h3>{atividade.titulo}</h3>
              <p>{atividade.descricao}</p>
              <p>Turma ID: {atividade.turmaId}</p>
              <p>Data Início: {new Date(atividade.dataInicio).toLocaleString()}</p>
              <p>Data Fim: {new Date(atividade.dataFim).toLocaleString()}</p>
              <button onClick={() => handleEditarAtividade(atividade)}>Editar</button>
              <button onClick={() => handleRemoverAtividade(atividade.id)}>Excluir</button>
            </div>
          ))}
        </div>
      </div>

      {mostrarModalExcluir && (
        <div className="modal">
          <div className="modal-content">
            <p>Tem certeza que deseja excluir essa atividade?</p>
            <button onClick={confirmarExclusao}>Sim</button>
            <button onClick={cancelarExclusao}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfAtive;
