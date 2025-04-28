import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../horario/style.css";


function Respavaliacoes() {
  const [setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    turmaId: "",
    userId: "",
    documento: null,
  });

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [user, setUser] = useState({ name: "Usuário" });
  const [setTurmas] = useState([]);





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



  return (
    <div className="container">
      <div className="sidebar">
        <a href="/resp/dash" ><i className="fas fa-home"></i> INICIO</a>
        <a href="#" className="active"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
        <a href="/resp/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
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

            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default Respavaliacoes;