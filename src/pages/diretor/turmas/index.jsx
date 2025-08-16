import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../turmas/style.css";

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
        <div className="centro">
            <div className="sidebar">
                <a href="/diret/dash" ><i className="fas fa-home"></i> INICIO</a>
                <a href="/diret/atividades" ><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/diret/avaliacoes" ><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/diret/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/diret/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/diret/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="/diret/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/diret/professor"><i className="fa-solid fa-person-chalkboard" ></i>PROFESSOR</a>
                <a href="/diret/aluno"><i className="fa-circle-user" ></i>ALUNOS</a>
                <a href="#" className="active"><i className="fa-circle-user"></i> TURMAS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>Carlos Pereira</strong>
                    </div>
                    <div className="icons">
                        <a href="/diret/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                <h1 className="turmas-title">Gerenciamento de Turmas</h1>

                <div className="turmas-nova">
                    <input
                        type="text"
                        placeholder="Nome da nova turma"
                        value={novaTurmaNome}
                        onChange={(e) => setNovaTurmaNome(e.target.value)}
                        className="turmas-input"
                    />
                    <button onClick={criarNovaTurma} className="turmas-add-btn">Criar Turma</button>
                </div>

                <div className="turmas-lista-botoes">
                    {turmas.map((turma) => (
                        <button
                            key={turma.idt}
                            className={`turmas-botao ${selectedTurmaIdt === turma.idt ? "ativa" : ""}`}
                            onClick={() => carregarAlunos(turma.idt)}
                        >
                            {turma.nome || `Turma ${turma.idt}`}
                        </button>
                    ))}
                </div>

                {selectedTurmaIdt && (
                    <div className="turmas-painel">
                        <h2>Alunos da Turma {selectedTurmaIdt}</h2>

                        {alunos.length === 0 ? (
                            <p className="turmas-info">Nenhum aluno nesta turma.</p>
                        ) : (
                            <ul className="turmas-lista">
                                {alunos.map((aluno) => (
                                    <li key={aluno.id} className="turmas-item">
                                        <span>
                                            <strong>{aluno.nome}</strong> — {aluno.email}
                                        </span>
                                        <button onClick={() => removerAluno(aluno.id)} className="btn-remover">
                                            Remover
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="turmas-add-aluno">
                            <h3>Adicionar Aluno</h3>
                            <input
                                type="text"
                                placeholder="Buscar por nome"
                                value={filtroNome}
                                onChange={(e) => setFiltroNome(e.target.value)}
                                className="turmas-input"
                            />
                            <div className="turmas-sugestoes">
                                {alunosDisponiveis.slice(0, 5).map((aluno) => (
                                    <button
                                        key={aluno.id}
                                        onClick={() => adicionarAluno(aluno.id)}
                                        className="sugestao-aluno"
                                    >
                                        {aluno.name} ({aluno.email})
                                    </button>
                                ))}
                                {alunosDisponiveis.length === 0 && (
                                    <p className="turmas-info">Nenhum aluno disponível.</p>
                                )}
                            </div>
                        </div>

                        {mensagem && <p className="turmas-mensagem">{mensagem}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
