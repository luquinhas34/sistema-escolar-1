import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";


export default function ChatPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("todas");
    const [chatId, setChatId] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState("");
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams(); // id da URL

    const categorias = [
        { label: "Todas", value: "todas" },
        { label: "Coordenação", value: "cood_vall" },
        { label: "Professores", value: "prof_vall" },
        { label: "Responsáveis", value: "resp_vall" },
    ];

    // Pega usuário logado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        axios.get("http://localhost:3000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setUserId(res.data.id))
            .catch(() => navigate("/login"));
    }, []);



    // Busca usuários com filtro
    useEffect(() => {
        axios.get("http://localhost:3000/api/chat/usuarios", {
            params: { tipo: filtro === "todas" ? "" : filtro },
        })
            .then(res => setUsuarios(res.data))
            .catch(err => console.error("Erro ao buscar usuários", err));
    }, [filtro]);

    // Atualiza mensagens
    useEffect(() => {
        const chatAtivo = chatId || id;

        if (!chatAtivo || !userId) return;

        const buscarMensagens = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/chat/mensagens/${chatAtivo}`);
                setMensagens(res.data);
            } catch (err) {
                console.error("Erro ao buscar mensagens", err);
            }
        };

        buscarMensagens();
        const interval = setInterval(buscarMensagens, 3000);
        return () => clearInterval(interval);
    }, [id, chatId, userId]);

    // Iniciar novo chat
    const iniciarChat = async (user2Id) => {
        if (!userId || !user2Id) return;

        try {
            const res = await axios.post("http://localhost:3000/api/chat/conectar", {
                user1: userId,
                user2: user2Id,
            });

            const novoChatId = res.data.chatId;
            setChatId(novoChatId);
            navigate(`/prof/chat/${novoChatId}`); // ← aqui estava errado!

        } catch (err) {
            console.error("Erro ao iniciar chat", err);
        }
    };



    const enviarMensagem = async () => {
        const chatAtivo = id || chatId;
        if (!novaMensagem.trim() || !chatAtivo || !userId) return;

        try {
            await axios.post("http://localhost:3000/api/chat/mensagens", {
                chatId: chatAtivo,
                remetenteId: userId,
                texto: novaMensagem,
            });
            setNovaMensagem("");
        } catch (err) {
            console.error("Erro ao enviar mensagem", err);
        }
    };

    const getIniciais = (nome) => {
        const partes = nome.trim().split(" ");
        return partes.length === 1
            ? partes[0][0]
            : partes[0][0] + partes[partes.length - 1][0];
    };

    const chatAtivo = id || chatId;

    return (
        <div style={{ padding: "40px", position: "relative" }}>
            <div style={{
                maxWidth: "700px",
                margin: "0 auto",
                background: "#fff",
                border: "2px solid #a463f5",
                borderRadius: "8px",
                padding: "20px"
            }}>
                {/* Filtro e lista */}
                {!chatAtivo && (
                    <>
                        <div style={{ display: "flex", marginBottom: "20px" }}>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setFiltro(cat.value)}
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

                        {usuarios.filter(u => u.id !== userId).map((u) => (
                            <div
                                key={u.id}
                                onClick={() => iniciarChat(u.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                    paddingBottom: "10px",
                                }}
                            >
                                <div style={{
                                    background: "#a463f5",
                                    color: "#fff",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    marginRight: "10px",
                                }}>
                                    {getIniciais(u.name)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <strong>{u.name}</strong>
                                    <div style={{ fontSize: "14px", color: "#777" }}>
                                        Clique para conversar
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Chat ativo */}
                {chatAtivo && userId && (
                    <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px 0" }}>
                        {mensagens.map((m, idx) => (
                            <div key={idx} style={{
                                textAlign: m.remetente.id === userId ? "right" : "left",
                                marginBottom: "10px"
                            }}>
                                <div style={{
                                    display: "inline-block",
                                    background: m.remetente.id === userId ? "#a463f5" : "#eee",
                                    color: m.remetente.id === userId ? "#fff" : "#000",
                                    padding: "8px 12px",
                                    borderRadius: "15px",
                                    maxWidth: "70%",
                                }}>
                                    {m.texto}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input de mensagem */}
            {chatAtivo && userId && (
                <div style={{ position: "fixed", bottom: "40px", right: "40px" }}>
                    <input
                        type="text"
                        placeholder="Digite uma mensagem"
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                        style={{
                            padding: "10px",
                            width: "300px",
                            borderRadius: "30px",
                            border: "1px solid #ccc",
                            marginRight: "10px",
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={enviarMensagem}
                        style={{
                            background: "#a463f5",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            cursor: "pointer",
                            fontSize: "20px",
                        }}
                    >
                        📨
                    </button>
                </div>
            )}
        </div>
    );
}
