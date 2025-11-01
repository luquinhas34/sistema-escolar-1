import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/adm";
import Admcadastro from "./pages/cadastro";




import Cood from "./pages/cood/cood.jsx";
import CoodDash from "./pages/cood/dash";
import CoodActive from "./pages/cood/atividades"
import CoodAvali from "./pages/cood/avaliacoes"
import CoodAviso from "./pages/cood/avisos"
import CadastroAluno from "./pages/cood/alunos"
import CadastroProfessor from "./pages/cood/professor"
import Frequenciacood from "./pages/cood/frequencia"
import TurmasCood from "./pages/cood/turmas"
import NotasCodd from "./pages/cood/notas"
import Coodhorario from "./pages/cood/horario"

// coordenador

// Diretor
import Diretor from "./pages/diretor/Diretor.jsx";
import DiretorDash from "./pages/diretor/dash";
import DiretorActive from "./pages/diretor/atividades"
import DiretorAvali from "./pages/diretor/avaliacoes"
import DiretorAviso from "./pages/diretor/avisos"
import DiretorCadastroAluno from "./pages/diretor/alunos"
import DiretorCadastroProfessor from "./pages/diretor/professor"
import DiretorFrequencia from "./pages/diretor/frequencia"
import DiretorTurmas from "./pages/diretor/turmas"
import DiretorNotas from "./pages/diretor/notas"
import Diretorhorario from "./pages/diretor/horario"
// Diretor

// Aluno
import Aluno from "./pages/aluno/aluno.jsx";
import AlunoDash from "./pages/aluno/dash";
import AlunoActive from "./pages/aluno/atividades"
import AlunoAvali from "./pages/aluno/avaliacoes"
import AlunoAviso from "./pages/aluno/avisos"
import AlunoNotas from "./pages/aluno/notas"
import AlunoFrequencia from "./pages/aluno/frequencia"
import Alunohorario from "./pages/aluno/horario"
// Aluno
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Diretor */}
        <Route path="/diret" element={<Diretor />}>
          <Route path="dash" element={<DiretorDash />} />
          <Route path="atividades" element={<DiretorActive />} />
          <Route path="avaliacoes" element={<DiretorAvali />} />
          <Route path="avisos" element={<DiretorAviso />} />
          <Route path="/diret/aluno" element={<DiretorCadastroAluno />} />
          <Route path="/diret/professor" element={<DiretorCadastroProfessor />} />
          <Route path="/diret/frequencia" element={<DiretorFrequencia />} />
          <Route path="/diret/Turmas" element={<DiretorTurmas />} />
          <Route path="/diret/Notas" element={<DiretorNotas />} />
          <Route path="horario" element={<Diretorhorario />} />
        </Route>
        {/* Diretor */}

        <Route path="/cood" element={<Cood />}>
          <Route path="atividades" element={<CoodActive />} />
          <Route path="horario" element={<Coodhorario />} />
          <Route path="dash" element={<CoodDash />} />
          <Route path="avaliacoes" element={<CoodAvali />} />
          <Route path="avisos" element={<CoodAviso />} />
          <Route path="/cood/aluno" element={<CadastroAluno />} />
          <Route path="/cood/professor" element={<CadastroProfessor />} />
          <Route path="/cood/frequencia" element={<Frequenciacood />} />
          <Route path="/cood/Turmas" element={<TurmasCood />} />
          <Route path="/cood/Notas" element={<NotasCodd />} />
        </Route>


        <Route path="/aluno" element={<Aluno />}>
          <Route path="dash" element={<AlunoDash />} />
          <Route path="atividades" element={<AlunoActive />} />
          <Route path="avaliacoes" element={<AlunoAvali />} />
          <Route path="avisos" element={<AlunoAviso />} />
          <Route path="horario" element={<Alunohorario />} />
          <Route path="frequencia" element={<AlunoFrequencia />} />
          <Route path="/aluno/Notas" element={<AlunoNotas />} />
        </Route>

        <Route path="/Admin" element={<Admin />} />




        <Route path="/admcadastro" element={<Admcadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
