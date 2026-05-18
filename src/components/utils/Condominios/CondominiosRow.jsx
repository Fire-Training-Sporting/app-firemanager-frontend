export function CondominiosRow({ id, nome, cep, rua, numero, cidade, bairro }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-[#F3F4F8] transition-colors duration-150">
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{id}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{nome}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{cep}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{rua}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{numero}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{cidade}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{bairro}</td>
      <td className="px-4 py-3 text-center align-middle">
        <div className="flex justify-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 shadow-sm transition-all">
            Editar
          </button>
          <button className="px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 shadow-sm transition-all">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  );
}