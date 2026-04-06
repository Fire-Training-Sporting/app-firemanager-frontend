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

export function AlunosRow({ nome, email, telefone, endereco }){
    return(
        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150">
            <td className="px-6 py-4 text-gray-800 font-medium text-sm">{nome}</td>
            <td className="px-6 py-4 text-gray-600 text-sm">{email}</td>
            <td className="px-6 py-4 text-gray-600 text-sm">{telefone}</td>
            <td className="px-6 py-4 text-gray-600 text-sm">{endereco}</td>
            <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                <button className={`px-4 py-2 ${colors.bg.blue} text-white text-xs font-medium rounded-md hover:${colors.hoverBg.blue} shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer`}>
                    Editar
                </button>
                <button className={`px-4 py-2 ${colors.bg.red} text-white text-xs font-medium rounded-md hover:${colors.hoverBg.red} shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer`}>
                    Deletar
                </button>
            </td>
        </tr>
    )
}