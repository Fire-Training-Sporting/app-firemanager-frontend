import { useState } from "react";
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
  Perfil: "/perfil",
  Pagamentos: "/pagamento",
};

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="bg-[#23272F] flex flex-nowrap justify-between items-center gap-2 px-4 py-3 sm:gap-3 sm:px-8">
        <div className="flex items-center gap-3">
          <img src={fireIcon} alt="Logo" className="w-8 h-8" />
          <span className="hidden text-base font-semibold tracking-wide text-white sm:inline sm:text-lg">
            Fire Manager
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
          <span className="max-w-[150px] truncate sm:max-w-none">Olá, {usuario?.nome ?? "usuário"}</span>
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
      <nav className="relative bg-linear-to-r from-[#F8821E] to-[#EA580C] px-4 py-2 sm:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-semibold text-white hover:bg-[#EA580C] lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          <span>Menu</span>
          <span className="flex flex-col gap-1" aria-hidden="true">
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </span>
        </button>
        <div
          id="main-navigation"
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full z-50 max-h-[60vh] flex-col gap-2 overflow-x-hidden overflow-y-auto bg-linear-to-r from-[#F8821E] to-[#EA580C] p-4 shadow-lg custom-scrollbar lg:static lg:flex lg:max-h-none lg:flex-row lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {navItems.map((item) => (
            <NavLink key={item} to={routeMap[item]} onClick={() => setMenuOpen(false)}>
              {item}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
