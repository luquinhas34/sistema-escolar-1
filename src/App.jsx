import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/adm";
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
import ChatInicioProf from "./pages/prof/chat/inicio/index";
import ChatPageProf from "./pages/prof/chat/conversa/ChatPage";
// Professor


// Responsavel
import RespNotas from "./pages/resp/notas"
import Resphome from "./pages/resp/dash"
import RespHorario from "./pages/resp/horario"
import Respaviso from "./pages/resp/avisos"
import Respfrequencia from "./pages/resp/frequencia"
import ChatPagerespinicio from "./pages/resp/chat/inicio"
import ChatPageresp from "./pages/resp/chat/conversa"
// Responsavel

// Aluno
import Aluno from "./pages/aluno/aluno.jsx";
import AlunoDash from "./pages/aluno/dash";
import AlunoActive from "./pages/aluno/atividades"
import AlunoAvali from "./pages/aluno/avaliacoes"
import AlunoAviso from "./pages/aluno/avisos"
import AlunoDiario from "./pages/aluno/diarios"
import ChatPage from "./pages/aluno/chat/conversa"
import ChatInicio from "./pages/aluno/chat/inicio"


// Aluno

// coordenador

import Cood from "./pages/cood/cood.jsx";
import CoodDash from "./pages/cood/dash";
import CoodActive from "./pages/cood/atividades"
import CoodAvali from "./pages/cood/avaliacoes"
import CoodAviso from "./pages/cood/avisos"
import CoodDiario from "./pages/cood/diarios"
import Coodhora from "./pages/cood/horario"
import ChatPage1 from "./pages/cood/chat/conversa"
import ChatInicio1 from "./pages/cood/chat/inicio"
import CadastroAluno from "./pages/cood/alunos"
import CadastroProfessor from "./pages/cood/professor"

// coordenador

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
          <Route path="Notas" element={<RespNotas />} />
          <Route path="dash" element={<Resphome />} />
          <Route path="Horario" element={<RespHorario />} />
          <Route path="avisos" element={<Respaviso />} />
          <Route path="frequencia" element={<Respfrequencia />} />
          <Route path="/resp/chat" element={<ChatPagerespinicio />} />
          <Route path="/resp/chat/:id" element={<ChatPageresp />} />
        </Route>









        <Route path="/aluno" element={<Aluno />}>
          <Route path="atividades" element={<AlunoActive />} />
          <Route path="dash" element={<AlunoDash />} />
          <Route path="avaliacoes" element={<AlunoAvali />} />
          <Route path="avisos" element={<AlunoAviso />} />
          <Route path="diarios" element={<AlunoDiario />} />
          <Route path="/aluno/chat" element={<ChatInicio />} />
          <Route path="/aluno/chat/:id" element={<ChatPage />} />
        </Route>










        <Route path="/cood" element={<Cood />}>
          <Route path="atividades" element={<CoodActive />} />
          <Route path="dash" element={<CoodDash />} />
          <Route path="avaliacoes" element={<CoodAvali />} />
          <Route path="avisos" element={<CoodAviso />} />
          <Route path="diarios" element={<CoodDiario />} />
          <Route path="horario" element={<Coodhora />} />
          <Route path="/cood/aluno" element={<CadastroAluno />} />
          <Route path="/cood/professor" element={<CadastroProfessor />} />
          <Route path="/cood/chat" element={<ChatInicio1 />} />
          <Route path="/cood/chat/:id" element={<ChatPage1 />} />

        </Route>


        <Route path="/Admin" element={<Admin />} />
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
