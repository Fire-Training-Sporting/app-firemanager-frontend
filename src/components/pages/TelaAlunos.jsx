import { useState } from "react";
import PageLayout from "../utils/PageLayout";
import { AlunosTable } from "../utils/Alunos/AlunosTable";
import ModalAluno from "../utils/Alunos/ModalAlunos";

export default function TelaAlunos() {
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {};
  const handleAdd = () => setShowModal(true);

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Alunos"
        searchPlaceholder="Pesquisar aluno..."
        onSearch={handleSearch}
        onAdd={showModal ? () => setShowModal(false) : handleAdd}
        addLabel={showModal ? "Voltar" : "Cadastrar aluno"}
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {showModal ? (
            <ModalAluno isOpen={showModal} onClose={() => setShowModal(false)} />
          ) : (
            <AlunosTable />
          )}
        </div>
      </PageLayout>
    </div>
  );
}