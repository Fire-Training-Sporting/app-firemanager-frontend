import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';
import ModalEditScheduling from '../utils/Agendamentos/ModalEditScheduling';
import api from "../../provider/api";

export default function TelaAgendamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editAgendamento, setEditAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const response = await api.get("/agendamentos");
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };
  const adicionarDados = () => {
    setEditAgendamento(null);
    setShowModal(true);
  };

  const editarDados = (agendamento) => {
    setEditAgendamento(agendamento);
    setShowModal(true);
  };

  return (
  <div className={showModal ? "modal-open" : ""}>
    <PageLayout
      title="Agendamentos"
      searchPlaceholder="Pesquisar agendamento..."
      onSearch={buscarDados}
      onAdd={adicionarDados}
      addLabel="Agendar serviço"
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <AgendamentosTable agendamentos={agendamentos} onEdit={editarDados} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          {editAgendamento ? (
            <ModalEditScheduling
              agendamento={editAgendamento}
              onClose={() => setShowModal(false)}
            />
          ) : (
            <ModalScheduling onClose={() => setShowModal(false)} onCreated={buscarDados} />
          )}
        </div>
      )}
    </PageLayout>
  </div>
);
}
