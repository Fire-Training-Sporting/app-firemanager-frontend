import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavLink from "./NavLink";
import fireIcon from "../../assets/fireIcon.png";
import logoutIcon from "../../assets/logout.png";
import agendamentosIcon from "../../assets/agendamentos.png";
import alunosIcon from "../../assets/alunos.png";
import funcionariosIcon from "../../assets/funcionarios.png";
import condominiosIcon from "../../assets/condominios.png";
import servicosIcon from "../../assets/servicos.png";
import pagamentosIcon from "../../assets/pagamentos.png";
import dashboardIcon from "../../assets/dashboard.png";
import perfilIcon from "../../assets/perfil.png";

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

const iconMap = {
  Agendamentos: agendamentosIcon,
  Alunos: alunosIcon,
  Funcionários: funcionariosIcon,
  Condomínios: condominiosIcon,
  Serviços: servicosIcon,
  Dashboard: dashboardIcon,
  Pagamentos: pagamentosIcon,
  Perfil: perfilIcon,
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
    <>
    {/* Sidebar (desktop) */}
    <aside className="app-sidebar fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-[#F8821E] shadow-lg lg:flex">
      <div className="flex items-center gap-3 bg-[#23272F] px-5 py-4">
        <img src={fireIcon} alt="Logo" className="h-8 w-8" />
        <span className="text-lg font-semibold tracking-wide text-white">Fire Manager</span>
      </div>

      <div className="border-b border-white/20 px-5 py-4 text-white">
        <span className="block truncate font-semibold" title={usuario?.nome ?? "usuário"}>
          Olá, {usuario?.nome ?? "usuário"}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink key={item} to={routeMap[item]} icon={iconMap[item]}>
            {item}
          </NavLink>
        ))}
      </nav>

      <div className="bg-[#23272F] px-5 py-4 text-sm text-white">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-white/20 bg-white/10 pl-[11px] pr-[13px] py-1.5 text-sm font-medium transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Fazer logout"
          title="Fazer logout"
        >
          <img src={logoutIcon} alt="" className="h-[18px] w-[18px] shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </aside>

    {/* Topo (mobile/tablet) */}
    <header className="w-full lg:hidden">
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
      <nav className="relative bg-[#F8821E] px-4 py-2 sm:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-semibold text-white hover:bg-[#EA580C]"
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
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full z-50 max-h-[60vh] flex-col gap-2 overflow-x-hidden overflow-y-auto bg-[#F8821E] p-4 shadow-lg custom-scrollbar`}
        >
          {navItems.map((item) => (
            <NavLink key={item} to={routeMap[item]} icon={iconMap[item]} onClick={() => setMenuOpen(false)}>
              {item}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
    </>
  );
}
