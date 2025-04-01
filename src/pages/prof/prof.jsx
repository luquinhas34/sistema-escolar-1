import { Outlet } from 'react-router-dom';

const Prof = () => {
  return (
    <div>
      <h1>Profissional</h1>
      <Outlet /> {/* Renderiza as sub-rotas aqui */}
    </div>
  );
};

export default Prof;
