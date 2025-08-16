import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../atividades/style.css";


function DiretActive() {
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
  const [atividades, setAtividades] = useState([]);
  const [atividadesParaEditar, setAtividadesParaEditar] = useState(null);
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

      const response = await api.post("/api/atividades", data, {
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
      buscarAtividades();
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
  const buscarAtividades = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/atividades", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      console.log('Resposta do servidor:', error.response?.data);
    }
  };

  const handleEditaratividades = (atividade) => {
    // Formatando as datas para o formato esperado pelo input datetime-local
    const dataInicio = atividade.dataInicio ? new Date(atividade.dataInicio).toISOString().slice(0, 16) : "";
    const dataFim = atividade.dataFim ? new Date(atividade.dataFim).toISOString().slice(0, 16) : "";

    // Procurar a turma pelo nome que está em atividade.turmaIdt
    const turmaSelecionada = turmas.find(t => t.nome === atividade.turmaIdt);
    const turmaIdtNumerico = turmaSelecionada ? turmaSelecionada.id : "";

    setFormData({
      ...atividade,
      turmaIdt: turmaIdtNumerico,
      dataInicio,
      dataFim,
      documento: null,
    });
    setSelectedTurma(turmaIdtNumerico);
    setMostrarFormulario(true);
  };


  const handleRemoveratividades = (id) => {
    setIdParaExcluir(id);
    setMostrarModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/atividades/${idParaExcluir}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMensagem("Avaliação excluída com sucesso!");
      setErro("");
      buscarAtividades();
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
    buscarAtividades();
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
    <div className="centro">
      <div className="sidebar">
        <a href="/diret/dash" ><i className="fas fa-home"></i> INICIO</a>
        <a href="#" className="active"><i className="fas fa-tasks"></i> ATIVIDADES</a>
        <a href="/diret/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
        <a href="/diret/avisos"><i className="fas fa-bell"></i> AVISOS</a>
        <a href="/diret/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/diret/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
        <a href="/diret/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
        <a href="/diret/professor"><i className="fa-solid fa-person-chalkboard" ></i>PROFESSOR</a>
        <a href="/diret/aluno" ><i className="fa-circle-user" ></i>ALUNOS</a>
        <a href="/diret/turmas"><i className="fa-circle-user"></i> TURMAS</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>
      <div className="content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong>Carlos Pereira</strong>
          </div>
          <div className="icons">
            <a href="/diret/chat" className="active"><i className="fas fa-envelope"></i></a>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="add-button"
            onClick={() => {
              if (mostrarFormulario && atividadesParaEditar) {
                setAtividadesParaEditar(null);
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
            {atividadesParaEditar ? "Cancelar Edição" : mostrarFormulario ? "Cancelar" : "Adicionar Avaliação"}
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

            <button type="submit">{atividadesParaEditar ? "Editar Avaliação" : "Criar Avaliação"}</button>
          </form>
        )}

        {erro && <div className="error">{erro}</div>}
        {mensagem && <div className="success">{mensagem}</div>}

        <div className="atividade-list">
          {atividades.map((atividade) => (
            <div key={atividade.id} className="atividade-item">
              <h3>{atividade.titulo}</h3>
              <p>{atividade.descricao}</p>
              <p>Turma ID: {atividade.turmaIdt}</p>
              <p>Data Início: {new Date(atividade.dataInicio).toLocaleString()}</p>
              <p>Data Fim: {new Date(atividade.dataFim).toLocaleString()}</p>
              <button onClick={() => handleEditaratividades(atividade)}>Editar</button>
              <button onClick={() => handleRemoveratividades(atividade.id)}>Excluir</button>
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

export default DiretActive;