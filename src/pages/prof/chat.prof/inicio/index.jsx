import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChatInicio() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        axios.get("http://localhost:3000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {

                setUserId(res.data.user.id); // <-- Correto agora!

                setLoading(false);
            })

            .catch(() => navigate("/login"));
    }, []);


    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("todas");
    const [userId, setUserId] = useState(null);
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
                console.log("Usuário autenticado:", res.data);
                setUserId(res.data.user.id);

            })

            .catch(() => navigate("/login"));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/api/chat/usuarios", {
            params: { tipo: filtro === "todas" ? "" : filtro },
        })
            .then(res => setUsuarios(res.data))
            .catch(err => console.error("Erro ao buscar usuários", err));
    }, [filtro]);

    const iniciarChat = async (user2Id) => {
        if (!userId || !user2Id) {
            console.warn("Usuário ainda não carregado.");
            return;
        }

        try {
            console.log("Iniciando chat com:", { user1: userId, user2: user2Id });

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

    return (
        <div style={{ padding: "40px" }}>
            <div style={{
                maxWidth: "700px", margin: "0 auto", background: "#fff",
                border: "2px solid #a463f5", borderRadius: "8px", padding: "20px"
            }}>
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

                {userId && usuarios.filter(u => u.id !== userId).map((u) => (
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
                ))}

                {!userId && (
                    <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
                        Carregando usuário...
                    </div>
                )}
            </div>
        </div>
    );
}
