import TableBase from '../TableBase';

export default function TabelaFuncionarios({
  funcionarios = [],
  onEdit = () => {},
  onDelete = () => {},
  currentPage = 0,
  totalPages = 0,
  totalItems = 0,
  isLoading = false,
  onPageChange = () => {},
}) {
  const showActions = sessionStorage.getItem("cargo") !== "Professor";
  const totalPagesExibidas = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : currentPage * 10 + 1;
  const endItem = Math.min(totalItems, (currentPage + 1) * 10);

  const columns = [
    { label: 'ID', key: 'id', className: 'w-12 text-left' },
    { label: 'Nome', key: 'nome', className: 'text-left' },
    { label: 'Email', key: 'email', className: 'text-left' },
    { label: 'Telefone', key: 'telefone', className: 'text-left' },
    { label: 'Tipo', key: 'tipoUsuario', className: 'text-left', render: (row) => (row.tipoUsuario?.cargo || row.perfil || '') },
  ];

  if (showActions) {
    columns.push({
      label: 'Ações',
      key: 'acoes',
      className: 'text-center w-40',
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button onClick={() => onEdit(row)} className="px-4 py-2 bg-[#2563EA] text-white text-xs font-medium rounded-md hover:bg-[#1E40AF] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Editar</button>
          <button onClick={() => onDelete(row)} className="px-4 py-2 bg-[#DC2625] text-white text-xs font-medium rounded-md hover:bg-[#B91C1C] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Excluir</button>
        </div>
      ),
    });
  }

  return (
    <div className="w-full">
      <TableBase
        columns={columns}
        data={funcionarios}
        wrapperClassName="w-full overflow-x-auto"
        tableClassName="w-full min-w-[900px] table-fixed"
      />

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
