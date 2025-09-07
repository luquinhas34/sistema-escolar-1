import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "../login/login.css";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const res = await api.post("/api/login", { email, password });

      if (res.data && res.data.token && res.data.user) {
        // Salva token e usuário no localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const userRole = res.data.user.role.trim().toLowerCase();

        const roleRoutes = {
          aluno_vall: "/aluno/dash",
          prof_vall: "/prof/dash",
          adm_vall: "/admin/dash",
          resp_vall: "/resp/dash",
          diret_vall: "/diret/dash",
          cood_vall: "/cood/dash",
        };

        const route = roleRoutes[userRole];
        if (route) {
          navigate(route);
        } else {
          setError(`Função ${userRole} não reconhecida.`);
        }
      } else {
        setError("Erro ao autenticar: Token ou usuário inválido.");
      }
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || err.message
        : "Erro ao fazer login. Tente novamente.";
      setError(errorMessage);
    }
  }

  return (
    <div className="login-container">
      <div className="image-side"></div>
      <div className="form-side">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Acessar</h2>

          {error && <div className="bg-red-200 text-red-800 p-2 rounded mb-4">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">E-mail ou Telefone</label>
            <input
              ref={emailRef}
              type="text"
              id="email"
              placeholder="Digite seu e-mail ou telefone"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              ref={passwordRef}
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit">Acessar</button>

          <div className="signup-link">
            <Link to="/signup" className="info-login">
              Não tem uma conta? Cadastre-se!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
