import { useState, useEffect } from "react";
import { AlunosRow } from "./AlunosRow";
import AlunosTh from "./AlunoTh";

export function AlunosTable({
  alunos = [],
  onDelete = () => {},
  onEdit = () => {},
  onAddSaldo = () => {},
}) {
  const ITEMS_PER_PAGE = 20;
  const showActions = sessionStorage.getItem("cargo") !== "Professor";

  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = alunos.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const pageItems = alunos.slice(startIndex, endIndex);

  const goPrev = () =>
    setCurrentPage((p) => Math.max(1, p - 1));

  const goNext = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return (
    <div className="w-full overflow-x-auto">

      <div className="h-fit max-h-[calc(100vh-300px)] overflow-y-auto">

        <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">

          <thead className="sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">

              <AlunosTh className="text-left w-12">
                ID
              </AlunosTh>

              <AlunosTh className="text-left">
                Nome
              </AlunosTh>

              <AlunosTh className="text-left">
                Email
              </AlunosTh>

              <AlunosTh className="text-left">
                Telefone
              </AlunosTh>

              <AlunosTh className="text-left">
                Endereço
              </AlunosTh>

              <AlunosTh className="text-left w-32">
                Tênis
              </AlunosTh>

              <AlunosTh className="text-left w-40">
                Beach Tennis
              </AlunosTh>

              <AlunosTh className="text-left w-32">
                Funcional
              </AlunosTh>

              {showActions && (
                <AlunosTh className="text-left w-40">
                  Ações
                </AlunosTh>
              )}

            </tr>
          </thead>

          <tbody className="bg-white">
            {pageItems.length > 0 ? (
              pageItems.map((aluno) => (
                <AlunosRow
                  key={aluno.id}
                  {...aluno}
                  onDelete={() => onDelete(aluno)}
                  onEdit={() => onEdit(aluno)}
                  onAddSaldo={() => onAddSaldo(aluno)}
                  showActions={showActions}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={showActions ? 9 : 8}
                  className="p-4 text-center text-gray-500"
                >
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-2 border-t bg-white">

        <div className="text-xs text-gray-600">
          Mostrando{" "}
          {Math.min(totalItems, startIndex + 1)}
          -
          {Math.min(totalItems, endIndex)}
          {" "}de {totalItems}
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className={`px-2 py-0.5 text-sm rounded-md border ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Anterior
          </button>

          <div className="text-xs">
            Página {currentPage} de {totalPages}
          </div>

          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-0.5 text-sm rounded-md border ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Próxima
          </button>

        </div>
      </div>
    </div>
  );
}