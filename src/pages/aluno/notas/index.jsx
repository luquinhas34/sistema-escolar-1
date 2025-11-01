import { useEffect, useState } from "react";
import api from "../../../services/api"; // Usando o 'api'
import "./style.css"; // Reutilizando o mesmo CSS

export default function AlunoNotas() {
    const [notas, setNotas] = useState([]);
    const [user, setUser] = useState({ name: "Aluno" });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let alunoId = null;

        // 1. Pega o usuário do localStorage
        const userFromStorage = JSON.parse(localStorage.getItem("user"));
        if (userFromStorage) {
            setUser(userFromStorage);
            alunoId = userFromStorage.id; // 2. Pega o ID do aluno logado
        }

        if (!alunoId) {
            setErro("Não foi possível identificar o aluno. Faça login novamente.");
            setLoading(false);
            return;
        }

        // 3. Busca as notas específicas desse aluno
        async function buscarMinhasNotas() {
            setLoading(true);
            setErro("");
            try {
                const token = localStorage.getItem("token");
                // 4. Chama a API de aluno (que o back-end agora tem)
                const res = await api.get(`/api/notas/aluno/${alunoId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotas(res.data);
            } catch (err) {
                setErro("Falha ao carregar suas notas.");
            } finally {
                setLoading(false);
            }
        }

        buscarMinhasNotas();
    }, []); // Executa apenas uma vez na montagem

    return (
        <div className="centro">
            {/* SIDEBAR DO ALUNO */}
            <div className="sidebar">
                <a href="/aluno/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/aluno/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/aluno/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/aluno/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="#" className="active"><i className="fa-solid fa-note-sticky"></i> NOTAS</a>
                <a href="/aluno/frequencia"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            {/* Conteúdo */}
            <div className="content">
                <div className="header">
                    <div className="welcome">
                        {/* Nome dinâmico do aluno */}
                        Olá, Bem-vindo <strong>{user.name}</strong>
                    </div>
                    <div className="icons">
                        <a href="/aluno/chat"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                {/* Corpo da Página */}
                <div className="notas-page-container">
                    <div className="notas-card">
                        <h2>Minhas Notas</h2>

                        {erro && <div className="error">{erro}</div>}
                        {loading && <p>Carregando notas...</p>}

                        {!loading && notas.length === 0 && (
                            <p>Nenhuma nota lançada para você até o momento.</p>
                        )}

                        {/* A tabela de notas do aluno */}
                        {!loading && notas.length > 0 && (
                            <table className="notas-tabela">
                                <thead>
                                    <tr>
                                        <th>Matéria</th>
                                        <th>Tipo da Nota</th>
                                        <th>Nota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notas.map((nota) => (
                                        <tr key={nota.id}>
                                            {/* A API do aluno (GET /api/notas/aluno/:id)
                          deve incluir o nome da matéria */}
                                            <td>{nota.materia?.nome || "Matéria não informada"}</td>
                                            <td>{nota.tipo}</td>
                                            <td>{nota.valor.toFixed(1)}</td>
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