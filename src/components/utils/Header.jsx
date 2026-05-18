import NavLink from "./NavLink";
import fireIcon from "../../assets/fireIcon.png";

const routeMap = {
  Agendamentos: "/agendamentos",
  Alunos: "/alunos",
  Funcionários: "/funcionarios",
  Condomínios: "/condominios",
  Serviços: "/servicos",
  Dashboard: "/dashboard",
  Perfil: "/alunos",
  Pagamento: "/pagamento",
};

export default function Header({ children }) {
  const role = sessionStorage.getItem("cargo");
  const usuarioString = sessionStorage.getItem("usuario");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  const navItems = (() => {
    switch (role) {
      case "root":
        return [
          "Agendamentos",
          "Alunos",
          "Funcionários",
          "Condomínios",
          "Serviços",
          "Dashboard",
        ];
      case "Professor":
        return ["Agendamentos", "Alunos", "Condomínios", "Pagamento"];
      case "Aluno":
        return ["Agendamentos", "Perfil"];
      default:
        return [];
    }
  })();

  return (
    <header className="w-full sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-[#23272F] flex justify-between items-center px-8 py-3">
        <div className="flex items-center gap-3">
          <img src={fireIcon} alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-semibold text-white tracking-wide">
            Fire Manager
          </span>
        </div>
        <span className="text-white text-base">
          Olá, {usuario?.nome ?? "usuário"}
        </span>
      </div>
      {/* Navigation bar */}
      <nav className="bg-[#F8821E] flex gap-2 px-8 py-2">
        {navItems.map((item) => (
          <NavLink key={item} to={routeMap[item]}>
            {item}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
