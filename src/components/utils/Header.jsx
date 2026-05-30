import { useNavigate } from "react-router-dom";
import NavLink from "./NavLink";
import fireIcon from "../../assets/fireIcon.png";
import logoutIcon from "../../assets/logout.png";

const routeMap = {
  Agendamentos: "/agendamentos",
  Alunos: "/alunos",
  Funcionários: "/funcionarios",
  Condomínios: "/condominios",
  Serviços: "/servicos",
  Dashboard: "/dashboard",
  Perfil: "/alunos",
  Pagamentos: "/pagamento",
};

export default function Header() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("cargo");
  const usuarioString = sessionStorage.getItem("usuario");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cargo");
    sessionStorage.removeItem("usuario");
    navigate("/", { replace: true });
  }

  const navItems = (() => {
    switch (role) {
      case "root":
        return [
          "Agendamentos",
          "Alunos",
          "Funcionários",
          "Condomínios",
          "Serviços",
          "Pagamentos",
          "Dashboard",
        ];
      case "Administracao":
        return [
          "Agendamentos",
          "Alunos",
          "Funcionários",
          "Condomínios",
          "Serviços",
          "Pagamentos",
        ];
      case "Professor":
        return ["Agendamentos", "Alunos", "Condomínios", "Pagamentos"];
      case "Aluno":
        return ["Agendamentos", "Perfil"];
      default:
        return [];
    }
  })();

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-[#23272F] flex justify-between items-center px-8 py-3">
        <div className="flex items-center gap-3">
          <img src={fireIcon} alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-semibold text-white tracking-wide">
            Fire Manager
          </span>
        </div>
        <div className="flex items-center gap-3 text-white text-base">
          <span>Olá, {usuario?.nome ?? "usuário"}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Fazer logout"
            title="Fazer logout"
          >
            <img src={logoutIcon} alt="" className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
      {/* Navigation bar */}
      <nav className="bg-linear-to-r from-[#F8821E] to-[#EA580C] flex gap-2 px-8 py-2">
        {navItems.map((item) => (
          <NavLink key={item} to={routeMap[item]}>
            {item}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
