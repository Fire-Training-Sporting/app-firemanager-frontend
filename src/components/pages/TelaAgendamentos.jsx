import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import SearchFilter from '../utils/SearchFilter';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';
import ConfirmationModal from '../utils/ConfirmationModal';
import api from "../../provider/api";

const search_columns = [
  { label: "Aluno", value: "aluno" },
  { label: "ID", value: "id" },
  { label: "Data", value: "data" },
  { label: "Condomínio", value: "condominio" },
  { label: "Professor", value: "professor" },
  { label: "Status", value: "status" },
];

export default function TelaAgendamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editAgendamento, setEditAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosOriginais, setAgendamentosOriginais] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState(null);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/agendamentos");
      setAgendamentos(response.data);
      setAgendamentosOriginais(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarAgendamentos = async ({ field, value }) => {
    try {
      setIsLoading(true);
      
      if (!value.trim()) {
        setAgendamentos(agendamentosOriginais);
        return;
      }

      // Filtro local para melhor performance
      const filtrados = agendamentosOriginais.filter((agendamento) => {
        const fieldValue = agendamento[field];
        let compareValue = value.toLowerCase();

        // Converter valor do campo para string para comparação
        let fieldString = "";

        if (typeof fieldValue === "object" && fieldValue !== null) {
          fieldString = fieldValue.nome ? fieldValue.nome.toLowerCase() : "";
        } else if (typeof fieldValue === "string") {
          fieldString = fieldValue.toLowerCase();
        } else if (typeof fieldValue === "number") {
          fieldString = fieldValue.toString().toLowerCase();
        } else if (fieldValue instanceof Date) {
          fieldString = fieldValue.toLocaleDateString("pt-BR").toLowerCase();
        }

        return fieldString.includes(compareValue);
      });

      setAgendamentos(filtrados);
    } catch (error) {
      console.error("Erro ao filtrar agendamentos:", error);
    } finally {
      setIsLoading(false);
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

  const solicitarExclusao = (id) => {
    const agendamento = agendamentos.find((item) => item.id === id);
    setAgendamentoParaExcluir(agendamento ?? { id });
  };

  const cancelarExclusao = () => {
    setAgendamentoParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!agendamentoParaExcluir?.id) {
      return;
    }

    try {
      await api.delete(`/agendamentos/${agendamentoParaExcluir.id}`);
      setAgendamentoParaExcluir(null);
      await buscarDados();
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      window.alert("Não foi possível excluir o agendamento. Tente novamente.");
    }
  };

  const formatarValor = (valor) => {
    if (valor && typeof valor === "object") {
      return valor.nome ?? "-";
    }

    return valor ?? "-";
  };

  return (
  <div className={showModal ? "modal-open" : ""}>
    <PageLayout
      title="Agendamentos"
      searchPlaceholder="Pesquisar agendamento..."
      onSearch={buscarDados}
      onAdd={adicionarDados}
      addLabel="Agendar serviço"
      customControls={
        <SearchFilter
          columns={search_columns}
          onSearch={filtrarAgendamentos}
          isLoading={isLoading}
        />
      }
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <AgendamentosTable
          agendamentos={agendamentos}
          onEdit={editarDados}
          onDelete={solicitarExclusao}
        />
      </div>

      {showModal && (
        <ModalScheduling 
          agendamento={editAgendamento}
          onClose={() => setShowModal(false)} 
          onCreated={buscarDados} 
        />
      )}

      <ConfirmationModal
        isOpen={!!agendamentoParaExcluir}
        title="Confirmar exclusão"
        message="Deseja realmente excluir este agendamento?"
        items={agendamentoParaExcluir ? [
          { label: "ID", value: agendamentoParaExcluir.id },
          { label: "Aluno", value: formatarValor(agendamentoParaExcluir.aluno) },
          { label: "Data", value: formatarValor(agendamentoParaExcluir.data) },
          { label: "Hora início", value: formatarValor(agendamentoParaExcluir.horaInicio) },
          { label: "Hora fim", value: formatarValor(agendamentoParaExcluir.horaFim) },
          { label: "Condomínio", value: formatarValor(agendamentoParaExcluir.condominio) },
          { label: "Professor", value: formatarValor(agendamentoParaExcluir.professor) },
          { label: "Rebatedor", value: formatarValor(agendamentoParaExcluir.rebatedor) },
          { label: "Auxiliar", value: formatarValor(agendamentoParaExcluir.auxiliar) },
          { label: "Status", value: formatarValor(agendamentoParaExcluir.status) },
        ] : []}
        confirmLabel="Sim, excluir"
        cancelLabel="Não, cancelar"
        onCancel={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />
    </PageLayout>
  </div>
);
}
