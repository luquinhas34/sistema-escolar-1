import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/adm";
import Cood from "./pages/cood/index";
import Diret from "./pages/diret";
import Admcadastro from "./pages/cadastro";

import Resp from "./pages/resp/resp.jsx";



// Professor
import ProfAtive from "./pages/prof/atividades";
import ProfDash from "./pages/prof/dash";
import Prof from "./pages/prof/Prof";
import Profaviso from "./pages/prof/avisos";
import ProfAvaliacoes from "./pages/prof/avaliacoes";
import DiarioChamada from "./pages/prof/diarios";
import ChatInicioProf from "./pages/prof/chat.prof/inicio/index";
import ChatPageProf from "./pages/prof/chat.prof/conversa/ChatPage";
// Professor


// Responsavel
import RespActive from "./pages/resp/atividades"
import Resphome from "./pages/resp/dash"
import Respavaliacoes from "./pages/resp/avaliacoes"
import Respaviso from "./pages/resp/avisos"
import Respdiario from "./pages/resp/diarios"
import ChatPagerespinicio from "./pages/resp/chat.resp/inicio"
import ChatPageresp from "./pages/resp/chat.resp/conversa/ChatPage.jsx"
// Responsavel

// Aluno
import Aluno from "./pages/aluno/aluno.jsx";
import AlunoDash from "./pages/aluno/dash";
import AlunoActive from "./pages/aluno/atividades"
import AlunoAvali from "./pages/aluno/avaliacoes"
import AlunoAviso from "./pages/aluno/avisos"
import AlunoDiario from "./pages/aluno/diarios"
import Alunochatinicio from "./pages/aluno/chat.resp/inicio"
import Alunochatconv from "./pages/aluno/chat.resp/conversa"

// Aluno

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/prof" element={<Prof />}>
          <Route path="atividades" element={<ProfAtive />} />
          <Route path="dash" element={<ProfDash />} />
          <Route path="avaliacoes" element={<ProfAvaliacoes />} />
          <Route path="avisos" element={<Profaviso />} />
          <Route path="diarios" element={<DiarioChamada />} />
          <Route path="/prof/chat" element={<ChatInicioProf />} />
          <Route path="/prof/chat/:id" element={<ChatPageProf />} />
        </Route>

        <Route path="/resp" element={<Resp />}>
          <Route path="atividades" element={<RespActive />} />
          <Route path="dash" element={<Resphome />} />
          <Route path="avaliacoes" element={<Respavaliacoes />} />
          <Route path="avisos" element={<Respaviso />} />
          <Route path="diarios" element={<Respdiario />} />
          <Route path="/resp/chat" element={<ChatPagerespinicio />} />
          <Route path="/resps/chat/:id" element={<ChatPageresp />} />
        </Route>

        <Route path="/aluno" element={<Aluno />}>
          <Route path="atividades" element={<AlunoActive />} />
          <Route path="dash" element={<AlunoDash />} />
          <Route path="avaliacoes" element={<AlunoAvali />} />
          <Route path="avisos" element={<AlunoAviso />} />
          <Route path="diarios" element={<AlunoDiario />} />
          <Route path="/resp/chat" element={<Alunochatinicio />} />
          <Route path="/resps/chat/:id" element={<Alunochatconv />} />
        </Route>


        <Route path="/Admin" element={<Admin />} />
        <Route path="/Cood" element={<Cood />} />
        <Route path="/Diret" element={<Diret />} />

        <Route path="/aluno" element={<Aluno />}>
          <Route path="dash" element={<AlunoDash />} />
        </Route>

        <Route path="/admcadastro" element={<Admcadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
