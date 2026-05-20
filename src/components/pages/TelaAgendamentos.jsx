import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import SearchFilter from '../utils/SearchFilter';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';
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
        <AgendamentosTable agendamentos={agendamentos} onEdit={editarDados} />
      </div>

      {showModal && (
        <ModalScheduling 
          agendamento={editAgendamento}
          onClose={() => setShowModal(false)} 
          onCreated={buscarDados} 
        />
      )}
    </PageLayout>
  </div>
);
}
