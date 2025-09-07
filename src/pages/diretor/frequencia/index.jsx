import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import api from "../../../services/api";
import "../frequencia/style.css";

// Helper para pegar usuário do localStorage (mesmo do CadastroAluno)
function getStoredUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function DiretFrequencia() {
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

    // pega o usuário logado
    const user = getStoredUser();
    const nomeUsuario = user?.nome || user?.name || "Usuário";

    useEffect(() => {
        carregarTurmas();
    }, []);

    async function carregarTurmas() {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/api/turmas", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTurmas(res.data);
        } catch {
            alert("Erro ao carregar turmas");
        }
    }

    useEffect(() => {
        if (selectedData && selectedTurma) {
            buscarAlunos();
            carregarPresencas();
        } else {
            setAlunos([]);
            setPresencas({});
        }
    }, [selectedData, selectedTurma]);

    async function buscarAlunos() {
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
    }

    async function carregarPresencas() {
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
    }

    function handlePresenca(id, presente) {
        setPresencas((prev) => ({ ...prev, [id]: presente }));
    }

    async function salvarChamada() {
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
    }

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
                <a href="#" className="active"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/diret/professor"><i className="fa-solid fa-person-chalkboard"></i> PROFESSOR</a>
                <a href="/diret/aluno"><i className="fa-circle-user"></i> ALUNOS</a>
                <a href="/diret/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* Conteúdo principal */}
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{nomeUsuario}</strong>
                    </div>
                    <div className="icons">
                        <a href="/diret/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                <h1 className="frequencia-title">Registrar Chamada</h1>

                {/* Calendário */}
                <label className="frequencia-label">Escolha a data:</label>
                <div className="frequencia-card">
                    <Calendar
                        onChange={setSelectedData}
                        value={selectedData}
                        formatShortWeekday={(locale, date) =>
                            date.toLocaleDateString("pt-BR", { weekday: "long" }).replace("-feira", "")
                        }
                        formatDay={(locale, date) => date.getDate()}
                    />
                </div>

                {/* Seleção da turma */}
                {selectedData && (
                    <>
                        <label className="frequencia-label">Selecione a Turma:</label>
                        <select
                            value={selectedTurma}
                            onChange={(e) => setSelectedTurma(e.target.value)}
                            className="frequencia-input"
                        >
                            <option value="">-- Selecione --</option>
                            {turmas.map((turma) => (
                                <option key={turma.idt} value={turma.idt}>{turma.nome}</option>
                            ))}
                        </select>
                    </>
                )}

                {/* Formulário da chamada */}
                {selectedTurma && (
                    <>
                        <label className="frequencia-label">Título da chamada:</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="frequencia-input"
                            placeholder="Ex: Chamada 1"
                        />

                        <label className="frequencia-label">Matéria (opcional):</label>
                        <input
                            type="text"
                            value={materia}
                            onChange={(e) => setMateria(e.target.value)}
                            className="frequencia-input"
                            placeholder="Ex: Matemática"
                        />

                        <label className="frequencia-label">Seu ID de usuário (professor):</label>
                        <input
                            type="number"
                            value={userIdInput}
                            onChange={(e) => setUserIdInput(e.target.value)}
                            className="frequencia-input"
                            placeholder="Digite seu ID"
                        />

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
