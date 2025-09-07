import { useState } from "react";
import axios from "axios";
import "../professor/style.css";

// 🔹 Helper para pegar usuário logado do localStorage
function getStoredUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function CadastroProfessor() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "professor",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        matricula: "",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 🔹 Recupera nome do usuário logado
    const user = getStoredUser();
    const nomeUsuario = user?.nome || user?.name || "Usuário";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/prof", form);
            setSuccessMessage("Professor cadastrado com sucesso!");
            setError("");
            setForm({
                name: "",
                email: "",
                password: "",
                role: "professor",
                cpf: "",
                telefone: "",
                dataNascimento: "",
                matricula: "",
            });
        } catch (err) {
            console.error(err);
            setError("Erro ao cadastrar professor. Tente novamente.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="centro">
            {/* SIDEBAR */}
            <div className="sidebar">
                <a href="/diret/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/diret/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/diret/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/diret/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/diret/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/diret/notas"><i className="fa-solid fa-note-sticky"></i> NOTAS</a>
                <a href="/diret/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="#" className="active"><i className="fa-solid fa-person-chalkboard"></i> PROFESSOR</a>
                <a href="/diret/aluno"><i className="fa-circle-user"></i> ALUNOS</a>
                <a href="/diret/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* CONTENT */}
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{nomeUsuario}</strong>
                    </div>
                    <div className="icons">
                        <a href="/diret/chat"><i className="fas fa-envelope"></i></a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                {/* MAIN */}
                <div className="main">
                    <h2 className="rara">Cadastro de Professor</h2>

                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="cpf"
                            placeholder="CPF"
                            value={form.cpf}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="telefone"
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="matricula"
                            placeholder="Número de Matrícula"
                            value={form.matricula}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
