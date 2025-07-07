import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../avaliacoes/style.css";


function ProfAvaliacoes() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    turmaIdt: 0,   // ou null, mas zero para indicar "não selecionado"
    userId: 0,     // preenchido depois do useEffect
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


    // Verificações adicionais
    const turmaIdtNum = Number(formData.turmaIdt);
    const userIdNum = Number(formData.userId);

    if (
      !formData.titulo ||
      !formData.descricao ||
      !formData.dataInicio ||
      !formData.dataFim ||
      isNaN(turmaIdtNum) ||
      isNaN(userIdNum)
    ) {
      setErro("Todos os campos são obrigatórios e válidos.");
      return;
    }

    const data = new FormData();

    data.append("titulo", formData.titulo);
    data.append("descricao", formData.descricao);
    data.append("dataInicio", formData.dataInicio);
    data.append("dataFim", formData.dataFim);
    data.append("turmaIdt", turmaIdtNum);
    data.append("userId", userIdNum);

    if (formData.documento) {
      data.append("documento", formData.documento);
    }

    try {
      const token = localStorage.getItem("token");

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
        turmaIdt: "",
        userId: userIdNum,
        documento: null,
      });
      setSelectedTurma("");
      setMostrarFormulario(false);
      buscarAvaliacoes();
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      if (error.response?.data?.message) {
        setErro(`Erro: ${error.response.data.message}`);
      } else {
        setErro("Erro ao criar avaliação. Verifique os campos.");
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
    const dataInicio = avaliacao.dataInicio ? new Date(avaliacao.dataInicio).toISOString().slice(0, 16) : "";
    const dataFim = avaliacao.dataFim ? new Date(avaliacao.dataFim).toISOString().slice(0, 16) : "";

    setFormData({
      id: avaliacao.id,
      titulo: avaliacao.titulo,
      descricao: avaliacao.descricao,
      dataInicio,
      dataFim,
      turmaIdt: avaliacao.turmaIdt,
      userId: avaliacao.userId,
      documento: null,
    });
    setSelectedTurma(avaliacao.turmaIdt);
    setAvaliacoesParaEditar(avaliacao);
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
    const value = e.target.value;

    setSelectedTurma(value);

    // Aqui garantimos que apenas valores numéricos válidos sejam aplicados
    const turmaIdConvertido = value !== "" && !isNaN(Number(value)) ? Number(value) : "";

    setFormData((prev) => ({
      ...prev,
      turmaIdt: turmaIdConvertido,
    }));
  };





  return (
    <div className="container">
      <div className="sidebar">
        <a href="/cood/dash" ><i className="fas fa-home"></i> INICIO</a>
        <a href="/cood/atividades"  ><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/cood/avaliacoes" className="active" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/cood/diarios"><i className="fas fa-book"></i> DIÁRIOS</a>
        <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="/cood/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/cood/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
        <a href="/cood/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
        <a href="/cood/professor"><i className="fa-circle-user" ></i> AD PROFESSOR</a>
        <a href="/cood/aluno"><i className="fa-circle-user" ></i> AD ALUNOS</a>
        <a href="/cood/turmas"><i className="fa-circle-user"></i> TURMAS</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong><h1>{user?.name || "Usuário"}</h1></strong>
          </div>
          <div className="icons">
            <a href="/cood/chat" className="active"><i className="fas fa-envelope"></i></a>
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
                  turmaIdt: "",
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
                  <option key={turma.idt} value={turma.idt}>
                    {turma.nome} (ID {turma.idt})
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

            <button type="submit">
              {avaliacoesParaEditar ? "Editar Avaliação" : "Criar Avaliação"}
            </button>

          </form>
        )}

        {erro && <div className="error">{erro}</div>}
        {mensagem && <div className="success">{mensagem}</div>}

        <div className="atividade-list">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="atividade-item">
              <h3>{avaliacao.titulo}</h3>
              <p>{avaliacao.descricao}</p>
              <p>Turma ID: {avaliacao.turmaIdt}</p>
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