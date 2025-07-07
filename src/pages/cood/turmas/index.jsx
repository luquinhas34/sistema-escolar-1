import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function GerenciarTurmas() {
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [todosAlunos, setTodosAlunos] = useState([]);
    const [selectedTurmaIdt, setSelectedTurmaIdt] = useState(null);
    const [filtroNome, setFiltroNome] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [novaTurmaNome, setNovaTurmaNome] = useState("");

    useEffect(() => {
        buscarTurmas();
        buscarTodosAlunos();
    }, []);

    async function buscarTurmas() {
        try {
            const response = await api.get("/api/turmas");
            setTurmas(response.data);
        } catch (error) {
            console.error("Erro ao buscar turmas:", error);
        }
    }

    async function buscarTodosAlunos() {
        try {
            const response = await api.get("/api/users");
            const alunosFiltrados = response.data.filter((u) => u.role === "aluno_vall");
            setTodosAlunos(alunosFiltrados);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        }
    }

    async function carregarAlunos(idt) {
        setSelectedTurmaIdt(idt);
        setMensagem("");
        setFiltroNome("");
        try {
            const response = await api.get(`/api/turmas/${idt}/alunos`);
            setAlunos(response.data);
        } catch (error) {
            console.error("Erro ao carregar alunos da turma:", error);
            setAlunos([]);
        }
    }

    async function adicionarAluno(userId) {
        try {
            const response = await api.post("/api/turmas/adicionar-aluno", {
                userId,
                turmaIdt: selectedTurmaIdt,
            });
            setMensagem(response.data.message);
            carregarAlunos(selectedTurmaIdt);
        } catch (error) {
            console.error("Erro ao adicionar aluno:", error);
            setMensagem(error.response?.data?.message || "Erro ao adicionar aluno.");
        }
    }

    async function removerAluno(userId) {
        try {
            await api.delete(`/api/turmas/${selectedTurmaIdt}/alunos/${userId}`);
            setMensagem("Aluno removido com sucesso.");
            carregarAlunos(selectedTurmaIdt);
        } catch (error) {
            console.error("Erro ao remover aluno:", error);
            setMensagem("Erro ao remover aluno.");
        }
    }

    async function criarNovaTurma() {
        if (!novaTurmaNome.trim()) {
            setMensagem("Informe um nome para a nova turma.");
            return;
        }
        try {
            await api.post("/api/turmas", { nome: novaTurmaNome });
            setNovaTurmaNome("");
            setMensagem("Turma criada com sucesso!");
            buscarTurmas();
        } catch (error) {
            console.error("Erro ao criar turma:", error);
            setMensagem("Erro ao criar turma.");
        }
    }

    const alunosDisponiveis = todosAlunos.filter(
        (a) =>
            !alunos.some((ja) => ja.id === a.id) &&
            a.name.toLowerCase().includes(filtroNome.toLowerCase())
    );

    return (
        <div style={styles.page}>
            {/* Sidebar */}
            <div className="sidebar">
                <a href="/cood/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/cood/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/cood/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/cood/diarios" ><i className="fas fa-book"></i> DIÁRIOS</a>
                <a href="/cood/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/cood/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/cood/notas"><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="/cood/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/cood/professor"><i className="fa-circle-user"></i> AD PROFESSOR</a>
                <a href="/cood/aluno"><i className="fa-circle-user"></i> AD ALUNOS</a>
                <a href="/cood/turmas" className="active"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* Conteúdo principal com largura definida */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <div>Olá, Bem-vindo <strong>Carlos Pereira</strong></div>
                    <div style={styles.icons}>
                        <a href="/cood/chat"><i className="fas fa-envelope"></i></a>
                        <i className="fas fa-user-circle" style={{ fontSize: "1.5rem" }}></i>
                    </div>
                </div>

                <h1 style={styles.title}>Gerenciamento de Turmas</h1>

                <div style={styles.novaTurmaContainer}>
                    <input
                        type="text"
                        placeholder="Nome da nova turma"
                        value={novaTurmaNome}
                        onChange={(e) => setNovaTurmaNome(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={criarNovaTurma} style={styles.addButton}>
                        Criar Turma
                    </button>
                </div>

                <div style={styles.turmasContainer}>
                    {turmas.map((turma) => (
                        <button
                            key={turma.idt}
                            style={{
                                ...styles.turmaButton,
                                backgroundColor: selectedTurmaIdt === turma.idt ? "#7e57c2" : "#f0f0f0",
                                color: selectedTurmaIdt === turma.idt ? "#fff" : "#000",
                            }}
                            onClick={() => carregarAlunos(turma.idt)}
                        >
                            {turma.nome || `Turma ${turma.idt}`}
                        </button>
                    ))}
                </div>

                {selectedTurmaIdt && (
                    <div style={styles.painel}>
                        <h2 style={styles.subTitle}>Alunos da Turma {selectedTurmaIdt}</h2>

                        {alunos.length === 0 ? (
                            <p style={styles.infoText}>Nenhum aluno nesta turma.</p>
                        ) : (
                            <ul style={styles.lista}>
                                {alunos.map((aluno) => (
                                    <li key={aluno.id} style={styles.listaItem}>
                                        <span>
                                            <strong>{aluno.nome}</strong> — {aluno.email}
                                        </span>
                                        <button style={styles.removeButton} onClick={() => removerAluno(aluno.id)}>
                                            Remover
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div style={styles.adicionarBox}>
                            <h3>Adicionar Aluno</h3>
                            <input
                                type="text"
                                placeholder="Buscar por nome"
                                value={filtroNome}
                                onChange={(e) => setFiltroNome(e.target.value)}
                                style={styles.input}
                            />
                            <div style={styles.autocompleteBox}>
                                {alunosDisponiveis.slice(0, 5).map((aluno) => (
                                    <button
                                        key={aluno.id}
                                        style={styles.alunoSugestao}
                                        onClick={() => adicionarAluno(aluno.id)}
                                    >
                                        {aluno.name} ({aluno.email})
                                    </button>
                                ))}
                                {alunosDisponiveis.length === 0 && (
                                    <p style={styles.infoText}>Nenhum aluno disponível.</p>
                                )}
                            </div>
                        </div>

                        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

// Estilos CSS-in-JS
const styles = {
    page: {
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f8fc",
    },
    mainContent: {
        flex: 1,
        padding: "30px 40px",
        overflowY: "auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
    },
    icons: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
    title: {
        fontSize: "2rem",
        marginBottom: "1.5rem",
        color: "#4a148c",
    },
    novaTurmaContainer: {
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
    },
    input: {
        padding: "0.6rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        width: "100%",
        maxWidth: "300px",
        fontSize: "1rem",
    },
    addButton: {
        backgroundColor: "#7e57c2",
        color: "#fff",
        border: "none",
        padding: "0.6rem 1rem",
        borderRadius: "6px",
        cursor: "pointer",
    },
    turmasContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "2rem",
    },
    turmaButton: {
        padding: "0.7rem 1.2rem",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "0.2s",
    },
    painel: {
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    subTitle: {
        fontSize: "1.5rem",
        marginBottom: "1rem",
    },
    lista: {
        listStyle: "none",
        padding: 0,
    },
    listaItem: {
        display: "flex",
        justifyContent: "space-between",
        background: "#f1f1f9",
        padding: "0.7rem 1rem",
        borderRadius: "6px",
        marginBottom: "0.5rem",
    },
    removeButton: {
        backgroundColor: "#e53935",
        color: "#fff",
        border: "none",
        padding: "0.4rem 0.8rem",
        borderRadius: "5px",
        cursor: "pointer",
    },
    adicionarBox: {
        marginTop: "2rem",
    },
    autocompleteBox: {
        marginTop: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    alunoSugestao: {
        background: "#ede7f6",
        border: "1px solid #b39ddb",
        padding: "0.5rem",
        borderRadius: "6px",
        cursor: "pointer",
        textAlign: "left",
    },
    infoText: {
        color: "#777",
    },
    mensagem: {
        marginTop: "1rem",
        padding: "0.8rem",
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        border: "1px solid #a5d6a7",
        borderRadius: "8px",
    },
};
