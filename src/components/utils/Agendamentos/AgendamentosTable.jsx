import { useState } from "react";
import AgendamentosRow from "./AgendamentosRow";

const mockAgendamentos = [
  {
    id: 1,
    data: "01/02/2026",
    horario: "08:00",
    quadra: "Quadra A",
    professor: "Bruno",
    rebatedor: "João",
    auxiliar: "Giovana",
    status: "pendente"
  },
  {
    id: 2,
    data: "01/02/2026",
    horario: "09:00",
    quadra: "Quadra B",
    professor: "Kalleb",
    rebatedor: "Lucas",
    auxiliar: "Beatriz",
    status: "confirmado"
  },
  {
    id: 3,
    data: "02/02/2026",
    horario: "10:00",
    quadra: "Quadra C",
    professor: "Vitor",
    rebatedor: "João",
    auxiliar: "Giovana",
    status: "cancelado"
  },
];

function AgendamentosTable() {
  const [agendamentos, setAgendamentos] = useState(mockAgendamentos);

  const handleConfirm = (id) => {
    setAgendamentos(agendamentos.map(ag => ag.id === id ? { ...ag, status: "confirmado" } : ag));
  };

  const handleCancel = (id) => {
    setAgendamentos(agendamentos.map(ag => ag.id === id ? { ...ag, status: "cancelado" } : ag));
  };

  return (
    <div className="bg-white p-12">
      <p className="text-4xl font-bold mb-6 ml-0.5">Agendamentos</p>
      <div className="bg-[#5a5a5a] p-12 rounded-2xl text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold">Filtrar:</span>
            <button className="text-2xl bg-white text-black px-4 py-1 rounded-2xl font-semibold">
              Todos
            </button>
          </div>

          <button className="text-xl bg-blue-600 px-4 py-2 rounded-lg font-semibold">
            + Novo Agendamento
          </button>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_250px] gap-2 mb-4">
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Data</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Horário</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Quadra</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Professor</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Rebatedor</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Auxiliar</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Status</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Ações</div>
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
    </div>
  );
}

export default AgendamentosTable;