import { useState } from "react";
import PageLayout from '../utils/PageLayout';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';

export default function TelaAgendamentos() {
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {};
  const handleAdd = () => setShowModal(true);

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Agendamentos"
        searchPlaceholder="Pesquisar agendamento..."
        onSearch={showModal ? () => {} : handleSearch}
        onAdd={showModal ? () => setShowModal(false) : handleAdd}
        addLabel={showModal ? "Voltar" : "Agendar serviço"}
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {showModal ? (
            <ModalScheduling onClose={() => setShowModal(false)} />
          ) : (
            <AgendamentosTable />
          )}
        </div>
      </PageLayout>
    </div>
  );
}