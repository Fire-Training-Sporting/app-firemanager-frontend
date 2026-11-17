import { AgendamentosRow } from "./AgendamentosRow";
import AgendamentosTh from "./AgendamentosTh";
import leftBlackIcon from "../../../assets/left_black.png";
import rightBlackIcon from "../../../assets/right_black.png";

export function AgendamentosTable({
  agendamentos = [],
  onViewDetails,
  currentPage = 0,
  totalPages = 0,
  totalElements = 0,
  isLoading = false,
  onPageChange,
}) {
  const totalPagesExibidas = Math.max(1, totalPages);
  const goPrev = () => onPageChange?.(currentPage - 1);
  const goNext = () => onPageChange?.(currentPage + 1);

  return (
    <div className="w-full overflow-x-auto">
      <div className="h-fit max-h-[calc(100vh-360px)] lg:max-h-[calc(100vh-264px)] overflow-y-auto">
        <table className="w-full border-separate border-spacing-0">
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
            </tr>
          </thead>
          <tbody className="bg-white">
            {agendamentos.length > 0 ? (
              agendamentos.map((agendamento) => (
                <AgendamentosRow
                  key={agendamento.id}
                  {...agendamento}
                  onViewDetails={() => onViewDetails(agendamento)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-2 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-600">
          {totalElements} agendamentos no total
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentPage === 0 || isLoading}
            className={`inline-flex items-center px-3 py-1 text-sm leading-5 rounded-md border border-gray-300 ${currentPage === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
            <img src={leftBlackIcon} alt="" className="-ml-1.5 h-4 w-4 shrink-0" />
            Anterior
          </button>
          <div className="text-xs">
            Página {currentPage + 1} de {totalPagesExibidas}
          </div>
          <button
            onClick={goNext}
            disabled={currentPage >= totalPages - 1 || totalPages === 0 || isLoading}
            className={`inline-flex items-center px-3 py-1 text-sm leading-5 rounded-md border border-gray-300 ${currentPage >= totalPages - 1 || totalPages === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
            Próxima
            <img src={rightBlackIcon} alt="" className="-mr-1.5 h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
