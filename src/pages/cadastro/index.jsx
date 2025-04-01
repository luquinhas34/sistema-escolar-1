import { useRef } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"

function Admcadastro() {

    const nameRaf = useRef()
    const emailRaf = useRef()
    const passwordRaf = useRef()
    const roleRaf = useRef()

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            await api.post('/api/cadastro', {
                name: nameRaf.current.value,
                email: emailRaf.current.value,
                password: passwordRaf.current.value,
                role: roleRaf.current.value
            })
            alert("Cadastrado com sucesso")
        } catch (err) {
            console.error("Erro ao cadastrar:", err.response ? err.response.data : err.message);
            alert("Erro ao cadastrar. Veja o console para mais detalhes.");
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg Shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastro</h2>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <input ref={nameRaf} placeholder="Nome" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none" />
                <input ref={emailRaf} placeholder="Email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none" />
                <input ref={passwordRaf} placeholder="Senha" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none" />
                <select name="Select" ref={roleRaf}>
                    <option value="prof_vall">Professor</option>
                    <option value="aluno_vall" selected>Aluno</option>
                    <option value="adm_vall">Administrador</option>
                    <option value="diret_vall">Diretor</option>
                    <option value="cood_vall">Coordenador</option>
                    <option value="resp_vall">Responsável</option>
                </select>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">Cadastra-se</button>
            </form>
            <Link to={"/login"} className="text-blue-700 hover:underline mt-4 block text-center">Já tem conta? Faça Login!</Link>

        </div>
    )

}

export default Admcadastro
