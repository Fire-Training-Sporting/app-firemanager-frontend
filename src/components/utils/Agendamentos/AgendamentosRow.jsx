export function AgendamentosRow({ data, horario, quadra, prof, reba, aux, status }) {
  const statusStyle = {
    Confirmada: "bg-green-100 text-green-700",
    Pendente: "bg-yellow-100 text-yellow-700",
    Cancelada: "bg-red-100 text-red-700",
  }[status] || "bg-gray-100 text-gray-700";

  return (
    <tr className="border-b border-gray-200 hover:bg-[#F3F4F8] transition-colors duration-150">
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{data}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{horario}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{quadra}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{prof}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{reba}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{aux}</td>
      <td className="px-4 py-2 text-sm font-semibold align-middle">
        <span className={`px-3 py-1 rounded-full ${statusStyle}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <div className="flex justify-center gap-2">
          <button className="px-4 py-2 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 shadow-sm transition-all">
            Confirmar
          </button>
          <button className="px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 shadow-sm transition-all">
            Cancelar
          </button>
        </div>
      </td>
    </tr>
  );
}
