import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "../avisos/style.css";

function AlunoAvisos() {
    const [avisos, setAvisos] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const buscarAvisos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/avisos", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvisos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar avisos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!token || !storedUser) {
            navigate("/");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        buscarAvisos();
    }, [navigate]);

    if (loading) return <div>Carregando avisos...</div>;

    return (
        <div className="centro">
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            />

            <div className="sidebar">
                <a href="/aluno/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/aluno/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/aluno/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="#" className="active"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/aluno/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/aluno/notas"><i className="fa-solid fa-note-sticky"></i> NOTAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{user?.name || user?.nome || "Usuário"}</strong>
                    </div>
                    <div className="icons">
                        <a href="/aluno/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                <div className="content-diretaviso">
                    <h2>Avisos Importantes</h2>

                    <div className="avisos-list">
                        {avisos.length === 0 ? (
                            <div className="sem-avisos">
                                Nenhum aviso disponível no momento.
                            </div>
                        ) : (
                            avisos.map((aviso) => (
                                <div key={aviso.id} className="aviso-aluno">
                                    <div className="aviso-header">
                                        <i className="fas fa-bell aviso-icon"></i>
                                        <h3>{aviso.titulo}</h3>
                                    </div>
                                    <p className="aviso-descricao">{aviso.descricao}</p>
                                    <p className="aviso-data">
                                        Publicado em: {new Date(aviso.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlunoAvisos;
