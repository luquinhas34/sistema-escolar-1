import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DiarioDePresenca = () => {
    const [turmas, setTurmas] = useState([]);  // Adicionando inicialização de turmas
    const [alunos, setAlunos] = useState([]);
    const [selectedTurma, setSelectedTurma] = useState("");
    const [presencas, setPresencas] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [diarios, setDiarios] = useState([]);
    const [chamadaDaTurma, setChamadaDaTurma] = useState(null);

    // Obtendo turmas
    useEffect(() => {
        const fetchTurmas = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/turmas", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                if (response.status === 200 && Array.isArray(response.data)) {
                    setTurmas(response.data);
                }
            } catch (error) {
                console.error("Erro ao carregar turmas:", error);
            }
        };
        fetchTurmas();
    }, []);

    useEffect(() => {
        const fetchAlunos = async () => {
            if (!selectedTurma) return;

            try {
                const response = await axios.get(
                    `http://localhost:3000/api/turmas/${selectedTurma}/usuarios`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                );

                if (response.status === 200 && Array.isArray(response.data)) {
                    console.log("Alunos:", response.data); // Verifique se o nome está no objeto
                    setAlunos(response.data);
                    setPresencas(
                        response.data.map((aluno) => ({
                            alunoId: aluno.id,
                            nome: aluno.nome,  // Confirme se o nome do aluno está aqui
                            status: "presenca",
                        }))
                    );
                }
            } catch (error) {
                console.error("Erro ao carregar alunos:", error);
            }
        };

        fetchAlunos();
    }, [selectedTurma]);

    useEffect(() => {
        if (selectedTurma) {
            const fetchDiarios = async () => {
                try {
                    const diariosResponse = await axios.get(
                        `http://localhost:3000/api/turmas/${selectedTurma}/presencas`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                            },
                        }
                    );
                    if (diariosResponse.status === 200 && Array.isArray(diariosResponse.data)) {
                        setDiarios(diariosResponse.data);
                        filterDiariosByDate(diariosResponse.data, dataSelecionada);
                    }
                } catch (error) {
                    console.error("Erro ao carregar diários:", error);
                }
            };
            fetchDiarios();
        }
    }, [selectedTurma, dataSelecionada]);

    const handleTurmaChange = async (e) => {
        const turmaId = Number(e.target.value);
        setSelectedTurma(turmaId);
        setAlunos([]);
        setPresencas([]);
        setChamadaDaTurma(null); // Limpar as chamadas da turma ao mudar a turma

        if (!turmaId) return;

        try {
            const response = await axios.get(
                `http://localhost:3000/api/turmas/${turmaId}/usuarios`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            if (response.status === 200 && Array.isArray(response.data)) {
                setAlunos(response.data);
                setPresencas(
                    response.data.map((aluno) => ({
                        alunoId: aluno.id,
                        nome: aluno.nome,
                        status: "presenca",
                    }))
                );
            }
        } catch (error) {
            console.error("Erro ao carregar alunos:", error);
        }
    };

    const handlePresencaChange = (alunoId, status) => {
        setPresencas((prev) =>
            prev.map((p) =>
                p.alunoId === alunoId ? { ...p, status } : p
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedTurma) {
            alert("Por favor, selecione uma turma.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("Token não encontrado. Faça login novamente.");
                return;
            }

            const userId = localStorage.getItem("userId");
            if (!userId || isNaN(Number(userId))) {
                alert("Usuário não identificado. Faça login novamente.");
                return;
            }

            const dataToSend = {
                presencas: presencas.map((p) => ({
                    nome: alunos.find((a) => a.id === p.alunoId)?.nome || "Desconhecido",
                    materia: "Matemática",
                    userId: Number(localStorage.getItem("userId")),
                    alunoId: p.alunoId,
                    status: p.status,
                    data: dataSelecionada.toISOString(),
                    turmaNome: turmas.find((t) => t.id === selectedTurma)?.nome || "Turma Desconhecida",
                })),
            };

            try {
                const response = await axios.post(
                    `http://localhost:3000/api/turmas/${selectedTurma}/presencas`,
                    dataToSend,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // Atualizar a lista de diários após o sucesso no envio
                setDiarios((prevDiarios) => [...prevDiarios, ...dataToSend.presencas]);
                // Refiltrar os diários após adicionar
                filterDiariosByDate([...diarios, ...dataToSend.presencas], dataSelecionada);
            } catch (error) {
                console.error("Erro ao registrar presenças:", error.response?.data || error.message);
            }

            alert("Presenças registradas com sucesso!");
        } catch (error) {
            console.error("Erro ao registrar presenças:", error.response?.data || error.message);
            alert("Erro ao registrar presenças");
        }
    };

    const filterDiariosByDate = (diariosData, selectedDate) => {
        const filteredDiarios = diariosData.filter((diario) => {
            const diarioDate = new Date(diario.data);
            return (
                diarioDate.getDate() === selectedDate.getDate() &&
                diarioDate.getMonth() === selectedDate.getMonth() &&
                diarioDate.getFullYear() === selectedDate.getFullYear()
            );
        });
        setChamadaDaTurma(filteredDiarios);
    };

    const handleTurmaClick = (turmaId) => {
        // Filtrar diários para a turma específica e data
        const diariosParaTurma = diarios.filter((diario) => diario.turmaId === turmaId);
        setChamadaDaTurma(diariosParaTurma);
    };

    return (
        <div className="container">
            <div className="sidebar">
                <a href="/prof/dash" ><i className="fas fa-home"></i> INICIO</a>
                <a href="/prof/atividade"><i className="fas fa-tasks"></i> ATIVIDADES</a>
                <a href="/prof/avaliacoes"><i className="fas fa-clipboard-check"></i> AVALIAÇÕES</a>
                <a href="#" className="active"><i className="fas fa-book"></i> DIARIOS</a>
                <a href="/prof/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            <div className="main-content">
                <div className="header">
                    <div className="welcome">Olá, Bem-vindo <strong>Carlos Pereira</strong></div>
                    <div className="icons">
                        <i className="fas fa-envelope"></i>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label>Selecionar Turma:</label>
                        <select value={selectedTurma} onChange={handleTurmaChange} required>
                            <option value="">Selecione uma turma</option>
                            {turmas.map((turma) => (
                                <option key={turma.id} value={turma.id}>
                                    {turma.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Selecionar Data:</label>
                        <DatePicker
                            selected={dataSelecionada}
                            onChange={setDataSelecionada}
                            dateFormat="dd/MM/yyyy"
                            className="datepicker"
                        />
                    </div>

                    {alunos.length > 0 && (
                        <div className="alunos-section">
                            <h3>Alunos da Turma:</h3>
                            {alunos.map((aluno) => {
                                const presenca = presencas.find((p) => p.alunoId === aluno.id);
                                return (
                                    <div key={aluno.id} className="aluno-card">
                                        <span>{aluno.nome}</span>
                                        <div className="presenca-options">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`presenca-${aluno.id}`}
                                                    value="presenca"
                                                    checked={presenca?.status === "presenca"}
                                                    onChange={() => handlePresencaChange(aluno.id, "presenca")}
                                                />
                                                Presente
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`presenca-${aluno.id}`}
                                                    value="falta"
                                                    checked={presenca?.status === "falta"}
                                                    onChange={() => handlePresencaChange(aluno.id, "falta")}
                                                />
                                                Falta
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <button type="submit" className="submit-button">Registrar Presença</button>
                </form>




                <h3>Chamadas Registradas para a Turma:</h3>
                {chamadaDaTurma && chamadaDaTurma.length > 0 ? (
                    <ul>
                        {chamadaDaTurma.map((diario, index) => (
                            <li key={index}>
                                <strong>{diario.nome}</strong> - {diario.status}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Não há chamadas registradas para esta turma na data selecionada.</p>
                )}
            </div>
        </div>
    );
};

export default DiarioDePresenca;
