import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../notas/style.css";


function RespActive() {
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
  const [atividades, setAtividade] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
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
      const response = await api.post("/api/atividades", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMensagem(response.data.message || "Atividade criada com sucesso!");
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
      buscarAtividades();
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
      // Exibir mensagem mais detalhada do erro
      if (error.response && error.response.data && error.response.data.message) {
        setErro(`Erro: ${error.response.data.message}`);
      } else {
        setErro("Erro ao criar atividade. Verifique se todos os campos estão preenchidos corretamente.");
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
      setAtividade(response.data);
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      console.log('Resposta do servidor:', error.response?.data);
    }
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
    setSelectedTurma(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      turmaId: e.target.value,
    }));
  };

  return (
    <div className="container">
      <div className="sidebar">
        <a href="/resp/dash" ><i className="fas fa-home"></i> INICIO</a>
        <a href="/resp/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/resp/notas" className="active"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
        <a href="/resp/frequencia" ><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
        <a href="/resp/avisos" ><i className="fas fa-bell"></i> AVISOS</a>
        <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong><h1>{user?.name || "Usuário"}</h1></strong>
          </div>
          <div className="icons">
            <a href="/resp/chat" className="active"><i className="fas fa-envelope"></i></a>
            <div className="user"><i className="fas fa-user-circle"></i></div>
          </div>
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

            </div>
          ))}
        </div>
      </div>
    </div >
  );
}

export default RespActive;