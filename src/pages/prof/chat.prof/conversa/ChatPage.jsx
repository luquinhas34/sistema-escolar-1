import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "../conversa/ChatPage.css";

const ChatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState("");
    const [chatInfo, setChatInfo] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [usuario, setUsuario] = useState({});

    // Carrega o usuário logado
    useEffect(() => {
        const userStorage = localStorage.getItem("usuario");
        if (!userStorage) return navigate("/login");
        setUsuario(JSON.parse(userStorage));
    }, [navigate]);

    // Busca mensagens do chat
    useEffect(() => {
        const buscarMensagens = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/chat/${id}`);
                setMensagens(data.mensagens);
                setChatInfo(data.chat);
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
            }
        };

        if (id) buscarMensagens();
    }, [id]);

    // Scroll automático ao final
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensagens]);

    // Envia nova mensagem
    const enviarMensagem = async () => {
        if (!novaMensagem.trim()) return;
        try {
            const nova = {
                texto: novaMensagem,
                chatId: parseInt(id),
                remetenteId: usuario.id, // Usa o ID real do usuário logado
            };
            const { data } = await axios.post("http://localhost:3000/api/chat/mensagens", nova);
            setMensagens((prev) => [...prev, data]);
            setNovaMensagem("");
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    // Seleciona emoji
    const handleEmojiClick = (emojiData) => {
        setNovaMensagem((prev) => prev + emojiData.emoji);
    };

    return (
        <div className="bodyy">
            <div className="chat-container">
                <div className="sidebar">
                    <a href="/prof/dash"><i className="fas fa-home"></i> INICIO</a>
                    <a href="/prof/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                    <a href="#"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                    <a href="/prof/diarios"><i className="fas fa-book"></i> DIÁRIOS</a>
                    <a href="/prof/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                    <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
                </div>

                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong><h1>{usuario?.name || "Usuário"}</h1></strong>
                    </div>
                    <div className="icons">
                        <i className="fas fa-envelope"></i>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                <div className="chat-header">
                    <div>
                        <p className="chat-subtitle">Conversa de</p>
                        <h1 className="chat-title">{chatInfo?.titulo || "Carregando..."}</h1>
                    </div>
                    <div className="chat-avatars">
                        <div className="avatar bg-orange">A</div>
                        <div className="avatar bg-purple">J.P</div>
                    </div>
                </div>

                <button onClick={() => navigate(-1)} className="chat-back-button">
                    ⬅ Voltar
                </button>

                <div className="chat-body">
                    <h1 className="chat-heading">Chat: {chatInfo?.titulo || "Carregando..."}</h1>

                    <div className="chat-messages" ref={scrollRef}>
                        {mensagens.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat-message ${msg.remetenteId === usuario.id ? "me" : "other"}`}
                            >
                                <span className="chat-author">{msg.remetente?.nome || "Usuário"}:</span>{" "}
                                {msg.texto}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-input-area">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    <input
                        type="text"
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="chat-input"
                    />
                    <button onClick={enviarMensagem} className="send-button">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
