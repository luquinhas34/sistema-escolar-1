import { Outlet } from 'react-router-dom';

const Aluno = () => {
    return (
        <div>
            <Outlet /> {/* Renderiza as sub-rotas aqui */}
        </div>
    );
};

export default Aluno;
