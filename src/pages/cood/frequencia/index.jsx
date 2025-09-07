import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../frequencia/style.css";

function DiretFrequencia() {
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedTurma, setSelectedTurma] = useState("");
    const [presencas, setPresencas] = useState({});
    const [titulo, setTitulo] = useState("");
    const [materia, setMateria] = useState("");
    const [loadingAlunos, setLoadingAlunos] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [userIdInput, setUserIdInput] = useState("");
    const [mesAtual, setMesAtual] = useState(new Date().getMonth());

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    useEffect(() => {
        const carregarTurmas = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get("/api/turmas", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTurmas(res.data);
            } catch {
                alert("Erro ao carregar turmas");
            }
        };
        carregarTurmas();
    }, []);

    useEffect(() => {
        if (selectedData && selectedTurma) {
            buscarAlunos();
            carregarPresencas();
        } else {
            setAlunos([]);
            setPresencas({});
        }
    }, [selectedData, selectedTurma]);

    const buscarAlunos = async () => {
        setLoadingAlunos(true);
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`/api/turmas/${selectedTurma}/alunos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAlunos(res.data);
        } catch {
            alert("Erro ao buscar alunos");
        }
        setLoadingAlunos(false);
    };

    const carregarPresencas = async () => {
        try {
            const token = localStorage.getItem("token");
            const dataISO = selectedData.toISOString().slice(0, 10);
            const res = await api.get(`/api/presencas?turmaIdt=${selectedTurma}&data=${dataISO}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const status = {};
            res.data.forEach((p) => {
                status[p.alunoId] = p.status === "Presente";
            });
            setPresencas(status);
        } catch {
            setPresencas({});
        }
    };

    const handlePresenca = (id, presente) => {
        setPresencas((prev) => ({ ...prev, [id]: presente }));
    };

    const salvarChamada = async () => {
        if (!titulo.trim()) return alert("Informe um título para a chamada");
        if (!userIdInput || Number(userIdInput) <= 0) return alert("ID de usuário inválido");
        setSalvando(true);
        try {
            const token = localStorage.getItem("token");
            const dataISO = selectedData.toISOString().slice(0, 10);
            const payload = {
                turmaIdt: selectedTurma,
                userId: Number(userIdInput),
                data: dataISO,
                nome: titulo,
                materia,
                presencas: alunos.map((aluno) => ({
                    alunoId: aluno.id,
                    presente: presencas[aluno.id] ?? false,
                })),
            };
            await api.post("/api/chamadas", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Chamada salva com sucesso!");
        } catch {
            alert("Erro ao salvar chamada.");
        }
        setSalvando(false);
    };

    const diasNoMes = (mes) => new Date(2025, mes + 1, 0).getDate();

    const renderDias = () => {
        const dias = diasNoMes(mesAtual);
        const elementos = [];
        for (let i = 1; i <= dias; i++) {
            elementos.push(
                <div
                    key={i}
                    className={`calendario-dia ${selectedData && selectedData.getDate() === i && selectedData.getMonth() === mesAtual ? 'ativo' : ''}`}
                    onClick={() => setSelectedData(new Date(2025, mesAtual, i))}
                >
                    {i}
                </div>
            );
        }
        return elementos;
    };

    return (
        <div className="centro">
            <div className="sidebar">
                <a href="/cood/dash" ><i className="fas fa-home"></i> INICIO</a>
                <a href="/cood/atividades" ><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/cood/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/cood/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/cood/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="#" className="active"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/cood/professor"><i className="fa-solid fa-person-chalkboard" ></i>PROFESSOR</a>
                <a href="/cood/aluno" ><i className="fa-circle-user" ></i>ALUNOS</a>
                <a href="/cood/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>Carlos Pereira</strong>
                    </div>
                    <div className="icons">
                        <a href="/cood/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                <h1 className="frequencia-title">Registrar Chamada</h1>

                <label className="frequencia-label">Escolha a data:</label>
                <div className="frequencia-card">
                    {/* Cabeçalho do calendário */}
                    <div className="calendario-header">
                        <h3>2025</h3>
                        <select
                            className="calendario-select"
                            value={mesAtual}
                            onChange={(e) => setMesAtual(parseInt(e.target.value))}
                        >
                            {meses.map((mes, index) => (
                                <option key={index} value={index}>{mes}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dias da semana */}
                    <div className="calendario-semana">
                        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                            <div key={dia} className="calendario-semana-dia">{dia}</div>
                        ))}
                    </div>

                    {/* Grid de dias */}
                    <div className="calendario-grid">{renderDias()}</div>
                </div>

                {selectedData && (
                    <>
                        <label className="frequencia-label">Selecione a Turma:</label>
                        <select value={selectedTurma} onChange={(e) => setSelectedTurma(e.target.value)} className="frequencia-input">
                            <option value="">-- Selecione --</option>
                            {turmas.map((turma) => (
                                <option key={turma.idt} value={turma.idt}>{turma.nome}</option>
                            ))}
                        </select>
                    </>
                )}

                {selectedTurma && (
                    <>
                        <label className="frequencia-label">Título da chamada:</label>
                        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="frequencia-input" placeholder="Ex: Chamada 1" />

                        <label className="frequencia-label">Matéria (opcional):</label>
                        <input type="text" value={materia} onChange={(e) => setMateria(e.target.value)} className="frequencia-input" placeholder="Ex: Matemática" />

                        <label className="frequencia-label">Seu ID de usuário (professor):</label>
                        <input type="number" value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)} className="frequencia-input" placeholder="Digite seu ID" />

                        <h3 className="frequencia-subtitle">Marcar Presença</h3>

                        {loadingAlunos ? (
                            <p>Carregando alunos...</p>
                        ) : alunos.length === 0 ? (
                            <p>Nenhum aluno encontrado para esta turma.</p>
                        ) : (
                            alunos.map((aluno) => (
                                <div key={aluno.id} className="frequencia-aluno-box">
                                    <span>{aluno.nome}</span>
                                    <div>
                                        <button
                                            onClick={() => handlePresenca(aluno.id, true)}
                                            className={`frequencia-btn ${presencas[aluno.id] ? "btn-presente" : ""}`}
                                        >
                                            P
                                        </button>
                                        <button
                                            onClick={() => handlePresenca(aluno.id, false)}
                                            className={`frequencia-btn ${presencas[aluno.id] === false ? "btn-falta" : ""}`}
                                        >
                                            F
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        <button
                            onClick={salvarChamada}
                            disabled={salvando}
                            className="frequencia-btn-salvar"
                        >
                            {salvando ? "Salvando..." : "Salvar Chamada"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default DiretFrequencia;
