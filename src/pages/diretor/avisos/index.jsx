import { useState, useEffect } from "react";
import axios from "axios";
import "../avisos/style.css";

function Profaviso() {
    const [avisos, setAvisos] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [user, setUser] = useState({ name: "Usuário" });

    const api = axios.create({
        baseURL: 'http://localhost:3000',
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        const fetchAvisos = async () => {
            try {
                const response = await api.get("/api/avisos");
                setAvisos(response.data);
                setLoading(false);
            } catch (error) {
                setErro("Erro ao buscar avisos.");
                setLoading(false);
            }
        };

        const userFromStorage = JSON.parse(localStorage.getItem("user"));
        if (userFromStorage) {
            setUser(userFromStorage);
        }

        fetchAvisos();
    }, []);

    const handleAddAviso = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para criar um aviso.");
            return;
        }

        if (!titulo || !descricao) {
            setErro("Preencha todos os campos.");
            return;
        }

        setErro("");
        setLoadingAdd(true);

        try {
            const response = await api.post("/api/avisos", { titulo, descricao }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvisos((prev) => [...prev, response.data]);
            setTitulo("");
            setDescricao("");
        } catch (error) {
            setErro("Erro ao criar o aviso.");
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDeleteAviso = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para excluir um aviso.");
            return;
        }

        setLoadingDelete(true);
        try {
            await api.delete(`/api/avisos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvisos((prev) => prev.filter((aviso) => aviso.id !== id));
        } catch (error) {
            setErro("Erro ao excluir o aviso.");
        } finally {
            setLoadingDelete(false);
        }
    };

    if (loading) return <div>Carregando avisos...</div>;

    return (
        <div className="centro">
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            />

            <div className="sidebar">
                <a href="/diret/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/diret/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/diret/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="#" className="active"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/diret/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/diret/notas"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="/diret/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/diret/professor"><i className="fa-solid fa-person-chalkboard"></i>PROFESSOR</a>
                <a href="/diret/aluno"><i className="fa-circle-user"></i>ALUNOS</a>
                <a href="/diret/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{user?.name || user?.nome || "Usuário"}</strong>
                    </div>
                    <div className="icons">
                        <a href="/diret/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                <div className="content-diretaviso">
                    <h2>Avisos</h2>
                    {erro && <div className="alert alert-danger">{erro}</div>}
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
