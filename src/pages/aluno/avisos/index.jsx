import axios from "axios";
import { useState, useEffect } from "react";
import "../avisos/avisos.css";

function AlunoAviso() {
    const [avisos, setAvisos] = useState([]);  // Estado de avisos como array
    const [loading, setLoading] = useState(true);  // Estado de carregamento
    const [setErro] = useState("");  // Estado de erro

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
            } catch {
                setErro("Erro ao buscar avisos.");
                setLoading(false); // Também deve finalizar o carregamento em caso de erro
            }
        };
        fetchAvisos();
    }, []);  // O array vazio garante que a requisição ocorra apenas uma vez, no carregamento inicial



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
                <a href="/resp/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/resp/atividades" ><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/resp/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/resp/diarios"><i className="fas fa-book"></i> DIÁRIOS</a>
                <a href="#" className="active"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
            <div className="main-content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>Carlos Pereira</strong>
                    </div>
                    <div className="icons">
                        <a href="/resp/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <h2>Avisos</h2>
                    <div className="avisos-list">
                        {avisos.length > 0 ? (
                            avisos.map((aviso) => (
                                <div key={aviso.id} className="aviso">
                                    <h3>Titulo:{aviso.titulo}</h3>
                                    <p>Descrição:{aviso.descricao}</p>
                                </div>
                            ))
                        ) : (
                            <p>Não há avisos para mostrar.</p>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
}

export default AlunoAviso;
