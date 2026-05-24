import { useState, useEffect } from "react";
import TableBase from '../TableBase';

export default function TabelaFuncionarios({ funcionarios = [], onEdit = () => {}, onDelete = () => {} }) {
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = funcionarios.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = funcionarios.slice(startIndex, endIndex);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const columns = [
    { label: 'ID', key: 'id', className: 'w-12 text-left' },
    { label: 'Nome', key: 'nome', className: 'text-left' },
    { label: 'Email', key: 'email', className: 'text-left' },
    { label: 'Telefone', key: 'telefone', className: 'text-left' },
    { label: 'Tipo', key: 'tipoUsuario', className: 'text-left', render: (row) => (row.tipoUsuario?.cargo || row.perfil || '') },
    {
      label: 'Ações',
      key: 'acoes',
      className: 'text-center w-40',
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button onClick={() => onEdit(row)} className="px-4 py-2 bg-[#2563EA] text-white text-xs font-medium rounded-md hover:bg-[#1E40AF] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Editar</button>
          <button onClick={() => onDelete(row)} className="px-4 py-2 bg-[#DC2625] text-white text-xs font-medium rounded-md hover:bg-[#B91C1C] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Excluir</button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <TableBase columns={columns} data={pageItems} />

      <div className="flex items-center justify-between gap-4 px-4 py-2 border-t bg-white">
        <div className="text-xs text-gray-600">
          Mostrando {Math.min(totalItems, startIndex + 1)}-{Math.min(totalItems, endIndex)} de {totalItems}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            Anterior
          </button>
          <div className="text-xs">
            Página {currentPage} de {totalPages}
          </div>
          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
