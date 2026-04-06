import { useState } from "react";
import ModalScheduling from "./ModalScheduling";
import AgendamentosRow from "./AgendamentosRow";

const colors = {
  bg: {
    gray: "bg-[#4F4F4F]",
    darkGray: "bg-[#363636]",
    orange: "bg-[#F99A4D]",
    darkOrange: "bg-[#F8821E]",
    white: "bg-[#F3F4F8]",
    green: "bg-[#17A34A]",
    red: "bg-[#DC2625]",
    blue: "bg-[#2563EA]",
    yellow: "bg-[#E9B308]",
  },
  text: {
    red: "text-[#DC2625]",
    blue: "text-[#2563EA]",
    green: "text-[#17A34A]",
    gray: "text-[#4F4F4F]",
  },
  hoverBg: {
    red: "hover:bg-[#B91C1C]",      
    blue: "hover:bg-[#1E40AF]",     
    green: "hover:bg-[#166534]",    
    orange: "hover:bg-[#EA580C]",   
    gray: "hover:bg-[#2E2E2E]",     
    yellow: "hover:bg-[#CA8A04]",   
  },
  hoverText: {
    red: "hover:text-[#B91C1C]",
  }
};

const mockAgendamentos = [
  { id: 1, data: "01/02/2026", horario: "08:00", quadra: "Quadra A", professor: "Bruno", rebatedor: "João", auxiliar: "Giovana", status: "pendente" },
  { id: 2, data: "01/02/2026", horario: "09:00", quadra: "Quadra B", professor: "Kalleb", rebatedor: "Lucas", auxiliar: "Beatriz", status: "confirmado" },
  { id: 3, data: "02/02/2026", horario: "10:00", quadra: "Quadra C", professor: "Vitor", rebatedor: "João", auxiliar: "Giovana", status: "cancelado" },
];

function AgendamentosTable() {
  const [agendamentos, setAgendamentos] = useState(mockAgendamentos);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (newScheduling) => {
    setAgendamentos([...agendamentos, { id: agendamentos.length + 1, ...newScheduling }]);
    setIsModalOpen(false);
  };

  const handleConfirm = (id) => {
    setAgendamentos(
      agendamentos.map((ag) =>
        ag.id === id ? { ...ag, status: "confirmado" } : ag
      )
    );
  };

  const handleCancel = (id) => {
    setAgendamentos(
      agendamentos.map((ag) =>
        ag.id === id ? { ...ag, status: "cancelado" } : ag
      )
    );
  };

  return (
    <div className={`${colors.bg.white} p-12`}>
      <p className="text-4xl font-bold mb-6 ml-0.5">Agendamentos</p>
      <div className={`${colors.bg.gray} p-6 rounded-2xl text-white`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold">Filtrar:</span>
            <button className={`text-2xl ${colors.bg.white} text-black px-4 py-1 rounded-2xl font-semibold`}>
              Todos
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`text-xl ${colors.bg.blue} ${colors.hoverBg.blue} px-4 py-2 rounded-lg font-semibold`}
          >
            + Novo agendamento
          </button>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_250px] gap-2 mb-4">
          {["Data","Horário","Quadra","Professor","Rebatedor","Auxiliar","Status","Ações"].map((col) => (
            <div key={col} className={`text-xl ${colors.bg.darkGray} p-3 rounded-lg text-center font-semibold`}>
              {col}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {agendamentos.map((ag, index) => (
            <AgendamentosRow
              key={ag.id}
              agendamento={ag}
              index={index}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </div>

      <ModalScheduling
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default AgendamentosTable;