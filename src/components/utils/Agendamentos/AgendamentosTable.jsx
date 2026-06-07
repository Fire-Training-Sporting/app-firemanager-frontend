import { useState, useEffect } from "react";
import { AgendamentosRow } from "./AgendamentosRow";
import AgendamentosTh from "./AgendamentosTh";

export function AgendamentosTable({ agendamentos = [], onEdit, onConfirm, onDelete, onViewDetails }) {
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const showActions = sessionStorage.getItem("cargo") !== "Professor";

  const totalItems = agendamentos.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = agendamentos.slice(startIndex, endIndex);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Reset page if data changed and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="h-fit max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b-2 border-gray-200">
              <AgendamentosTh>ID</AgendamentosTh>
              <AgendamentosTh>Aluno</AgendamentosTh>
              <AgendamentosTh>Data</AgendamentosTh>
              <AgendamentosTh>Hora Início</AgendamentosTh>
              <AgendamentosTh>Hora Fim</AgendamentosTh>
              <AgendamentosTh>Condomínio</AgendamentosTh>
              <AgendamentosTh>Professor</AgendamentosTh>
              <AgendamentosTh>Rebatedor</AgendamentosTh>
              <AgendamentosTh>Auxiliar</AgendamentosTh>
              <AgendamentosTh>Status</AgendamentosTh>
              {showActions && <AgendamentosTh className="w-40">Ações</AgendamentosTh>}
            </tr>
          </thead>
          <tbody className="bg-white">
            {pageItems.length > 0 ? (
              pageItems.map((agendamento) => (
                <AgendamentosRow
                  key={agendamento.id}
                  {...agendamento}
                  onEdit={() => onEdit(agendamento)}
                  onConfirm={() => onConfirm(agendamento)}
                  onDelete={() => onDelete(agendamento.id)}
                  onViewDetails={() => onViewDetails(agendamento)}
                  showActions={showActions}
                />
              ))
            ) : (
              <tr>
                <td colSpan={showActions ? 11 : 10} className="p-4 text-center text-gray-500">
                  Nenhum agendamento encontrado.
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
            className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
            Anterior
          </button>
          <div className="text-xs">
            Página {currentPage} de {totalPages}
          </div>
          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
