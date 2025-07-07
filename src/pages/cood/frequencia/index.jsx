import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import api from "../../../services/api";

function FrequenciaCood() {
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

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <nav style={styles.sidebar}>
                <div className="sidebar">
                    <a href="/cood/dash"><i className="fas fa-home"></i> INICIO</a>
                    <a href="/cood/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                    <a href="/cood/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                    <a href="/cood/diarios"><i className="fas fa-book"></i> DIÁRIOS</a>
                    <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                    <a href="/cood/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                    <a href="/cood/notas"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                    <a href="#" className="active"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                    <a href="/cood/professor"><i className="fa-circle-user"></i> AD PROFESSOR</a>
                    <a href="/cood/aluno"><i className="fa-circle-user"></i> AD ALUNOS</a>
                    <a href="/cood/turmas"><i className="fa-circle-user"></i> TURMAS</a>
                    <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
                </div>
            </nav>

            {/* Conteúdo principal */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <div style={styles.headerText}>Olá, Bem-vindo <strong style={{ color: "#5a3e96" }}>Carlos Pereira</strong></div>
                    <div>
                        <a href="/cood/chat" style={styles.chatIcon}><i className="fas fa-envelope"></i></a>
                        <i className="fas fa-user-circle" style={styles.userIcon}></i>
                    </div>
                </header>

                <h1 style={styles.title}>Registrar Chamada</h1>

                <label style={styles.label}>Escolha a data:</label>
                <div style={styles.card}>
                    <Calendar onChange={setSelectedData} value={selectedData} />
                </div>

                {selectedData && (
                    <>
                        <label style={styles.label}>Selecione a Turma:</label>
                        <select value={selectedTurma} onChange={(e) => setSelectedTurma(e.target.value)} style={styles.input}>
                            <option value="">-- Selecione --</option>
                            {turmas.map((turma) => (
                                <option key={turma.idt} value={turma.idt}>{turma.nome}</option>
                            ))}
                        </select>
                    </>
                )}

                {selectedTurma && (
                    <>
                        <label style={styles.label}>Título da chamada:</label>
                        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Chamada 1" style={styles.input} />

                        <label style={styles.label}>Matéria (opcional):</label>
                        <input type="text" value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Ex: Matemática" style={styles.input} />

                        <label style={styles.label}>Seu ID de usuário (professor):</label>
                        <input type="number" value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)} placeholder="Digite seu ID" style={styles.input} />

                        <h3 style={styles.subTitle}>Marcar Presença</h3>

                        {loadingAlunos ? (
                            <p>Carregando alunos...</p>
                        ) : alunos.length === 0 ? (
                            <p>Nenhum aluno encontrado para esta turma.</p>
                        ) : (
                            alunos.map((aluno) => (
                                <div key={aluno.id} style={styles.alunoBox}>
                                    <span>{aluno.nome}</span>
                                    <div>
                                        <button
                                            onClick={() => handlePresenca(aluno.id, true)}
                                            style={{
                                                ...styles.btn,
                                                backgroundColor: presencas[aluno.id] ? "#4caf50" : "#eee",
                                                color: presencas[aluno.id] ? "#fff" : "#333",
                                            }}
                                        >
                                            P
                                        </button>
                                        <button
                                            onClick={() => handlePresenca(aluno.id, false)}
                                            style={{
                                                ...styles.btn,
                                                backgroundColor: presencas[aluno.id] === false ? "#f44336" : "#eee",
                                                color: presencas[aluno.id] === false ? "#fff" : "#333",
                                            }}
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
                            style={{
                                ...styles.btnSalvar,
                                backgroundColor: salvando ? "#aaa" : "#7c52ff",
                                cursor: salvando ? "not-allowed" : "pointer"
                            }}
                        >
                            {salvando ? "Salvando..." : "Salvar Chamada"}
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif"
    },
    sidebar: {
        width: 220,
        backgroundColor: "#5a3e96",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        flexShrink: 0,
        overflowY: "auto"
    },
    main: {
        flex: 1,
        overflowY: "auto",
        padding: "30px 40px",
        backgroundColor: "#f4f4f9"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18
    },
    chatIcon: {
        color: "#7c52ff",
        fontSize: 22,
        marginRight: 15
    },
    userIcon: {
        color: "#5a3e96",
        fontSize: 24
    },
    title: {
        marginBottom: 24,
        color: "#5a3e96"
    },
    label: {
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 8,
        display: "block",
    },
    input: {
        width: "100%",
        padding: 10,
        fontSize: 16,
        borderRadius: 8,
        border: "1px solid #ccc",
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    btn: {
        marginRight: 8,
        padding: "6px 12px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: 16
    },
    btnSalvar: {
        marginTop: 30,
        width: "100%",
        padding: 14,
        fontSize: 18,
        fontWeight: "bold",
        border: "none",
        borderRadius: 8,
        color: "#fff",
    },
    subTitle: {
        marginBottom: 12,
        marginTop: 20,
        color: "#333",
        fontSize: 20
    },
    alunoBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        marginBottom: 8,
        backgroundColor: "#fff",
        borderRadius: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: 20,
        width: "fit-content"
    }
};

export default FrequenciaCood;
