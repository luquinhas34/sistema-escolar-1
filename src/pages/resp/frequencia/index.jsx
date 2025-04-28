import { useState, useEffect } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../frequencia/style.css"




const Respfrenquencia = () => {
    const [setTurmas] = useState([]);  // Adicionando inicialização de turmas
    const [setAlunos] = useState([]);
    const [selectedTurma] = useState("");
    const [setPresencas] = useState([]);
    const [dataSelecionada] = useState(new Date());
    const [setDiarios] = useState([]);
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


    return (
        <div className="container">
            <div className="sidebar">
                <a href="/resp/dash" ><i className="fas fa-home"></i> INICIO</a>
                <a href="/resp/horario" ><i className="fa-solid fa-clock"></i> HORÁRIO</a>
                <a href="/resp/notas" ><i className="fa-solid fa-note-sticky"></i>NOTAS</a>
                <a href="#" className="active"><i className="fa-solid fa-calendar-days"></i> FREQUÊNCIA</a>
                <a href="/resp/avisos"><i className="fas fa-bell"></i> AVISOS</a>
                <a href="/"><i className="fas fa-sign-out-alt"></i> SAIR</a>
            </div>

            <div className="main-content">
                <div className="header">
                    <div className="welcome">Olá, Bem-vindo <strong>Carlos Pereira</strong></div>
                    <div className="icons">
                        <a href="/resp/chat" className="active"><i className="fas fa-envelope"></i></a>
                        <div className="user">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>




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

export default Respfrenquencia;
