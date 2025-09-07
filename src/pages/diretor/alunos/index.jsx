import { useState } from "react";
import axios from "axios";
import "../alunos/style.css";
import "../css/css_principal.css";

// Helper para pegar usuário do localStorage
function getStoredUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function CadastroAluno() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "aluno", // Mantém fixo
        cpf: "",
        telefone: "",
        dataNascimento: "",
        cpfMae: "",
        cpfPai: "",
    });

    const [error, setError] = useState(""); // Mensagens de erro
    const [successMessage, setSuccessMessage] = useState(""); // Mensagens de sucesso

    const user = getStoredUser(); // pega o usuário logado
    const nomeUsuario = user?.nome || user?.name || "Usuário";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Chamada para API para cadastrar o aluno
            await axios.post("http://localhost:3000/api/aluno", form);

            // Mensagem de sucesso
            setSuccessMessage("Aluno cadastrado com sucesso!");
            setError("");

            // Reset do form
            setForm({
                name: "",
                email: "",
                password: "",
                role: "aluno", // Corrigido aqui (não "aluno_vall")
                cpf: "",
                telefone: "",
                dataNascimento: "",
                cpfMae: "",
                cpfPai: "",
            });
        } catch (err) {
            console.error(err);
            setError("Erro ao cadastrar aluno. Tente novamente.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="centro">
            {/* Sidebar */}
            <div className="sidebar">
                <a href="/diret/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/diret/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/diret/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/diret/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/diret/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/diret/notas"><i className="fa-solid fa-note-sticky"></i> NOTAS</a>
                <a href="/diret/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/diret/professor"><i className="fa-solid fa-person-chalkboard"></i> PROFESSOR</a>
                <a href="#" className="active"><i className="fa-circle-user"></i> ALUNO</a>
                <a href="/diret/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* Conteúdo principal */}
            <div className="content">
                {/* Header */}
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{nomeUsuario}</strong>
                    </div>
                    <div className="icons">
                        <a href="/diret/chat" className="active">
                            <i className="fas fa-envelope"></i>
                        </a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="principal" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
                    <h2>Cadastro de Aluno</h2>

                    {error && <div className="bg-red-200 text-red-800 p-2 rounded mb-4">{error}</div>}
                    {successMessage && <div className="bg-green-200 text-green-800 p-2 rounded mb-4">{successMessage}</div>}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input type="text" name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
                        <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
                        <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
                        <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} required />
                        <input type="text" name="cpfMae" placeholder="CPF da Mãe" value={form.cpfMae} onChange={handleChange} required />
                        <input type="text" name="cpfPai" placeholder="CPF do Pai" value={form.cpfPai} onChange={handleChange} required />
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
