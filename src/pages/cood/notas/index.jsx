import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function FrequenciaTurma() {
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState("");
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [alunos, setAlunos] = useState([]);

    const COLORS = ["#a64efc", "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ffbb28"];

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
        <div style={styles.page}>
            {/* Sidebar (não modificada) */}
            <nav style={styles.sidebar}>
                <div className="sidebar">
                    <a href="/cood/dash"><i className="fas fa-home"></i> INICIO</a>
                    <a href="/cood/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                    <a href="/cood/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                    <a href="/cood/diarios"><i className="fas fa-book"></i> DIÁRIOS</a>
                    <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                    <a href="/cood/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                    <a href="#" className="active"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                    <a href="/cood/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                    <a href="/cood/professor"><i className="fa-circle-user"></i> AD PROFESSOR</a>
                    <a href="/cood/aluno"><i className="fa-circle-user"></i> AD ALUNOS</a>
                    <a href="/cood/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                    <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
                </div>

                <div className="main-content">
                    <div className="header">
                        <div className="welcome">Olá, Bem-vindo <strong>Carlos Pereira</strong></div>
                        <div className="icons">
                            <a href="/cood/chat" className="active"><i className="fas fa-envelope"></i></a>
                            <div className="user">
                                <i className="fas fa-user-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Conteúdo */}
            <main style={styles.content}>
                <div style={styles.wrapper}>
                    {/* Topo */}
                    <div style={styles.topbar}>
                        <div>Olá, Bem-vindo <strong style={{ color: "#5a3e96" }}>Carlos Pereira</strong></div>
                        <div style={styles.icons}>
                            <a href="/cood/chat" style={styles.icon}><i className="fas fa-envelope"></i></a>
                            <i className="fas fa-user-circle" style={{ fontSize: "24px", color: "#5a3e96" }}></i>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div style={styles.filtros}>
                        <select style={styles.select} value={turmaSelecionada} onChange={(e) => setTurmaSelecionada(e.target.value)}>
                            <option value="">Selecione uma turma</option>
                            {turmas.map((turma) => (
                                <option key={turma.idt} value={turma.idt}>{turma.nome}</option>
                            ))}
                        </select>

                        <select style={styles.select} value={mesSelecionado} onChange={(e) => setMesSelecionado(e.target.value)}>
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
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Distribuição de Faltas</h3>
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
                    <div style={styles.abas}>
                        <button style={styles.abaAtiva}>Frequência</button>
                        <button style={styles.abaInativa} disabled>Notas</button>
                    </div>

                    {/* Tabela */}
                    <div style={styles.card}>
                        <div style={styles.linhaCabecalho}>
                            <span style={styles.colunaAluno}><strong>Alunos</strong></span>
                            <span><strong>Faltas</strong></span>
                        </div>
                        {alunos.map((aluno, index) => (
                            <div key={index} style={styles.linha}>
                                <span style={styles.colunaAluno}>{aluno.nome}</span>
                                <span>{aluno.faltas}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    page: {
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f9",
    },
    sidebar: {
        width: 220,
        backgroundColor: "#5a3e96",
        color: "#fff",
        flexShrink: 0,
        overflowY: "auto",
    },
    content: {
        flex: 1,
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        padding: "30px 20px",
    },
    wrapper: {
        width: "100%",
        maxWidth: 900,
    },
    topbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    icons: {
        display: "flex",
        alignItems: "center",
        gap: 15,
    },
    icon: {
        fontSize: 20,
        color: "#7c52ff",
    },
    filtros: {
        display: "flex",
        gap: 20,
        marginBottom: 30,
    },
    select: {
        flex: 1,
        padding: "10px 12px",
        fontSize: 15,
        borderRadius: 8,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: 30,
    },
    cardTitle: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 20,
        color: "#333",
    },
    abas: {
        display: "flex",
        gap: 10,
        marginBottom: 20,
    },
    abaAtiva: {
        flex: 1,
        padding: 12,
        backgroundColor: "#a64efc",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontWeight: "bold",
        cursor: "pointer",
    },
    abaInativa: {
        flex: 1,
        padding: 12,
        backgroundColor: "#eee",
        color: "#999",
        border: "none",
        borderRadius: 8,
        fontWeight: "bold",
        cursor: "not-allowed",
    },
    linhaCabecalho: {
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 10,
        borderBottom: "1px solid #eee",
        marginBottom: 10,
    },
    linha: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #f0f0f0",
    },
    colunaAluno: {
        flex: 1,
    },
};
