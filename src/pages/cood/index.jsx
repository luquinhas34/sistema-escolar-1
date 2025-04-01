import React, { useState } from 'react';
import axios from 'axios';
import "../cood/cood.css"

const CriarTurma = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação simples
        if (!nome || !descricao) {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(''); // Limpar mensagem de erro anterior

        try {
            await axios.post('http://localhost:3000/api/turmas', { nome, descricao });
            alert('Turma criada com sucesso!');
            setNome('');
            setDescricao('');
        } catch (error) {
            console.error(error);
            setErrorMessage('Erro ao criar a turma. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nome da Turma:
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </label>
            <label>
                Descrição da Turma:
                <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
            </label>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar Turma'}
            </button>
        </form>
    );
};

export default CriarTurma;
