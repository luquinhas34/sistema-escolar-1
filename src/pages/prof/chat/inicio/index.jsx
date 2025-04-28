import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../inicio/inicio.css";

export default function ChatInicio() {
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("todas");
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const categorias = [
        { label: "Todas", value: "todas" },
        { label: "Coordenação", value: "cood_vall" },
        { label: "Professores", value: "prof_vall" },
        { label: "Responsáveis", value: "resp_vall" },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        axios.get("http://localhost:3000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                setUserId(res.data.user.id);
                setUser(res.data.user);
                setLoading(false);
            })
            .catch(() => navigate("/login"));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/api/chat/usuarios", {
            params: { tipo: filtro === "todas" ? "" : filtro },
        })
            .then(res => {
                console.log("Usuários carregados:", res.data); // Verifique os dados aqui
                setUsuarios(res.data);
            })
            .catch(err => console.error("Erro ao buscar usuários", err));
    }, [filtro]);

    const iniciarChat = async (user2Id) => {
        if (!userId || !user2Id) {
            console.warn("Usuário ainda não carregado.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/chat/conectar", {
                user1: userId,
                user2: user2Id,
            });

            const novoChatId = res.data.chatId;
            navigate(`/prof/chat/${novoChatId}`);
        } catch (err) {
            console.error("Erro ao iniciar chat", err);
        }
    };

    const getIniciais = (nome) => {
        const partes = nome.trim().split(" ");
        return partes.length === 1
            ? partes[0][0]
            : partes[0][0] + partes[partes.length - 1][0];
    };

    const filterChats = () => {
        // Verifica se 'usuarios' e 'userId' estão carregados corretamente
        if (!usuarios || !userId) return [];

        // Filtra por 'role' e exclui o usuário atual
        return usuarios.filter(u => u.id !== userId && (filtro === "todas" || u.role === filtro));
    };

    const handleFilterChange = (catValue) => {
        console.log("Filtro selecionado:", catValue);  // Verifique o filtro
        setFiltro(catValue);
    };

    return (
        <div className="chat-page">
            <div className="sidebarr">
                <a href="/prof/dash">
                    <i className="fas fa-home"></i> INICIO
                </a>
                <a href="/prof/atividades">
                    <i className="fas fa-tasks"></i> ATIVIDADES
                </a>
                <a href="/prof/avaliacoes">
                    <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
                </a>
                <a href="/prof/diarios">
                    <i className="fas fa-book"></i> DIÁRIOS
                </a>
                <a href="/prof/avisos">
                    <i className="fas fa-bell"></i> AVISOS
                </a>
                <a href="/">
                    <i className="fas fa-sign-out-alt"></i> SAIR
                </a>
            </div>

            <div className="main-content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong><h1>{user?.name || "Usuário"}</h1></strong>
                    </div>
                    <div className="icons">
                        <a href="/prof/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                <div style={{ padding: "40px" }}>
                    <div style={{
                        maxWidth: "700px", margin: "0 auto", background: "#fff",
                        border: "2px solid #a463f5", borderRadius: "8px", padding: "20px"
                    }}>
                        <div style={{ display: "flex", marginBottom: "20px" }}>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => handleFilterChange(cat.value)}
                                    style={{
                                        padding: "10px 15px",
                                        background: filtro === cat.value ? "#a463f5" : "#f5f5f5",
                                        color: filtro === cat.value ? "#fff" : "#555",
                                        borderRadius: "8px",
                                        border: "none",
                                        marginRight: "10px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
                                Carregando usuário...
                            </div>
                        ) : (
                            filterChats().length === 0 ? (
                                <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
                                    Nenhuma conversa encontrada.
                                </div>
                            ) : (
                                filterChats().map((u) => (
                                    <div
                                        key={u.id}
                                        onClick={() => iniciarChat(u.id)}
                                        style={{
                                            display: "flex", alignItems: "center", marginBottom: "15px",
                                            cursor: "pointer", borderBottom: "1px solid #eee", paddingBottom: "10px",
                                        }}
                                    >
                                        <div style={{
                                            background: "#a463f5", color: "#fff", width: "40px", height: "40px",
                                            borderRadius: "50%", display: "flex", alignItems: "center",
                                            justifyContent: "center", fontWeight: "bold", marginRight: "10px",
                                        }}>
                                            {getIniciais(u.name)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <strong>{u.name}</strong>
                                            <div style={{ fontSize: "14px", color: "#777" }}>Clique para conversar</div>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
