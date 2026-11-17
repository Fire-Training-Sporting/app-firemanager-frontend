import StatusUsuarioBadge from "../Usuarios/StatusUsuarioBadge";

export function AlunosRow({
  id,
  nome,
  email,
  telefone,
  endereco,
  arquivado = false,
  onDetails = () => {},
  showContato = true,
}) {

  return (
    <tr
      className="border-b border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-orange-100 transition-colors duration-150 cursor-pointer"
      onClick={onDetails}
    >

      <td className="px-4 py-3 text-gray-800 font-normal text-sm align-middle w-12">
        {id}
      </td>

      <td className="px-4 py-3 text-gray-800 font-normal text-sm align-middle">
        <span className="inline-flex flex-wrap items-center gap-2">
          {nome}
          {arquivado && <StatusUsuarioBadge arquivado size="sm" />}
        </span>
      </td>

      {showContato && (
        <>
          <td className="px-4 py-3 text-gray-700 font-normal text-sm align-middle">
            {email}
          </td>

          <td className="px-4 py-3 text-gray-700 font-normal text-sm align-middle">
            {telefone}
          </td>
        </>
      )}

      <td className="px-4 py-3 text-gray-700 font-normal text-sm align-middle">
        {endereco}
      </td>

    </tr>
  );
}