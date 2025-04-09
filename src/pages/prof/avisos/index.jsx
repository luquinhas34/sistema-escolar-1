import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../avisos/avisos.css";

function Profaviso() {
    const [avisos, setAvisos] = useState([]);  // Estado de avisos como array
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(true);  // Estado de carregamento
    const [erro, setErro] = useState("");  // Estado de erro
    const [loadingAdd, setLoadingAdd] = useState(false);  // Carregamento para adicionar aviso
    const [loadingDelete, setLoadingDelete] = useState(false);  // Carregamento para excluir aviso

    const api = axios.create({
        baseURL: 'http://localhost:3000',  // Base URL do backend
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;

    });

    // Carregar os avisos da API ao carregar o componente
    useEffect(() => {
        const fetchAvisos = async () => {
            try {
                const response = await api.get("/api/avisos");
                setAvisos(response.data);  // Atualiza o estado com os avisos recebidos
                setLoading(false); // Indica que o carregamento foi concluído
            } catch (eror) {
                setErro("Erro ao buscar avisos.");
                setLoading(false); // Também deve finalizar o carregamento em caso de erro
            }
        };
        fetchAvisos();
    }, []);  // O array vazio garante que a requisição ocorra apenas uma vez, no carregamento inicial

    // Adicionar novo aviso
    const handleAddAviso = async () => {
        const token = localStorage.getItem("token");

        // Verificar se o token existe antes de realizar a requisição
        if (!token) {
            alert("Você precisa estar logado para criar um aviso.");
            return;
        }

        if (!titulo || !descricao) {
            setErro("Preencha todos os campos.");
            return;
        }

        setErro("");  // Limpa o erro anterior
        setLoadingAdd(true);  // Indica que está carregando enquanto adiciona

        try {
            const response = await api.post("/api/avisos", { titulo, descricao }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAvisos((prevAvisos) => [...prevAvisos, response.data]); // Atualiza a lista de avisos
            setTitulo("");  // Limpa os campos
            setDescricao("");
        } catch (error) {
            setErro("Erro ao criar o aviso.");
        } finally {
            setLoadingAdd(false);  // Finaliza o carregamento após a operação
        }
    };

    // Excluir um aviso
    const handleDeleteAviso = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Você precisa estar logado para excluir um aviso.");
            return;
        }

        setLoadingDelete(true);  // Indica que está carregando enquanto exclui

        try {
            await api.delete(`/api/avisos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAvisos((prevAvisos) => prevAvisos.filter((aviso) => aviso.id !== id));
        } catch (error) {
            setErro("Erro ao excluir o aviso.");
        } finally {
            setLoadingDelete(false);  // Finaliza o carregamento após a operação
        }
    };

    if (loading) {
        return <div>Carregando avisos...</div>; // Exibe um carregando enquanto espera pela resposta
    }

    return (
        <div className="display-flex">
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            />
            <div className="sidebar">
                <Link to="/prof/dash" >
                    <i className="fas fa-home"></i> INICIO
                </Link>
                <Link to="/prof/atividades">
                    <i className="fas fa-tasks"></i> ATIVIDADES
                </Link>
                <Link to="/prof/avaliacoes">
                    <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
                </Link>
                <Link to="/prof/diarios">
                    <i className="fas fa-book"></i> DIÁRIOS
                </Link>
                <Link to="/prof/avisos" className="active">
                    <i className="fas fa-bell"></i> AVISOS
                </Link>
                <Link to="/">
                    <i className="fas fa-sign-out-alt"></i> SAIR
                </Link>
            </div>
            <div className="main-content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>Carlos Pereira</strong>
                    </div>
                    <div className="icons">
                        <i className="fas fa-envelope"></i>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <h2>Avisos</h2>
                    {erro && <div className="alert alert-danger">{erro}</div>} {/* Exibe mensagem de erro */}
                    <div className="add-aviso">
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título do Aviso"
                        />
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descrição do Aviso"
                        />
                        <button onClick={handleAddAviso} disabled={loadingAdd}>
                            {loadingAdd ? "Adicionando..." : "Adicionar Aviso"}
                        </button>
                    </div>
                    <div className="avisos-list">
                        {avisos.length > 0 ? (
                            avisos.map((aviso) => (
                                <div key={aviso.id} className="aviso">
                                    <h3>{aviso.titulo}</h3>
                                    <p>{aviso.descricao}</p>
                                    <button
                                        onClick={() => handleDeleteAviso(aviso.id)}
                                        disabled={loadingDelete}
                                    >
                                        {loadingDelete ? "Excluindo..." : "Excluir"}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>Não há avisos para mostrar.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profaviso;
