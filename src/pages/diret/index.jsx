import React, { useState, useEffect } from "react";
import axios from "axios";
import '../diret/diretor.css'; // Importando o CSS

const Turmas = () => {
    const [turmas, setTurmas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosTurma, setUsuariosTurma] = useState([]); // Para armazenar os usuários de uma turma específica
    const [selectedTurma, setSelectedTurma] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // Para o carregamento de dados

    // Carregar as turmas
    useEffect(() => {
        setLoading(true); // Inicia o carregamento
        axios
            .get("http://localhost:3000/api/turmas")
            .then((response) => setTurmas(response.data))
            .catch((error) => console.error("Erro ao carregar turmas:", error))
            .finally(() => setLoading(false)); // Finaliza o carregamento
    }, []);

    // Carregar usuários disponíveis
    useEffect(() => {
        axios
            .get("http://localhost:3000/api/usuarios")
            .then((response) => setUsuarios(response.data))
            .catch((error) => console.error("Erro ao carregar usuários:", error));
    }, []);

    // Carregar usuários de uma turma selecionada
    const handleTurmaSelect = (turmaId) => {
        setSelectedTurma(turmaId);
        setLoading(true); // Inicia o carregamento
        axios
            .get(`http://localhost:3000/api/turmas/${turmaId}/usuarios`)
            .then((response) => {
                setUsuariosTurma(response.data); // Atualiza os usuários da turma
                setUsuarios(response.data); // Atualiza os usuários gerais para associar
            })
            .catch((error) => console.error("Erro ao carregar usuários da turma:", error))
            .finally(() => setLoading(false)); // Finaliza o carregamento
    };

    // Associar um usuário a uma turma
    const handleAddUserToTurma = () => {
        if (!selectedTurma || !selectedUser) {
            setMessage("Por favor, selecione uma turma e um usuário.");
            return;
        }

        setLoading(true); // Para mostrar o carregamento

        axios.post(`http://localhost:3000/api/turmas/${selectedTurma}/usuarios`, { userId: Number(selectedUser) })
            .then(response => {
                console.log("Usuário adicionado!", response);
            })
            .catch(error => {
                console.error("Erro ao adicionar usuário:", error);
            });

    };


    return (
        <div className="turmas">
            <h2>Gestão de Turmas</h2>

            {loading ? <p>Carregando...</p> : (
                <>
                    <div className="turmas-list">
                        <h3>Turmas</h3>
                        <ul>
                            {turmas.map((turma) => (
                                <li
                                    key={turma.id}
                                    onClick={() => handleTurmaSelect(turma.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {turma.nome}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {selectedTurma && (
                        <div className="usuarios-list">
                            <h3>Usuários na Turma</h3>
                            <ul>
                                {usuariosTurma.map((usuario) => (
                                    <li key={usuario.id}>{usuario.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="associar-usuario">
                        <h3>Adicionar Usuário a Turma</h3>
                        <select
                            onChange={(e) => setSelectedUser(e.target.value)}
                            value={selectedUser || ""} // Use uma string vazia como fallback
                        >
                            <option value="">Selecione um usuário</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.name}
                                </option>
                            ))}
                        </select>

                        <button className="butao" onClick={handleAddUserToTurma}>Adicionar Usuário</button>

                        {message && <p>{message}</p>}
                    </div>
                </>
            )}
        </div>
    );
};

export default Turmas;
