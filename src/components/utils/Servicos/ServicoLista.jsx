import { useState, useEffect } from 'react';
import TableBase from '../TableBase';
import { BtnBlue } from '../Buttons/BtnBlue';
import { BtnRed } from '../Buttons/BtnRed';

export default function ServicoLista({ servicos = [] }) {
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = servicos.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = servicos.slice(startIndex, endIndex);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const colunas = [
    {
      key: 'nome',
      label: 'Serviço',
      className: 'text-left',
      style: { width: '100%' },
    },
    {
      key: 'acoes',
      label: 'Ações',
      className: 'text-left whitespace-nowrap',
      style: { width: '35%' },
      tdClassName: 'text-left whitespace-nowrap',
      render: () => (
        <div className="flex justify-between items-center gap-2 whitespace-nowrap">
          <BtnBlue content="Editar" />
          <BtnRed content="Excluir" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <TableBase columns={colunas} data={pageItems} wrapperClassName="w-full" tableClassName="w-full table-fixed" />

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