import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../frequencia/style.css"; // Reutilizando o mesmo CSS

function AlunoFrequencia() {
    const [user, setUser] = useState({ name: "Aluno" });
    const [mesAtual, setMesAtual] = useState(new Date().getMonth());
    const [anoAtual] = useState(new Date().getFullYear());
    const [minhasPresencas, setMinhasPresencas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const [modalVisivel, setModalVisivel] = useState(false);
    const [diaClicado, setDiaClicado] = useState(null);
    const [dadosDiaSelecionado, setDadosDiaSelecionado] = useState([]);

    // --- NOVOS STATES PARA OS TOTAIS ---
    const [totalPresencas, setTotalPresencas] = useState(0);
    const [totalFaltas, setTotalFaltas] = useState(0);

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    useEffect(() => {
        const userFromStorage = JSON.parse(localStorage.getItem("user"));
        let alunoId = null;

        if (userFromStorage) {
            setUser(userFromStorage);
            alunoId = userFromStorage.id;
        } else {
            setErro("Não foi possível identificar o aluno. Faça login.");
            setLoading(false);
            return;
        }

        async function buscarMinhaFrequencia() {
            setLoading(true);
            setErro("");
            // Reseta os totais antes de buscar
            setTotalPresencas(0);
            setTotalFaltas(0);
            const mesFormatado = String(mesAtual + 1).padStart(2, "0");

            try {
                const token = localStorage.getItem("token");
                const res = await api.get(
                    `/api/frequencia/aluno/${alunoId}?mes=${mesFormatado}&ano=${anoAtual}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log("LOG 1: Dados recebidos da API:", res.data);
                setMinhasPresencas(res.data);

                // --- CALCULA OS TOTAIS AQUI ---
                let presencasCount = 0;
                let faltasCount = 0;
                res.data.forEach(registro => {
                    if (registro.status === "PRESENCA") {
                        presencasCount++;
                    } else if (registro.status === "FALTA") {
                        faltasCount++;
                    }
                });
                setTotalPresencas(presencasCount);
                setTotalFaltas(faltasCount);
                // --- FIM DO CÁLCULO ---

            } catch (err) {
                setErro("Erro ao carregar sua frequência.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        buscarMinhaFrequencia();
    }, [mesAtual, anoAtual]);


    // Substitua a função getStatusDoDia antiga por esta:
    const getStatusDoDia = (dia) => {
        const dataISO = `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        // 1. Pega TODOS os registros do dia
        const registros = minhasPresencas.filter(p => p.data.startsWith(dataISO));

        // Se não houver registros, o dia fica sem cor
        if (registros.length === 0) {
            return null;
        }

        // 2. Conta presenças e faltas
        let presencasCount = 0;
        let faltasCount = 0;
        registros.forEach(registro => {
            if (registro.status === "PRESENCA") {
                presencasCount++;
            } else if (registro.status === "FALTA") {
                faltasCount++;
            }
        });

        // 3. Compara os totais e decide a cor
        if (faltasCount > presencasCount) {
            return "FALTA"; // Mais faltas -> Vermelho
        } else if (presencasCount > faltasCount) {
            return "PRESENCA"; // Mais presenças -> Verde
        } else {
            // Empate: Priorizamos a falta (dia fica vermelho)
            // Se preferir verde no empate, mude para "PRESENCA"
            return "FALTA";
        }
    };

    const handleDiaClick = (dia) => {
        console.log(`LOG 2: Clique no dia ${dia}`);
        const dataISO = `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const registrosDoDia = minhasPresencas.filter(p => p.data.startsWith(dataISO));
        console.log(`LOG 3: Registros encontrados para o dia ${dia}:`, registrosDoDia);

        if (registrosDoDia.length === 0) {
            console.log("LOG 4: Nenhum registro, modal NÃO será aberto.");
            return;
        }

        console.log("LOG 4: Registros encontrados. Abrindo modal...");
        setDadosDiaSelecionado(registrosDoDia);
        setDiaClicado(dia);
        setModalVisivel(true);
    };


    const renderDias = () => {
        const dias = new Date(anoAtual, mesAtual + 1, 0).getDate();
        const elementos = [];
        const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
        const offset = (primeiroDiaSemana === 0) ? 6 : primeiroDiaSemana - 1;
        for (let i = 0; i < offset; i++) {
            elementos.push(<div key={`offset-${i}`} className="calendario-dia empty"></div>);
        }

        for (let i = 1; i <= dias; i++) {
            const status = getStatusDoDia(i);
            let classes = "calendario-dia";
            if (status === "PRESENCA") classes += " dia-presente";
            else if (status === "FALTA") classes += " dia-falta";
            if (status) classes += " clickable";

            elementos.push(
                <div key={i} className={classes} onClick={() => handleDiaClick(i)}>
                    {i}
                </div>
            );
        }
        return elementos;
    };

    return (
        <div className="centro">
            {/* ... (Sidebar e Header) ... */}
            <div className="sidebar">
                <a href="/aluno/dash"><i className="fas fa-home"></i> INICIO</a>
                <a href="/aluno/atividades"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/aluno/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="/aluno/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/aluno/horario"><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/aluno/notas"><i className="fa-solid fa-note-sticky"></i> NOTAS</a>
                <a href="#" className="active"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            <div className="content">
                <div className="header">
                    <div className="welcome">
                        Olá, Bem-vindo <strong>{user.name}</strong>
                    </div>
                    <div className="icons">
                        <a href="/aluno/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user"><i className="fas fa-user-circle"></i></div>
                    </div>
                </div>

                <h1 className="frequencia-title">Minha Frequência</h1>
                {erro && <div className="error">{erro}</div>}

                <div className="frequencia-card">
                    <div className="calendario-header">
                        <h3>{anoAtual}</h3>
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
                    <div className="calendario-semana">
                        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                            <div key={dia} className="calendario-semana-dia">{dia}</div>
                        ))}
                    </div>
                    {loading ? (
                        <p style={{ padding: '20px' }}>Carregando frequência...</p>
                    ) : (
                        <div className="calendario-grid">{renderDias()}</div>
                    )}
                </div>

                {/* Legenda */}
                <div className="frequencia-legenda">

                </div>

                {/* --- NOVA SEÇÃO DE RESUMO --- */}
                {!loading && (
                    <div className="frequencia-resumo">
                        <h3>Resumo do Mês ({meses[mesAtual]})</h3>
                        <p>Total de Presenças: <span className="total-presente">{totalPresencas}</span></p>
                        <p>Total de Faltas: <span className="total-falta">{totalFaltas}</span></p>
                    </div>
                )}
                {/* --- FIM DA NOVA SEÇÃO --- */}

            </div>

            {/* Modal */}
            {modalVisivel && (
                <div className="modal-overlay" onClick={() => setModalVisivel(false)}>
                    {/* ... (Conteúdo do Modal continua igual) ... */}
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        <h2>Frequência do Dia {diaClicado} de {meses[mesAtual]}</h2>

                        <div className="frequencia-lista-modal">
                            {dadosDiaSelecionado.length === 0 ? (
                                <p>Nenhum registro encontrado para este dia.</p>
                            ) : (
                                dadosDiaSelecionado.map((registro) => (
                                    <div key={registro.id} className="frequencia-item-modal">
                                        <span>
                                            {registro.materia || 'Geral'}
                                            ({registro.chamadaNome})
                                        </span>
                                        <span
                                            className={
                                                registro.status === 'FALTA'
                                                    ? 'status-falta'
                                                    : 'status-presente'
                                            }
                                        >
                                            {registro.status === 'PRESENCA' ? 'Presente' : 'Falta'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => setModalVisivel(false)}
                            className="frequencia-btn-fechar"
                        >
                            Fechar
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

export default AlunoFrequencia;