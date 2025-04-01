import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Alterado a importação de Link
import api from "../../../services/api";
import "../avaliacoes/avaliacoes.css";

function ProfAvaliacoes() {
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    titulo: "",
    descricao: "",
    turma: "",
    dataInicio: "",
    dataFim: "",
    documento: null,
  });
  const [erro, setErro] = useState("");
  const [avaliacaoParaEditar, setAvaliacaoParaEditar] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [avaliacaoIdParaExcluir, setAvaliacaoIdParaExcluir] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Usuário não autenticado!");
      return;
    }

    const fetchData = async () => {
      try {
        const resUser = await api.get("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        const resAvaliacoes = await api.get("/api/avaliacoes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvaliacoes(resAvaliacoes.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
        setErro("Erro ao buscar dados.");
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Executa apenas uma vez, quando o componente for montado

  const handleInputChange = (e) => {
    setNovaAvaliacao((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      documento: e.target.name === "documento" ? e.target.files[0] : prev.documento,
    }));
  };

  const handleFileChange = (e) => {
    setNovaAvaliacao({ ...novaAvaliacao, documento: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!novaAvaliacao.titulo || !novaAvaliacao.descricao || !novaAvaliacao.turma || !novaAvaliacao.dataInicio || !novaAvaliacao.dataFim) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (new Date(novaAvaliacao.dataInicio) > new Date(novaAvaliacao.dataFim)) {
      setErro("A data de início deve ser anterior à data de fim.");
      return;
    }

    const formData = new FormData();
    Object.keys(novaAvaliacao).forEach((key) => {
      if (novaAvaliacao[key]) {
        formData.append(key, novaAvaliacao[key]);
      }
    });

    try {
      let res;
      if (avaliacaoParaEditar) {
        res = await api.patch(`/api/avaliacoes/${avaliacaoParaEditar.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMensagem("Avaliação atualizada com sucesso!");
      } else {
        res = await api.post("/api/avaliacoes", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMensagem("Avaliação criada com sucesso!");
      }

      setAvaliacoes((prev) =>
        avaliacaoParaEditar ? prev.map((a) => (a.id === avaliacaoParaEditar.id ? res.data : a)) : [...prev, res.data]
      );

      setNovaAvaliacao({ titulo: "", descricao: "", turma: "", dataInicio: "", dataFim: "", documento: null });
      setAvaliacaoParaEditar(null);
      setMostrarFormulario(false);
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao adicionar/editar avaliação", error.response || error);
      setErro(error.response?.data?.message || "Erro ao adicionar/editar avaliação.");
      setTimeout(() => setErro(""), 3000);
    }
  };

  const handleRemoverAvaliacao = (id) => {
    setAvaliacaoIdParaExcluir(id);
    setMostrarModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    const token = localStorage.getItem("token");

    try {
      await api.delete(`/api/avaliacoes/${avaliacaoIdParaExcluir}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAvaliacoes((prev) => prev.filter((avaliacao) => avaliacao.id !== avaliacaoIdParaExcluir));
      setMensagem("Avaliação removida com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
      setMostrarModalExcluir(false);
    } catch (error) {
      console.error("Erro ao remover avaliação", error.response || error);
      setErro(error.response?.data?.message || "Erro ao remover avaliação.");
      setTimeout(() => setErro(""), 3000);
      setMostrarModalExcluir(false);
    }
  };

  const cancelarExclusao = () => {
    setMostrarModalExcluir(false);
  };

  const handleEditavaliacao = (avaliacao) => {
    setAvaliacaoParaEditar(avaliacao);
    setNovaAvaliacao({
      titulo: avaliacao.titulo,
      descricao: avaliacao.descricao,
      turma: avaliacao.turma,
      dataInicio: avaliacao.dataInicio,
      dataFim: avaliacao.dataFim,
      documento: avaliacao.documento,
    });
    setMostrarFormulario(true);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/prof/dash" >
          <i className="fas fa-home"></i> INICIO
        </Link>
        <Link to="/prof/atividades">
          <i className="fas fa-tasks"></i> ATIVIDADES
        </Link>
        <Link to="/prof/avaliacoes" className="active">
          <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
        </Link>
        <Link to="/prof/diarios">
          <i className="fas fa-book"></i> DIÁRIOS
        </Link>
        <Link to="/prof/avisos">
          <i className="fas fa-bell"></i> AVISOS
        </Link>
        <Link to="/">
          <i className="fas fa-sign-out-alt"></i> SAIR
        </Link>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="welcome">
            Olá, Bem-vindo <strong><h1>{user?.name || "Usuário"}</h1></strong>
          </div>
          <div className="icons">
            <i className="fas fa-envelope"></i>
            <div className="user">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="add-button"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {avaliacaoParaEditar ? "Cancelar Edição" : "Adicionar Avaliação"}
          </button>
        </div>

        {mensagem && <div className="alert alert-success">{mensagem}</div>}
        {erro && <div className="alert alert-danger">{erro}</div>}

        {mostrarFormulario && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                className="form-control"
                value={novaAvaliacao.titulo}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                className="form-control"
                value={novaAvaliacao.descricao}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="turma">Turma</label>
              <input
                type="text"
                id="turma"
                name="turma"
                className="form-control"
                value={novaAvaliacao.turma}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dataInicio">Data de Início</label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                className="form-control"
                value={novaAvaliacao.dataInicio}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dataFim">Data de Fim</label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                className="form-control"
                value={novaAvaliacao.dataFim}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="documento">Documento</label>
              <input
                type="file"
                id="documento"
                name="documento"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {avaliacaoParaEditar ? "Atualizar Avaliação" : "Criar Avaliação"}
            </button>
          </form>
        )}

        <div className="avaliacao-list">
          {avaliacoes.map((avaliacao) => (
            <div className="avaliacao-item" key={avaliacao.id}>
              <h3>Avaliação: {avaliacao.titulo}</h3>
              <p>Turma: {avaliacao.turma}</p>
              <p>Descrição: {avaliacao.descricao}</p>
              <button onClick={() => handleEditavaliacao(avaliacao)}>Editar</button>
              <button onClick={() => handleRemoverAvaliacao(avaliacao.id)}>Remover</button>
            </div>
          ))}
        </div>

        {mostrarModalExcluir && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <h3>Tem certeza que deseja excluir esta avaliação?</h3>
                <button onClick={confirmarExclusao}>Excluir</button>
                <button onClick={cancelarExclusao}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfAvaliacoes;
