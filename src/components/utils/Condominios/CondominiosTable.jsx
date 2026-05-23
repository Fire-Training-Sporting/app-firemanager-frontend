import { useState, useEffect } from 'react';
import { CondominiosRow } from './CondominiosRow.jsx';
import CondominiosTh from './CondominiosTh';

export function CondominiosTable({ condominios = [] }) {
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = condominios.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = condominios.slice(startIndex, endIndex);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-h-115 overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
          <thead className="sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">
              <CondominiosTh className="w-12">ID</CondominiosTh>
              <CondominiosTh>Nome</CondominiosTh>
              <CondominiosTh>CEP</CondominiosTh>
              <CondominiosTh>Rua</CondominiosTh>
              <CondominiosTh>Número</CondominiosTh>
              <CondominiosTh>Cidade</CondominiosTh>
              <CondominiosTh>Bairro</CondominiosTh>
              <CondominiosTh className="w-40">Ações</CondominiosTh>
            </tr>
          </thead>
          <tbody className="bg-white">
            {pageItems.length > 0 ? (
              pageItems.map((cond) => (
                <CondominiosRow key={cond.id} {...cond} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Nenhum condomínio encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
