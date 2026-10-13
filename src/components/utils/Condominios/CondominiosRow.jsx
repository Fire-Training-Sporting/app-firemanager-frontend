
import editWhiteIcon from "../../../assets/edit_white.png";
import deleteWhiteIcon from "../../../assets/delete_white.png";

export function CondominiosRow({
  id,
  nome,
  cep,
  logradouro,
  rua,
  numero,
  cidade,
  bairro,
  onEdit = () => { },
  onDelete = () => { },
  showActions = true,
}) {

  return (

    <tr className="border-b border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-orange-100 transition-colors duration-150">

      <td className="px-4 py-3 text-sm text-gray-800 align-middle">
        {id}
      </td>

      <td className="px-4 py-3 text-sm text-gray-800 align-middle">
        {nome}
      </td>

      <td className="px-4 py-3 text-sm text-gray-800 align-middle">
        {cep}
      </td>

      <td className="px-4 py-3 text-sm text-gray-800 align-middle">
        {logradouro ?? rua}
      </td>

      <td className="px-4 py-3 text-sm text-gray-800 align-middle">
        {numero}
      </td>

      <td className="px-4 py-3 text-sm text-gray-800 align-middle">
        {cidade}
      </td>

      <td className="px-4 py-3 text-sm text-gray-800 align-middle">
        {bairro}
      </td>

      {showActions && (
      <td className="px-4 py-3 text-center align-middle">

        <div className="flex justify-center gap-2">

          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#2563EA] text-white text-xs font-medium rounded-md hover:bg-[#1E40AF] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
          >
            <img src={editWhiteIcon} alt="" className="h-4 w-4" />
            Editar
          </button>

          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#DC2625] text-white text-xs font-medium rounded-md hover:bg-[#B91C1C] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
          >
            <img src={deleteWhiteIcon} alt="" className="h-4 w-4" />
            Excluir
          </button>

        </div>

      </td>
      )}

    </tr>
  );
}