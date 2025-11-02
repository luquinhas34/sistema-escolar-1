import { useEffect, useState } from "react";
import api from "../../../services/api"; // Usando o 'api' que configuramos
import "./style.css"; // Importando o CSS limpo

export default function ProfNotas() {
    // States dos Filtros
    const [turmas, setTurmas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [filtroTurma, setFiltroTurma] = useState("");
    const [filtroMateria, setFiltroMateria] = useState("");

    // States dos Dados
    const [alunosDaTurma, setAlunosDaTurma] = useState([]); // Alunos para o dropdown do formulário
    const [notas, setNotas] = useState([]); // Lista de notas exibida na tabela
    const [user, setUser] = useState({ name: "Coordenador" });

    // States do Formulário
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(null); // Guarda o ID da nota sendo editada
    const [formData, setFormData] = useState({
        alunoId: "",
        materiaId: "",
        tipo: "Bimestre 1", // Ex: Bimestre 1, Prova 2, Trabalho
        valor: 0,
    });

    // States de UI
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    // --- EFEITOS DE CARREGAMENTO INICIAL ---

    // 1. Carrega dados do usuário, turmas e matérias
    useEffect(() => {
        const userFromStorage = JSON.parse(localStorage.getItem("user")); // ou "usuario"
        if (userFromStorage) {
            setUser(userFromStorage);
        }

        async function carregarFiltros() {
            try {
                const token = localStorage.getItem("token");
                const [resTurmas, resMaterias] = await Promise.all([
                    api.get("/api/turmas", { headers: { Authorization: `Bearer ${token}` } }),
                    api.get("/api/materia/listar", { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                setTurmas(resTurmas.data);
                setMaterias(resMaterias.data);
            } catch (err) {
                setErro("Falha ao carregar filtros de turma e matéria.");
            }
        }
        carregarFiltros();
    }, []);

    // 2. Busca alunos da turma selecionada (para o FORMULÁRIO)
    useEffect(() => {
        if (!filtroTurma) {
            setAlunosDaTurma([]);
            setFormData((f) => ({ ...f, alunoId: "" })); // Reseta aluno no form
            return;
        }

        async function buscarAlunos() {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/api/turmas/${filtroTurma}/alunos`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlunosDaTurma(res.data);
            } catch (err) {
                setErro("Falha ao carregar alunos da turma selecionada.");
            }
        }
        buscarAlunos();
    }, [filtroTurma]); // Depende do filtro da turma

    // 3. Busca as NOTAS com base nos filtros (para a TABELA)
    const buscarNotasFiltradas = async () => {
        if (!filtroTurma || !filtroMateria) {
            setNotas([]); // Limpa a tabela se os filtros não estiverem completos
            return;
        }

        setLoading(true);
        setErro("");
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(
                `/api/notas?turmaId=${filtroTurma}&materiaId=${filtroMateria}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotas(res.data);
        } catch (err) {
            setErro("Falha ao carregar notas.");
        } finally {
            setLoading(false);
        }
    };

    // Chama a busca de notas quando os filtros mudam
    useEffect(() => {
        buscarNotasFiltradas();
    }, [filtroTurma, filtroMateria]);

    // --- FUNÇÕES DE FORMULÁRIO ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetarFormulario = () => {
        setMostrarFormulario(false);
        setEditando(null);
        setFormData({
            alunoId: "",
            materiaId: "",
            tipo: "Bimestre 1",
            valor: 0,
        });
    };

    // ===================================================================
    // ▼▼▼ CORREÇÃO APLICADA AQUI ▼▼▼
    // ===================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setMensagem("");

        const token = localStorage.getItem("token");

        // Este é o payload que a API espera (com turmaIdt)
        const dataPayload = {
            userId: Number(formData.alunoId),    // Da API: userId (que o prisma mapeia para alunoId)
            materiaId: Number(formData.materiaId), // Da API: materiaId
            tipo: formData.tipo,
            valor: parseFloat(formData.valor),
            turmaIdt: Number(filtroTurma),      // Da API: turmaIdt (vem do filtro da página)
        };

        try {
            if (editando) {
                // Modo Edição (PUT)
                await api.put(`/api/notas/${editando}`, dataPayload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMensagem("Nota atualizada com sucesso!");
            } else {
                // Modo Criação (POST)
                await api.post("/api/notas", dataPayload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMensagem("Nota cadastrada com sucesso!");
            }

            resetarFormulario();
            // Recarrega a tabela de notas
            buscarNotasFiltradas();

        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao salvar nota.");
        }
    };

    // ===================================================================
    // ▼▼▼ CORREÇÃO APLICADA AQUI ▼▼▼
    // ===================================================================
    const handleEditar = (nota) => {
        setEditando(nota.id);
        setFormData({
            alunoId: nota.alunoId, // Correção: A API envia 'alunoId'
            materiaId: nota.materiaId,
            tipo: nota.tipo,
            valor: nota.valor,
        });
        setMostrarFormulario(true);
        window.scrollTo(0, 0); // Rola para o topo onde está o form
    };

    const handleExcluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta nota?")) {
            try {
                const token = localStorage.getItem("token");
                await api.delete(`/api/notas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMensagem("Nota excluída com sucesso!");
                // Recarrega a tabela
                buscarNotasFiltradas();
            } catch (err) {
                setErro("Erro ao excluir nota.");
            }
        }
    };

    return (
        <div className="centro">
            {/* SIDEBAR */}
            <div className="sidebar">
                {/* ... (links da sidebar do diret) ... */}
                <a href="/Prof/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/Prof/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/Prof/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/Prof/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/Prof/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="#" className="active"><i className="fa-solid fa-note-sticky"></i> NOTAS</a>
                <a href="/Prof/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* Conteúdo */}
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{user.name}</strong>
                    </div>
                    <div className="icons">
                        <a href="/Prof/chat"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                {/* Corpo da Página */}
                <div className="notas-page-container">
                    <div className="notas-card">
                        <h2>Gestão de Notas</h2>
                        {erro && <div className="error">{erro}</div>}
                        {mensagem && <div className="success">{mensagem}</div>}

                        <button
                            className="btn-adicionar"
                            onClick={() => {
                                resetarFormulario();
                                setMostrarFormulario(!mostrarFormulario);
                            }}
                        >
                            {mostrarFormulario ? "Cancelar" : "Adicionar Nota"}
                        </button>

                        {/* --- FORMULÁRIO DE ADICIONAR/EDITAR --- */}
                        {mostrarFormulario && (
                            <form className="notas-form" onSubmit={handleSubmit}>
                                <label>Turma (Usada para carregar alunos)</label>
                                <select
                                    className="notas-select"
                                    value={filtroTurma}
                                    onChange={(e) => setFiltroTurma(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione a turma primeiro</option>
                                    {turmas.map((t) => (
                                        <option key={t.idt} value={t.idt}>{t.nome}</option>
                                    ))}
                                </select>

                                <label>Aluno</label>
                                <select
                                    name="alunoId"
                                    value={formData.alunoId}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!filtroTurma || alunosDaTurma.length === 0}
                                >
                                    <option value="">
                                        {filtroTurma ? "Selecione um aluno" : "Selecione uma turma acima"}
                                    </option>
                                    {alunosDaTurma.map((a) => (
                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                    ))}
                                </select>

                                <label>Matéria</label>
                                <select
                                    name="materiaId"
                                    value={formData.materiaId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecione a matéria</option>
                                    {materias.map((m) => (
                                        <option key={m.id} value={m.id}>{m.nome}</option>
                                    ))}
                                </select>

                                <label>Tipo da Nota (Ex: Prova 1, Média Final)</label>
                                <input
                                    type="text"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Bimestre 1"
                                    required
                                />

                                <label>Valor da Nota</label>
                                <input
                                    type="number"
                                    name="valor"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={formData.valor}
                                    onChange={handleInputChange}
                                    required
                                />

                                <div className="form-botoes">
                                    <button type="submit" className="btn-adicionar">
                                        {editando ? "Salvar Edição" : "Cadastrar Nota"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* --- TABELA DE NOTAS --- */}
                    <div className="notas-card">
                        <h2>Notas Lançadas</h2>
                        <div className="notas-filtros">
                            <select
                                className="notas-select"
                                value={filtroTurma}
                                onChange={(e) => setFiltroTurma(e.target.value)}
                            >
                                <option value="">Filtrar por Turma</option>
                                {turmas.map((t) => (
                                    <option key={t.idt} value={t.idt}>{t.nome}</option>
                                ))}
                            </select>
                            <select
                                className="notas-select"
                                value={filtroMateria}
                                onChange={(e) => setFiltroMateria(e.target.value)}
                            >
                                <option value="">Filtrar por Matéria</option>
                                {materias.map((m) => (
                                    <option key={m.id} value={m.id}>{m.nome}</option>
                                ))}
                            </select>
                        </div>

                        {loading && <p>Carregando notas...</p>}

                        {!loading && notas.length === 0 && (
                            <p>
                                {filtroTurma && filtroMateria
                                    ? "Nenhuma nota encontrada para esta seleção."
                                    : "Por favor, selecione uma turma e uma matéria para ver as notas."}
                            </p>
                        )}

                        {!loading && notas.length > 0 && (
                            <table className="notas-tabela">
                                <thead>
                                    <tr>
                                        <th>Aluno</th>
                                        <th>Tipo</th>
                                        <th>Nota</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                {/* =================================================================== */}
                                {/* ▼▼▼ CORREÇÃO APLICADA AQUI ▼▼▼ */}
                                {/* =================================================================== */}
                                <tbody>
                                    {notas.map((nota) => (
                                        <tr key={nota.id}>
                                            {/* Correção: A API agora envia 'aluno' */}
                                            <td>{nota.aluno.name}</td>
                                            <td>{nota.tipo}</td>
                                            <td>{nota.valor.toFixed(1)}</td>
                                            <td className="acao-botoes">
                                                <button className="btn-editar" onClick={() => handleEditar(nota)}>Editar</button>
                                                <button className="btn-excluir" onClick={() => handleExcluir(nota.id)}>Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}