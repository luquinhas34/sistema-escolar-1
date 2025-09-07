
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../notas/style.css";

// 🔹 Helper para pegar usuário logado do localStorage
function getStoredUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function FrequenciaTurma() {
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState("");
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [alunos, setAlunos] = useState([]);

    const COLORS = ["#a64efc", "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ffbb28"];

    // 🔹 Recupera nome do usuário
    const user = getStoredUser();
    const nomeUsuario = user?.nome || user?.name || "Usuário";

    useEffect(() => {
        async function buscarTurmas() {
            try {
                const res = await axios.get("http://localhost:3000/api/turmas");
                setTurmas(res.data);
            } catch (err) {
                console.error("Erro ao carregar turmas", err);
            }
        }
        buscarTurmas();
    }, []);

    useEffect(() => {
        async function buscarFrequencia() {
            if (!turmaSelecionada || !mesSelecionado) return;

            try {
                const res = await axios.get(
                    `http://localhost:3000/api/frequencia/turma/${turmaSelecionada}?mes=${mesSelecionado}`
                );
                setAlunos(res.data);
            } catch (err) {
                console.error("Erro ao buscar frequência", err);
            }
        }

        buscarFrequencia();
    }, [turmaSelecionada, mesSelecionado]);

    return (
        <div className="centro">
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            />
            {/* SIDEBAR */}
            <div className="sidebar">
                <a href="/aluno/dash" ><i className="fas fa-home"></i> INICIO</a>
                <a href="/aluno/atividades" ><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/aluno/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/aluno/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="#" className="active"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* CONTENT */}
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{nomeUsuario}</strong>
                    </div>
                    <div className="icons">
                        <a href="/aluno/chat"><i className="fas fa-envelope"></i></a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                {/* CONTEÚDO */}
                <div className="diretnotas-info-cards">
                    <div className="diretnotas-section">
                        <h2>Frequência por Turma</h2>

                        {/* Filtros */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                            <select
                                className="diretnotas-select"
                                value={turmaSelecionada}
                                onChange={(e) => setTurmaSelecionada(e.target.value)}
                            >
                                <option value="">Selecione uma turma</option>
                                {turmas.map((turma) => (
                                    <option key={turma.idt} value={turma.idt}>
                                        {turma.nome}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="diretnotas-select"
                                value={mesSelecionado}
                                onChange={(e) => setMesSelecionado(e.target.value)}
                            >
                                <option value="">Selecione um mês</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={String(i + 1).padStart(2, "0")}>
                                        {new Date(2025, i).toLocaleString("pt-BR", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Gráfico */}
                        {alunos.length > 0 && (
                            <div className="diretnotas-card">
                                <h3>Distribuição de Faltas</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={alunos}
                                            dataKey="faltas"
                                            nameKey="nome"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name} (${(percent * 100).toFixed(0)}%)`
                                            }
                                        >
                                            {alunos.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Abas */}
                        <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
                            <button className="diretnotas-button-active">Frequência</button>
                            <button className="diretnotas-button-disabled" disabled>Notas</button>
                        </div>

                        {/* Tabela */}
                        <div className="diretnotas-card">
                            <div className="diretnotas-table-header">
                                <span><strong>Alunos</strong></span>
                                <span><strong>Faltas</strong></span>
                            </div>
                            {alunos.map((aluno, index) => (
                                <div key={index} className="diretnotas-table-row">
                                    <span>{aluno.nome}</span>
                                    <span>{aluno.faltas}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
