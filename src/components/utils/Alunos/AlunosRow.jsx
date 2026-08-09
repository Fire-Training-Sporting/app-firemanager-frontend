export function AlunosRow({
  id,
  nome,
  email,
  telefone,
  endereco,
  saldosPorServico = {},
  onDelete = () => {},
  onEdit = () => {},
  onAddSaldo = () => {},
  showContato = true,
  showActions = true,
  showSaldos = true,
}) {

  const saldoTenis = saldosPorServico["Tênis"] ?? 0;
  const saldoBeachTennis = saldosPorServico["Beach Tennis"] ?? 0;
  const saldoFuncional = saldosPorServico["Funcional"] ?? 0;

  return (
    <tr className="border-b border-gray-200 hover:bg-[#F3F4F8] transition-colors duration-150">

      <td className="px-4 py-3 text-gray-800 font-normal text-sm align-middle w-12">
        {id}
      </td>

      <td className="px-4 py-3 text-gray-800 font-normal text-sm align-middle">
        {nome}
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

      {showSaldos && (
        <>
          <td className="px-4 py-3 text-gray-800 font-semibold text-sm align-middle">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
              {saldoTenis}
            </span>
          </td>

          <td className="px-4 py-3 text-gray-800 font-semibold text-sm align-middle">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-orange-800">
              {saldoBeachTennis}
            </span>
          </td>

          <td className="px-4 py-3 text-gray-800 font-semibold text-sm align-middle">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
              {saldoFuncional}
            </span>
          </td>
        </>
      )}

      {showActions && (
        <td className="px-4 py-3 text-center align-middle">
          <div className="flex justify-center gap-2">

            <button
              onClick={(event) => {
                event.stopPropagation();
                onAddSaldo();
              }}
              className="px-4 py-2 bg-[#16A34A] text-white text-xs font-medium rounded-md hover:bg-[#15803D] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              Saldo
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="px-4 py-2 bg-[#2563EA] text-white text-xs font-medium rounded-md hover:bg-[#1E40AF] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              Editar
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="px-4 py-2 bg-[#DC2625] text-white text-xs font-medium rounded-md hover:bg-[#B91C1C] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              Excluir
            </button>

          </div>
        </td>
      )}

    </tr>
  );
}