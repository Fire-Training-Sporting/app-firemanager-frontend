import NavLink from "./NavLink";
import fireIcon from "../../assets/fireIcon.png";

export default function Header({children}){
    return (
        <header className="">
            <div className="h-fit bg-stone-700 flex justify-between items-center pl-8 pr-8 pb-4 pt-4">
                <div className="flex items-center gap-4">
                    <img src={fireIcon} alt="Logo" className="w-16 h-16"/>
                    <h1 className="text-4xl text-white font-bold">FireManager</h1>
                </div>
                <h1 className="text-2xl text-white font-bold">Olá, Bruno</h1>
            </div>
            <nav className="bg-orange-500 w-full h-fit flex p-4 gap-4">
                <NavLink>Início</NavLink>
                <NavLink>Agendamentos</NavLink>
                <NavLink>Alunos</NavLink>
                <NavLink>Funcionários</NavLink>
                <NavLink>Dashboard</NavLink>
            </nav>
        </header>
    )
} 