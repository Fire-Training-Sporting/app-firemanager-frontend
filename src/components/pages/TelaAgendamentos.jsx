import { useState } from "react";
import PageLayout from '../utils/PageLayout';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';
import ModalEditScheduling from '../utils/Agendamentos/ModalEditScheduling';
import api from "../../provider/api";

export default function TelaAgendamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editAgendamento, setEditAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await api.get("/agendamentos");
      const data = response.data;
      setAgendamentos(data);
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };
  const handleAdd = () => {
    setEditAgendamento(null);
    setShowModal(true);
  };

  const handleEdit = (agendamento) => {
    setEditAgendamento(agendamento);
    setShowModal(true);
  };

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout title="Agendamentos" searchPlaceholder="Pesquisar agendamento..." onSearch={showModal ? () => {} : handleSearch}
        onAdd={showModal ? () => setShowModal(false) : handleAdd}
        addLabel={showModal ? "Voltar" : "Agendar serviço"}
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {showModal ? (
            editAgendamento ? (
              <ModalEditScheduling
                agendamento={editAgendamento}
                onClose={() => setShowModal(false)}
              />
            ) : (
              <ModalScheduling onClose={() => setShowModal(false)} />
            )
          ) : (
            <AgendamentosTable onEdit={handleEdit} />
          )}
        </div>
      </PageLayout>
    </div>
  );
}
