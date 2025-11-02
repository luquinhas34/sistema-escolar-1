import { useState, useEffect } from "react";
import axios from "axios";
import "../horario/style.css"; // Reutilizando seu CSS existente

export default function ProfessorHorarios() {
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState("");

    // Armazena os horários brutos vindos da API
    const [horarios, setHorarios] = useState([]);

    // Armazena os dados processados para a tabela
    const [horarioProcessado, setHorarioProcessado] = useState({});
    const [slotsDeTempo, setSlotsDeTempo] = useState([]);

    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [loadingHorarios, setLoadingHorarios] = useState(false);

    const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

    // 1. Carrega a lista de todas as turmas
    useEffect(() => {
        async function carregarTurmas() {
            try {
                const res = await axios.get("http://localhost:3000/api/turmas");
                setTurmas(res.data || []);
            } catch (err) {
                console.error("Erro ao carregar turmas:", err);
            }
            setLoadingTurmas(false);
        }
        carregarTurmas();
    }, []);

    // 2. Busca os horários da turma selecionada
    useEffect(() => {
        if (!turmaSelecionada) {
            setHorarios([]);
            return;
        }

        async function carregarHorarios() {
            setLoadingHorarios(true);
            try {
                // ATENÇÃO: Estou assumindo que existe um endpoint para buscar
                // horários por turma. Você precisará criar esta rota no seu backend.
                const res = await axios.get(
                    `http://localhost:3000/api/horario/turma/${turmaSelecionada}`
                );
                // Espera-se que a resposta seja um array de objetos Horario
                // e que a matéria venha populada (ex: { ... materia: { nome: "Matemática" } })
                setHorarios(res.data || []);
            } catch (err) {
                console.error("Erro ao carregar horários:", err);
                setHorarios([]);
            }
            setLoadingHorarios(false);
        }

        carregarHorarios();
    }, [turmaSelecionada]);

    // 3. Processa os dados brutos para preencher a tabela
    useEffect(() => {
        if (horarios.length === 0) {
            setHorarioProcessado({});
            setSlotsDeTempo([]);
            return;
        }

        const grid = {};
        const slots = new Set();

        // Popula a grid com os dados
        for (const aula of horarios) {
            if (!aula.horaInicio || !aula.horaFim || !aula.dia) continue;

            const slot = `${aula.horaInicio} - ${aula.horaFim}`;
            slots.add(slot);

            if (!grid[slot]) {
                grid[slot] = {};
                // Inicializa todos os dias da semana para este slot
                for (const dia of diasDaSemana) {
                    grid[slot][dia] = "";
                }
            }

            // Adiciona o nome da matéria na célula correta (dia e hora)
            grid[slot][aula.dia] = aula.materia ? aula.materia.nome : "N/A";
        }

        // Ordena os slots de tempo (linhas da tabela)
        const slotsOrdenados = [...slots].sort();

        setSlotsDeTempo(slotsOrdenados);
        setHorarioProcessado(grid);

    }, [horarios]); // Executa sempre que os horários da turma mudarem

    return (
        <div className="centro">
            {/* --- Sidebar do Professor ---
          Note que mudei os links de /cood/ para /prof/ 
          e marquei 'HORÁRIO' como ativo
      */}
            <div className="sidebar">
                <a href="/prof/dash">
                    <i className="fas fa-home"></i> INICIO
                </a>
                <a href="/prof/atividades">
                    <i className="fas fa-tasks"></i> ATIVIDADES
                </a>
                <a href="/prof/avaliacoes">
                    <i className="fas fa-clipboard-check"></i> AVALIAÇÕES
                </a>
                <a href="/prof/avisos">
                    <i className="fas fa-bell"></i> AVISOS
                </a>
                <a href="#" className="active">
                    <i className="fa-solid fa-clock"></i> HORÁRIO
                </a>
                <a href="/prof/notas">
                    <i className="fa-solid fa-note-sticky"></i> NOTAS
                </a>
                <a href="/prof/frequencia">
                    <i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA
                </a>
                {/* Removido links de Coodenador (Professor, Aluno, Turmas) */}
                <a href="/">
                    <i className="fas fa-sign-out-alt"></i> SAIR
                </a>
            </div>

            <div className="content">
                {/* --- Cabeçalho ---
            Mudei o link do chat para /prof/chat
        */}
                <div className="header">
                    <div className="welcome">
                        {/* O nome aqui deve vir do usuário logado */}
                        Olá, Bem-vindo <strong>Professor(a)</strong>
                    </div>
                    <div className="icons">
                        <a href="/prof/chat">
                            <i className="fas fa-envelope"></i>
                        </a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                {/* --- Conteúdo Principal --- */}
                <div className="horario-section">
                    <h2>Consultar Horário da Turma</h2>

                    <div className="horario-top-bar">
                        {/* Filtro único para selecionar a turma */}
                        <select
                            value={turmaSelecionada}
                            onChange={(e) => setTurmaSelecionada(e.target.value)}
                        >
                            <option value="">
                                {loadingTurmas ? "Carregando turmas..." : "Selecione uma turma"}
                            </option>
                            {turmas.map((t) => (
                                <option key={t.idt} value={t.idt.toString()}>
                                    {t.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* --- Tabela de Visualização --- */}
                    {loadingHorarios && <p>Carregando horários...</p>}

                    {!loadingHorarios && turmaSelecionada && slotsDeTempo.length === 0 && (
                        <p style={{ marginTop: '20px' }}>Nenhum horário cadastrado para esta turma.</p>
                    )}

                    {slotsDeTempo.length > 0 && (
                        <div className="horario-tabela-visualizacao">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Horário</th>
                                        {diasDaSemana.map(dia => <th key={dia}>{dia}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {slotsDeTempo.map(slot => (
                                        <tr key={slot}>
                                            <td>{slot}</td>
                                            {diasDaSemana.map(dia => (
                                                <td key={`${slot}-${dia}`}>
                                                    {horarioProcessado[slot][dia]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}