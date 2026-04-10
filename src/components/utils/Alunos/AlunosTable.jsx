import { AlunosRow } from './AlunosRow'

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

export function AlunosTable(){
    return(
        <div className="w-full overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-stone-800 border-b-2">
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Nome</th>
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Email</th>
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Telefone</th>
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Endereço</th>
                        <th className="px-6 py-4 text-center font-semibold text-white text-md">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <AlunosRow nome="João Silva" email="joao@email.com" telefone="(11) 98765-4321" endereco="Rua das Flores, 123"/>
                    <AlunosRow nome="Maria Santos" email="maria@email.com" telefone="(11) 99876-5432" endereco="Av. Principal, 456"/>
                    <AlunosRow nome="Pedro Costa" email="pedro@email.com" telefone="(11) 98765-4321" endereco="Rua das Flores, 789"/>
                    <AlunosRow nome="Ana Paula" email="ana@email.com" telefone="(11) 98765-4321" endereco="Rua das Rosas, 101"/>
                </tbody>
            </table>
        </div>
    )
}