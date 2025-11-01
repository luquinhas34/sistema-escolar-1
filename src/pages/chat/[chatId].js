import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// --- (Mock do usuário logado) ---
// Em um app real, você pegaria isso de um Context, Redux, ou hook de autenticação.
// Precisamos saber o ID do usuário logado para alinhar os balões de chat.
const ID_USUARIO_LOGADO = 1; // MOCK: Finja ser o usuário 'aluno'
// --------------------------------

export default function ChatPage() {
  const [mensagens, setMensagens] = useState([]);
  const [novoTexto, setNovoTexto] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { chatId } = router.query; // Pega o ID da URL (ex: /chat/15)

  // Referência para rolar a tela para baixo
  const fimDoChatRef = useRef(null);

  // 1. EFEITO PARA CARREGAR O HISTÓRICO
  useEffect(() => {
    // Só roda se o 'chatId' já estiver disponível na URL
    if (chatId) {
      async function carregarHistorico() {
        setLoading(true);
        const response = await fetch(`/api/chat/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          setMensagens(data);
        } else {
          console.error("Falha ao carregar o chat");
        }
        setLoading(false);
      }
      carregarHistorico();
    }
  }, [chatId]); // Roda sempre que o chatId mudar

  // 2. EFEITO PARA ROLAR PARA O FIM
  useEffect(() => {
    // Sempre que 'mensagens' mudar, rolar para o balão mais recente
    fimDoChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // 3. FUNÇÃO PARA ENVIAR NOVA MENSAGEM
  const handleEnviar = async (e) => {
    e.preventDefault();
    if (novoTexto.trim() === "") return;

    // Precisamos descobrir o ID do *outro* usuário
    const primeiraMensagem = mensagens[0];
    if (!primeiraMensagem) return; // Não pode enviar se o chat estiver vazio? (decisão de negócio)

    const outroUsuario =
      primeiraMensagem.remetenteId === ID_USUARIO_LOGADO
        ? mensagens.find((m) => m.remetenteId !== ID_USUARIO_LOGADO)
            ?.remetenteId // Tenta achar outro
        : primeiraMensagem.remetenteId; // O destinatário é o remetente da primeira msg

    // Se o chat for novo (sem mensagens), precisamos de outra forma
    // (A tela anterior devia ter passado o ID do destinatário)
    // Vamos assumir que o chat já tem mensagens para este exemplo.

    const response = await fetch("/api/chat/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinatarioId: outroUsuario, // Aqui está o pulo do gato
        texto: novoTexto,
      }),
    });

    if (response.ok) {
      const mensagemCriada = await response.json();
      // Atualização em tempo real (simples):
      // Adiciona a nova mensagem à lista de mensagens na tela
      setMensagens((msgsAntigas) => [...msgsAntigas, mensagemCriada]);
      setNovoTexto(""); // Limpa a caixa de texto
    } else {
      alert("Erro ao enviar mensagem");
    }
  };

  if (loading) return <p>Carregando chat...</p>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        {/* Você pode carregar o nome do outro usuário aqui */}
        <h3>Conversa</h3>
      </div>

      <div className="chat-messages">
        {mensagens.map((msg) => {
          // É uma mensagem SUA?
          const eMinha = msg.remetenteId === ID_USUARIO_LOGADO;
          return (
            <div
              key={msg.id}
              className={`message-bubble-container ${
                eMinha ? "minha" : "deles"
              }`}
            >
              {!eMinha && (
                <span className="remetente-nome">{msg.remetente.name}</span>
              )}
              <div className="message-bubble">
                <p>{msg.texto}</p>
              </div>
              <span className="message-time">
                {new Date(msg.data).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        {/* Div invisível para forçar a rolagem */}
        <div ref={fimDoChatRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleEnviar}>
        <input
          type="text"
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button type="submit">Enviar</button>
      </form>

      {/* --- CSS Básico --- */}
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 80vh;
          max-width: 600px;
          margin: auto;
          border: 1px solid #ccc;
        }
        .chat-header {
          padding: 10px;
          background: #f5f5f5;
          border-bottom: 1px solid #ccc;
          text-align: center;
        }
        .chat-messages {
          flex-grow: 1;
          padding: 10px;
          overflow-y: auto;
          background: #fafafa;
        }

        .message-bubble-container {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }
        .remetente-nome {
          font-size: 12px;
          color: #555;
          margin-bottom: 2px;
        }
        .message-bubble {
          padding: 10px 15px;
          border-radius: 18px;
          max-width: 70%;
        }
        .message-time {
          font-size: 10px;
          color: #999;
          margin-top: 3px;
        }

        /* MENSAGEM DELES (Esquerda) */
        .message-bubble-container.deles {
          align-items: flex-start;
        }
        .message-bubble-container.deles .message-bubble {
          background: #eee;
          color: #333;
        }
        .message-bubble-container.deles .message-time {
          align-self: flex-start;
        }

        /* MINHA MENSAGEM (Direita) */
        .message-bubble-container.minha {
          align-items: flex-end;
        }
        .message-bubble-container.minha .message-bubble {
          background: #8a2be2; /* Roxo */
          color: white;
        }
        .message-bubble-container.minha .message-time {
          align-self: flex-end;
        }

        .chat-input-form {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ccc;
        }
        .chat-input-form input {
          flex-grow: 1;
          border: 1px solid #ccc;
          border-radius: 20px;
          padding: 10px 15px;
        }
        .chat-input-form button {
          background: #8a2be2;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 10px 15px;
          margin-left: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
