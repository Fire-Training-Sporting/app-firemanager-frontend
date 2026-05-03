import NavLink from "./NavLink";
import fireIcon from "../../assets/fireIcon.png";

const colors = {
  bg: {
    gray: "bg-[#4F4F4F]",
    darkGray: "bg-[#363636]",
    orange: "bg-[#F99A4D]",
    darkOrange: "bg-[#F8821E]",
    white: "bg-[#F3F4F8]",
    green: "bg-[#17A34A]",
    red: "bg-[#DC2625]",
    blue: "bg-[#2563EA]",
    yellow: "bg-[#E9B308]",
  },
  text: {
    red: "text-[#DC2625]",
    blue: "text-[#2563EA]",
    green: "text-[#17A34A]",
    gray: "text-[#4F4F4F]",
  },
  hoverBg: {
    red: "hover:bg-[#B91C1C]",      
    blue: "hover:bg-[#1E40AF]",     
    green: "hover:bg-[#166534]",    
    orange: "hover:bg-[#EA580C]",   
    gray: "hover:bg-[#2E2E2E]",     
    yellow: "hover:bg-[#CA8A04]",   
  },
  hoverText: {
    red: "hover:text-[#B91C1C]",
  }
};

export default function Header({ children }) {
  // Simulação de item ativo (exemplo: "Alunos"), pode ser ajustado conforme a rota
  const active = "Alunos";
  const navItems = [
    "Início",
    "Agendamentos",
    "Alunos",
    "Funcionários",
    "Serviços",
    "Dashboard"
  ];
  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-[#23272F] flex justify-between items-center px-8 py-3">
        <div className="flex items-center gap-3">
          <img src={fireIcon} alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-semibold text-white tracking-wide">Fire Manager</span>
        </div>
        <span className="text-white text-base">Olá, Bruno</span>
      </div>
      {/* Navigation bar */}
      <nav className="bg-[#F8821E] flex gap-2 px-8 py-2">
        {navItems.map((item) => (
          <button
            key={item}
            className={`px-6 py-1 rounded-md font-medium text-white text-base transition-all duration-150 ${
              active === item
                ? 'bg-[#B85B12] shadow-inner' // ativo
                : 'hover:bg-[#EA580C] bg-transparent'
            }`}
            style={{ outline: 'none', border: 'none' }}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}