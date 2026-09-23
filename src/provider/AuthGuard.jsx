import { Navigate, Outlet, useLocation } from "react-router-dom";

const ROUTE_PERMISSIONS = {
  "/dashboard": ["root"],
  "/agendamentos": ["root", "administracao", "professor", "aluno"],
  "/alunos": ["root", "administracao", "professor"],
  "/perfil": ["root", "administracao", "professor", "aluno"],
  "/condominios": ["root", "administracao", "professor"],
  "/funcionarios": ["root", "administracao"],
  "/servicos": ["root", "administracao"],
  "/pagamento": ["root", "administracao", "professor"],
  "/acesso-nao-autorizado": ["root", "administracao", "professor", "aluno"],
};

function normalizarCargo(cargo) {
  return String(cargo ?? "").trim().toLowerCase();
}

export default function AuthGuard() {
  const token = sessionStorage.getItem("token");
  const cargo = normalizarCargo(sessionStorage.getItem("cargo"));
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const permissoesNecessarias = ROUTE_PERMISSIONS[location.pathname];

  if (permissoesNecessarias && !permissoesNecessarias.includes(cargo)) {
    return <Navigate to="/acesso-nao-autorizado" replace />;
  }

  return <Outlet />;
}