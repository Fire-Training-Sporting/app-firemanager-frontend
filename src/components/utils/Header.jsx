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

export default function Header({children}){
    return (
        <header className="">
            <div className={`h-fit ${colors.bg.gray} flex justify-between items-center pl-8 pr-8 pb-4 pt-4`}>
                <div className="flex items-center gap-4">
                    <img src={fireIcon} alt="Logo" className="w-16 h-16"/>
                    <h1 className="text-4xl text-white font-bold">FireManager</h1>
                </div>
                <h1 className="text-2xl text-white font-bold">Olá, Bruno</h1>
            </div>
            <nav className={`${colors.bg.darkOrange} w-full h-fit flex p-4 gap-4`}>
                <NavLink>Início</NavLink>
                <NavLink>Agendamentos</NavLink>
                <NavLink>Alunos</NavLink>
                <NavLink>Funcionários</NavLink>
                <NavLink>Dashboard</NavLink>
            </nav>
        </header>
    )
} 