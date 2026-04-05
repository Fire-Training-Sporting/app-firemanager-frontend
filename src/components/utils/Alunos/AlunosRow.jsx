export function AlunosRow({ nome, email, telefone, endereco }){
    return(
        <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150">
            <td className="px-6 py-4 text-gray-800 font-medium text-sm">{nome}</td>
            <td className="px-6 py-4 text-gray-600 text-sm">{email}</td>
            <td className="px-6 py-4 text-gray-600 text-sm">{telefone}</td>
            <td className="px-6 py-4 text-gray-600 text-sm">{endereco}</td>
            <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                <button className="px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">
                    Editar
                </button>
                <button className="px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">
                    Deletar
                </button>
            </td>
        </tr>
    )
}