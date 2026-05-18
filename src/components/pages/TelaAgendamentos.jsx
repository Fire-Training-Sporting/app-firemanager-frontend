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
      <PageLayout title="Agendamentos" searchPlaceholder="Pesquisar agendamento..." onSearch={showModal ? () => {} : buscarDados}
        onAdd={showModal ? () => setShowModal(false) : adicionarDados}
        addLabel={showModal ? "Voltar" : "Agendar serviço"}
        allowOverflow={showModal}
      >
        <div className={"bg-white rounded-lg shadow-md border " + (showModal ? "w-full max-w-xl mx-auto overflow-visible pb-2" : "overflow-hidden")}>
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
            <AgendamentosTable agendamentos={agendamentos} onEdit={editarDados} />
          )}
        </div>
        {showModal && <div className="h-2 bg-[#FAFAFA]" />}
      </PageLayout>
    </div>
  );
}
