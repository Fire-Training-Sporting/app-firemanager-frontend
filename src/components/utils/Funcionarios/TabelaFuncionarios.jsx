export default function TabelaFuncionarios({
  funcionarios = [],
  onEdit = () => {},
  onDelete = () => {},
  onDetails = () => {},
  currentPage = 0,
  totalPages = 0,
  totalItems = 0,
  isLoading = false,
  onPageChange = () => {},
}) {
  const totalPagesExibidas = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : currentPage * 10 + 1;
  const endItem = Math.min(totalItems, (currentPage + 1) * 10);

  return (
    <div className="w-full overflow-x-auto">
      <div className="h-fit max-h-[calc(100vh-300px)] overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-md">
          <thead className="sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">
              <th className="px-4 py-3 font-semibold text-gray-800 text-md bg-gray-200 w-12 text-left">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-800 text-md bg-gray-200 text-left">Nome</th>
              <th className="px-4 py-3 font-semibold text-gray-800 text-md bg-gray-200 text-left">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-800 text-md bg-gray-200 text-left">Telefone</th>
              <th className="px-4 py-3 font-semibold text-gray-800 text-md bg-gray-200 text-left">Tipo</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {funcionarios.length > 0 ? (
              funcionarios.map((funcionario) => (
                <tr
                  key={funcionario.id}
                  className="border-b border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-orange-100 transition-colors duration-150 cursor-pointer"
                  onClick={() => onDetails(funcionario)}
                >
                  <td className="px-4 py-3 text-sm align-middle">{funcionario.id}</td>
                  <td className="px-4 py-3 text-sm align-middle">{funcionario.nome}</td>
                  <td className="px-4 py-3 text-sm align-middle">{funcionario.email}</td>
                  <td className="px-4 py-3 text-sm align-middle">{funcionario.telefone}</td>
                  <td className="px-4 py-3 text-sm align-middle">{funcionario.tipoUsuario?.cargo || funcionario.perfil}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 px-4 py-2 border-t bg-white sm:flex-row sm:items-center">
        <div className="text-xs text-gray-600">
          Mostrando {startItem}-{endItem} de {totalItems}
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0 || isLoading}
            className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            Anterior
          </button>
          <div className="text-xs">
            Página {currentPage + 1} de {totalPagesExibidas}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={totalPages === 0 || currentPage >= totalPages - 1 || isLoading}
            className={`px-2 py-0.5 text-sm rounded-md border ${totalPages === 0 || currentPage >= totalPages - 1 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
