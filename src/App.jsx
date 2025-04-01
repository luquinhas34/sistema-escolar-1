import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/adm";
import Cood from "./pages/cood/index";
import Diret from "./pages/diret";
import Resp from "./pages/resp";
import Aluno from "./pages/aluno";
import Admcadastro from "./pages/cadastro";
import ProfAtive from "./pages/prof/atividades";
import ProfDash from "./pages/prof/dash";
import Prof from "./pages/prof/Prof";
import Tt from "./pages/testes";
import Profaviso from "./pages/prof/avisos";
import ProfAvaliacoes from "./pages/prof/avaliacoes";
import DiarioChamada from "./pages/prof/diarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rota para Prof com sub-rotas */}
        <Route path="/prof" element={<Prof />}>
          <Route path="atividades" element={<ProfAtive />} />
          <Route path="dash" element={<ProfDash />} />
          <Route path="avaliacoes" element={<ProfAvaliacoes />} />
          <Route path="avisos" element={<Profaviso />} />
          <Route path="diarios" element={<DiarioChamada />} />
        </Route>

        <Route path="/Admin" element={<Admin />} />
        <Route path="/Cood" element={<Cood />} />
        <Route path="/Diret" element={<Diret />} />
        <Route path="/Resp" element={<Resp />} />
        <Route path="/Aluno" element={<Aluno />} />
        <Route path="/teste" element={<Tt />} />
        <Route path="/admcadastro" element={<Admcadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
