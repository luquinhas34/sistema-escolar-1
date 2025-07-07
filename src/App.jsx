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
import Notasprof from "./pages/prof/notas";
import Freqprof from "./pages/prof/frequencia";
// Professor


// Responsavel
import RespNotas from "./pages/resp/notas"
import Resphome from "./pages/resp/dash"
import RespHorario from "./pages/resp/horario"
import Respaviso from "./pages/resp/avisos"
import Respfrequencia from "./pages/resp/frequencia"
// Responsavel

// Aluno
import Aluno from "./pages/aluno/aluno.jsx";
import AlunoDash from "./pages/aluno/dash";
import AlunoActive from "./pages/aluno/atividades"
import AlunoAvali from "./pages/aluno/avaliacoes"
import AlunoAviso from "./pages/aluno/avisos"
import AlunoDiario from "./pages/aluno/diarios"


// Aluno

// coordenador

import Cood from "./pages/cood/cood.jsx";
import CoodDash from "./pages/cood/dash";
import CoodActive from "./pages/cood/atividades"
import CoodAvali from "./pages/cood/avaliacoes"
import CoodAviso from "./pages/cood/avisos"
import CoodDiario from "./pages/cood/diarios"
import CadastroAluno from "./pages/cood/alunos"
import CadastroProfessor from "./pages/cood/professor"
import Frequenciacood from "./pages/cood/frequencia"
import TurmasCood from "./pages/cood/turmas"
import NotasCodd from "./pages/cood/notas"

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
          <Route path="notas" element={<Notasprof />} />
          <Route path="frequencia" element={<Freqprof />} />
        </Route>







        <Route path="/resp" element={<Resp />}>
          <Route path="Notas" element={<RespNotas />} />
          <Route path="dash" element={<Resphome />} />
          <Route path="Horario" element={<RespHorario />} />
          <Route path="avisos" element={<Respaviso />} />
          <Route path="frequencia" element={<Respfrequencia />} />
        </Route>









        <Route path="/aluno" element={<Aluno />}>
          <Route path="atividades" element={<AlunoActive />} />
          <Route path="dash" element={<AlunoDash />} />
          <Route path="avaliacoes" element={<AlunoAvali />} />
          <Route path="avisos" element={<AlunoAviso />} />
          <Route path="diarios" element={<AlunoDiario />} />
        </Route>










        <Route path="/cood" element={<Cood />}>
          <Route path="atividades" element={<CoodActive />} />
          <Route path="dash" element={<CoodDash />} />
          <Route path="avaliacoes" element={<CoodAvali />} />
          <Route path="avisos" element={<CoodAviso />} />
          <Route path="diarios" element={<CoodDiario />} />
          <Route path="/cood/aluno" element={<CadastroAluno />} />
          <Route path="/cood/professor" element={<CadastroProfessor />} />

          <Route path="/cood/frequencia" element={<Frequenciacood />} />
          <Route path="/cood/Turmas" element={<TurmasCood />} />
          <Route path="/cood/Notas" element={<NotasCodd />} />
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
