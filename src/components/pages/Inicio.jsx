import { useState } from "react";
import PageLayout from "../utils/PageLayout";
import TableBase from "../utils/TableBase";

const mockData = [
  { id: 1, data: "01/02/2026", horario: "08:00", quadra: "Quadra A", prof: "Bruno", reba: "João", aux: "Giovana", status: "pendente" },
  { id: 2, data: "01/02/2026", horario: "09:00", quadra: "Quadra B", prof: "Kalleb", reba: "Lucas", aux: "Beatriz", status: "confirmado" },
  { id: 3, data: "02/02/2026", horario: "10:00", quadra: "Quadra C", prof: "Vitor", reba: "João", aux: "Giovana", status: "cancelado" },
  { id: 4, data: "02/02/2026", horario: "11:00", quadra: "Quadra A", prof: "Bruno", reba: "Lucas", aux: "Beatriz", status: "pendente" },
  { id: 5, data: "03/02/2026", horario: "08:00", quadra: "Quadra B", prof: "Kalleb", reba: "João", aux: "Giovana", status: "confirmado" },
  { id: 6, data: "03/02/2026", horario: "14:00", quadra: "Quadra C", prof: "Vitor", reba: "Lucas", aux: "Beatriz", status: "cancelado" },
  { id: 7, data: "04/02/2026", horario: "09:00", quadra: "Quadra A", prof: "Bruno", reba: "João", aux: "Beatriz", status: "pendente" },
  { id: 8, data: "04/02/2026", horario: "10:00", quadra: "Quadra B", prof: "Kalleb", reba: "Lucas", aux: "Giovana", status: "confirmado" },
];

const getStatusColor = (status) => {
  const s = status.trim().toLowerCase();
  if (s === "confirmado") return "bg-[#17A34A]";
  if (s === "pendente") return "bg-[#E9B308]";
  if (s === "cancelado") return "bg-[#DC2625]";
  return "bg-[#4F4F4F]";
};

const capitalize = (str) =>
  str.trim()[0].toUpperCase() + str.trim().slice(1).toLowerCase();

function KPICard({ label, value, color }) {
  return (
    <div className={`${color} rounded-2xl p-6 flex flex-col items-center justify-center gap-1`}>
      <span className="text-4xl font-bold text-white">{value}</span>
      <span className="text-lg font-semibold text-white">{label}</span>
    </div>
  );
}

const cols = ["Data", "Horário", "Quadra", "Prof", "Reba", "Aux", "Status", "Ações"];

function Inicio() {
  const [agendamentos, setAgendamentos] = useState(mockData);

  const total = agendamentos.length;
  const confirmados = agendamentos.filter((a) => a.status.toLowerCase().trim() === "confirmado").length;
  const pendentes = agendamentos.filter((a) => a.status.toLowerCase().trim() === "pendente").length;
  const cancelados = agendamentos.filter((a) => a.status.toLowerCase().trim() === "cancelado").length;

  const handleConfirm = (id) => {
    setAgendamentos(agendamentos.map((ag) => ag.id === id ? { ...ag, status: "confirmado" } : ag));
  };

  const handleCancel = (id) => {
    setAgendamentos(agendamentos.map((ag) => ag.id === id ? { ...ag, status: "cancelado" } : ag));
  };

  return (
    <PageLayout title="Início">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard label="Total de Agendamentos" value={total} color="bg-[#2563EA]" />
        <KPICard label="Confirmados" value={confirmados} color="bg-[#17A34A]" />
        <KPICard label="Pendentes" value={pendentes} color="bg-[#E9B308]" />
        <KPICard label="Cancelados" value={cancelados} color="bg-[#DC2625]" />
      </div>

      <TableBase>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_220px] gap-2 mb-4">
          {cols.map((col) => (
            <div key={col} className="text-xl bg-[#363636] p-3 rounded-lg text-center font-semibold">
              {col}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {agendamentos.map((ag, index) => {
            const bg = index % 2 === 0 ? "bg-[#F99A4D]" : "bg-[#F8821E]";
            return (
              <div key={ag.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_220px] gap-3 items-center">
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>{ag.data}</div>
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>{ag.horario}</div>
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>{ag.quadra}</div>
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>{ag.prof}</div>
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>{ag.reba}</div>
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>{ag.aux}</div>
                <div className={`text-xl ${getStatusColor(ag.status)} p-3 rounded-lg text-center font-semibold text-white`}>
                  {capitalize(ag.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirm(ag.id)}
                    disabled={ag.status.toLowerCase().trim() === "confirmado"}
                    className="flex-1 bg-[#17A34A] hover:bg-[#166534] text-white px-4 py-3 rounded-lg font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleCancel(ag.id)}
                    disabled={ag.status.toLowerCase().trim() === "cancelado"}
                    className="flex-1 bg-[#DC2625] hover:bg-[#B91C1C] text-white px-4 py-3 rounded-lg font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </TableBase>
    </PageLayout>
  );
}

export default Inicio;
