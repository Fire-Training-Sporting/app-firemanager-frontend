import { Navigate, Outlet, useMatches } from "react-router-dom";
import { normalizarCargo } from "../utils/helpers";
export default function AuthGuard() {
  const token = sessionStorage.getItem("token");
  const cargo = normalizarCargo(sessionStorage.getItem("cargo"));
  const matches = useMatches();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // As permissões ficam na rota que o router de fato encontrou (handle.roles), não no
  // texto da URL: assim "/alunos/", "/ALUNOS" ou "/%61lunos" caem na mesma regra de "/alunos".
  // Rota sem roles definidas é bloqueada, para que uma rota nova nunca fique aberta por engano.
  const rotaAtual = matches[matches.length - 1];
  const permissoesNecessarias = rotaAtual?.handle?.roles;

  if (!permissoesNecessarias || !permissoesNecessarias.includes(cargo)) {
    return <Navigate to="/acesso-nao-autorizado" replace />;
  }

  return <Outlet />;
}
