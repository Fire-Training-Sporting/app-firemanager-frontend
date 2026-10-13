import { CondominiosRow } from './CondominiosRow.jsx';
import CondominiosTh from './CondominiosTh';

export function CondominiosTable({
  condominios = [],
  onEdit = () => { },
  onDelete = () => { },
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

  return (
    <div className="w-full overflow-x-auto">

      <div className="max-h-115 overflow-y-auto">

        <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">

          <thead className="sticky top-0 z-10">

            <tr className="border-b-2 border-gray-200">

              <CondominiosTh className="w-12">
                ID
              </CondominiosTh>

              <CondominiosTh>
                Nome
              </CondominiosTh>

              <CondominiosTh>
                CEP
              </CondominiosTh>

              <CondominiosTh>
                Logradouro
              </CondominiosTh>

              <CondominiosTh>
                Número
              </CondominiosTh>

              <CondominiosTh>
                Cidade
              </CondominiosTh>

              <CondominiosTh>
                Bairro
              </CondominiosTh>

              {showActions && (
                <CondominiosTh className="w-40">
                  Ações
                </CondominiosTh>
              )}

            </tr>

          </thead>

          <tbody className="bg-white">

            {condominios.length > 0 ? (

              condominios.map((cond) => (

                <CondominiosRow
                  key={cond.id}
                  {...cond}
                  onEdit={() => onEdit(cond)}
                  onDelete={() => onDelete(cond)}
                  showActions={showActions}
                />

              ))

            ) : (

              <tr>

                <td
                  colSpan={showActions ? 8 : 7}
                  className="p-4 text-center text-gray-500"
                >
                  Nenhum condomínio encontrado.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-2 border-t bg-white">

        <div className="text-xs text-gray-600">

          Mostrando{" "}
          {startItem}
          -
          {endItem} de{" "}
          {totalItems}

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0 || isLoading}
            className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === 0 || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
              }`}
          >
            Anterior
          </button>

          <div className="text-xs">

            Página {currentPage + 1} de {totalPagesExibidas}

          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={totalPages === 0 || currentPage >= totalPages - 1 || isLoading}
            className={`px-2 py-0.5 text-sm rounded-md border ${totalPages === 0 || currentPage >= totalPages - 1 || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
              }`}
          >
            Próxima
          </button>

        </div>

      </div>

    </div>
  );
}