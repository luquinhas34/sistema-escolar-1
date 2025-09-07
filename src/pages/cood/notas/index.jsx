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
        <div className="centro">
            {/* CSS embutido */}
            <style>{`
                .centro {
                    display: flex;
                    min-height: 100vh;
                }
                    .content{
                   background-color: #fff;

                    }
               
                .content { flex: 1; padding: 20px 30px; background-color: #f5f6fa; }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .welcome { font-size: 1.2rem; }
                .icons { display: flex; align-items: center; gap: 15px; }
                .icons a { color: #333; font-size: 1.2rem; }
                .icons a.active { color: #6a0dad; }
                .user i { font-size: 1.8rem; color: #6a0dad; }
                .coodnotas-info-cards { display: flex; flex-direction: column; gap: 30px; }
                .coodnotas-section h2 { margin-bottom: 20px; color: #6a0dad; }
                .coodnotas-select {
                    padding: 10px 12px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    background-color: #fff;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .coodnotas-select:hover { border-color: #6a0dad; }
                .coodnotas-card {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .recharts-wrapper { margin-top: 15px; }
                .coodnotas-button-active {
                    padding: 10px 20px;
                    background-color: #6a0dad;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .coodnotas-button-active:hover { background-color: #7e1bdc; }
                .coodnotas-button-disabled {
                    padding: 10px 20px;
                    background-color: #ccc;
                    color: #666;
                    border: none;
                    border-radius: 8px;
                    cursor: not-allowed;
                    font-weight: 600;
                }
                .coodnotas-table-header, .coodnotas-table-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                .coodnotas-table-header span { font-weight: 700; color: #555; }
                .coodnotas-table-row span { color: #333; }
                @media (max-width: 1024px) {
                    .centro { flex-direction: column; }
                    .sidebar {
                        width: 100%;
                        flex-direction: row;
                        flex-wrap: wrap;
                        justify-content: space-around;
                        padding: 10px;
                        box-shadow: none;
                    }
                    .content { padding: 15px; }
                }
            `}</style>

            {/* Font Awesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            />

            {/* SIDEBAR */}
            <div className="sidebar">
                <a href="/cood/dash" ><i className="fas fa-home"></i> INICIO</a>
                <a href="/cood/atividades" ><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/cood/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/cood/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="#" className="active"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="/cood/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/cood/professor"><i className="fa-solid fa-person-chalkboard" ></i>PROFESSOR</a>
                <a href="/cood/aluno" ><i className="fa-circle-user" ></i>ALUNOS</a>
                <a href="/cood/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* Conteúdo */}
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>Carlos Pereira</strong>
                    </div>
                    <div className="icons">
                        <a href="/cood/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="coodnotas-info-cards">
                    <div className="coodnotas-section">
                        <h2>Frequência por Turma</h2>

                        {/* Filtros */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                            <select
                                className="coodnotas-select"
                                value={turmaSelecionada}
                                onChange={(e) => setTurmaSelecionada(e.target.value)}
                            >
                                <option value="">Selecione uma turma</option>
                                {turmas.map((turma) => (
                                    <option key={turma.idt} value={turma.idt}>{turma.nome}</option>
                                ))}
                            </select>

                            <select
                                className="coodnotas-select"
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
                            <div className="coodnotas-card">
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
                            <button className="coodnotas-button-active">Frequência</button>
                            <button className="coodnotas-button-disabled" disabled>Notas</button>
                        </div>

                        {/* Tabela */}
                        <div className="coodnotas-card">
                            <div className="coodnotas-table-header">
                                <span><strong>Alunos</strong></span>
                                <span><strong>Faltas</strong></span>
                            </div>
                            {alunos.map((aluno, index) => (
                                <div key={index} className="coodnotas-table-row">
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
