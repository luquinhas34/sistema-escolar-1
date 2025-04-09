import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../atividades/index.css";
import axios from "axios";


function ProfAvaliacoes() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    turmaId: "",
    userId: "",
    documento: null,
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacoesParaEditar, setAvaliacoesParaEditar] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [user, setUser] = useState({ name: "Usuário" });
  const [turmas, setTurmas] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documento: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados a serem enviados:", formData);
    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!formData.titulo || !formData.descricao || !formData.dataInicio ||
      !formData.dataFim || !formData.turmaId || !formData.userId) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    const data = new FormData();

    // Adicionar cada campo ao FormData
    data.append("titulo", formData.titulo);
    data.append("descricao", formData.descricao);
    data.append("dataInicio", formData.dataInicio);
    data.append("dataFim", formData.dataFim);
    data.append("turmaId", formData.turmaId);
    data.append("userId", formData.userId);

    // Adicionar documento apenas se existir
    if (formData.documento) {
      data.append("documento", formData.documento);
    }

    try {
      const token = localStorage.getItem("token");

      // Usar a API configurada em vez de axios diretamente para manter consistência
      const response = await api.post("/api/avaliacoes", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMensagem(response.data.message || "Avaliação criada com sucesso!");
      setErro("");
      setFormData({
        titulo: "",
        descricao: "",
        dataInicio: "",
        dataFim: "",
        turmaId: "",
        userId: "",
        documento: null,
      });
      setSelectedTurma("");
      setMostrarFormulario(false);
      buscarAvaliacoes();
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      // Exibir mensagem mais detalhada do erro
      if (error.response && error.response.data && error.response.data.message) {
        setErro(`Erro: ${error.response.data.message}`);
      } else {
        setErro("Erro ao criar avaliação. Verifique se todos os campos estão preenchidos corretamente.");
      }
    }
  };

  // Renomeada para manter consistência
  const buscarAvaliacoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/avaliacoes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvaliacoes(response.data);
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      console.log('Resposta do servidor:', error.response?.data);
    }
  };

  const handleEditaravaliacoes = (avaliacao) => {
    setAvaliacoesParaEditar(avaliacao);
    // Formatando as datas para o formato esperado pelo input datetime-local
    const dataInicio = avaliacao.dataInicio ? new Date(avaliacao.dataInicio).toISOString().slice(0, 16) : "";
    const dataFim = avaliacao.dataFim ? new Date(avaliacao.dataFim).toISOString().slice(0, 16) : "";

    setFormData({
      ...avaliacao,
      dataInicio,
      dataFim,
      documento: null,
    });
    setSelectedTurma(avaliacao.turmaId);
    setMostrarFormulario(true);
  };

  const handleRemoveravaliacoes = (id) => {
    setIdParaExcluir(id);
    setMostrarModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/avaliacoes/${idParaExcluir}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMensagem("Avaliação excluída com sucesso!");
      setErro("");
      buscarAvaliacoes();
    } catch (error) {
      console.error("Erro ao excluir avaliações:", error);
      setErro("Erro ao excluir avaliações.");
    } finally {
      setMostrarModalExcluir(false);
      setIdParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setMostrarModalExcluir(false);
    setIdParaExcluir(null);
  };

  useEffect(() => {
    const buscarTurmas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/turmas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurmas(response.data);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      }
    };

    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userFromStorage) {
      setUser(userFromStorage);
      // Definir o ID do usuário no formulário automaticamente
      setFormData(prev => ({ ...prev, userId: userFromStorage.id }));
    }

    buscarTurmas();
    buscarAvaliacoes();
  }, []);

  useEffect(() => {
    if (mensagem || erro) {
      const timer = setTimeout(() => {
        setMensagem("");
        setErro("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [mensagem, erro]);

  const handleTurmaChange = (e) => {
    setSelectedTurma(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      turmaId: e.target.value,
    }));
  };

  return (
    <div className="container">
      <div className="sidebar">
        <a href="/prof/dash"><i className="fas fa-home"></i> INICIO</a>
        <a href="/prof/atividades" ><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="#" className="active"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
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
            onClick={() => {
              if (mostrarFormulario && avaliacoesParaEditar) {
                setAvaliacoesParaEditar(null);
              }
              setMostrarFormulario(!mostrarFormulario);
              if (mostrarFormulario) {
                // Resetar o formulário quando fechar
                setFormData({
                  titulo: "",
                  descricao: "",
                  dataInicio: "",
                  dataFim: "",
                  turmaId: "",
                  userId: user?.id || "",
                  documento: null,
                });
                setSelectedTurma("");
              }
            }}
          >
            {avaliacoesParaEditar ? "Cancelar Edição" : mostrarFormulario ? "Cancelar" : "Adicionar Avaliação"}
          </button>
        </div>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit}>
            <label>Título <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
            />

            <label>Descrição <span style={{ color: "red" }}>*</span></label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              required
            />
            <label>
              Selecionar Turma: <span style={{ color: "red" }}>*</span>
              <select
                value={selectedTurma}
                onChange={handleTurmaChange}
                required
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>Data Início <span style={{ color: "red" }}>*</span></label>
            <input
              type="datetime-local"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleInputChange}
              required
            />
            <label>Data Fim <span style={{ color: "red" }}>*</span></label>
            <input
              type="datetime-local"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleInputChange}
              required
            />
            <label>Documento</label>
            <input
              type="file"
              name="documento"
              onChange={handleFileChange}
            />
            <label>Seu ID <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              required
              readOnly={user?.id ? true : false}
            />

            <button type="submit">{avaliacoesParaEditar ? "Editar Avaliação" : "Criar Avaliação"}</button>
          </form>
        )}

        {erro && <div className="error">{erro}</div>}
        {mensagem && <div className="success">{mensagem}</div>}

        <div className="atividade-list">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="atividade-item">
              <h3>{avaliacao.titulo}</h3>
              <p>{avaliacao.descricao}</p>
              <p>Turma ID: {avaliacao.turmaId}</p>
              <p>Data Início: {new Date(avaliacao.dataInicio).toLocaleString()}</p>
              <p>Data Fim: {new Date(avaliacao.dataFim).toLocaleString()}</p>
              <button onClick={() => handleEditaravaliacoes(avaliacao)}>Editar</button>
              <button onClick={() => handleRemoveravaliacoes(avaliacao.id)}>Excluir</button>
            </div>
          ))}
        </div>
      </div>

      {mostrarModalExcluir && (
        <div className="modal">
          <div className="modal-content">
            <p>Tem certeza que deseja excluir essa avaliação?</p>
            <button onClick={confirmarExclusao}>Sim</button>
            <button onClick={cancelarExclusao}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfAvaliacoes;