import { AgendamentosRow } from './AgendamentosRow';
import AgendamentosTh from './AgendamentosTh';

const agendamentos = [
  { id: 1, data: "16/02/26", horario: "10h - 11h", quadra: "Quadra A", prof: "Bruno", reba: "Davi", aux: "Kalleb", status: "Confirmada" },
  { id: 2, data: "17/02/26", horario: "13h - 14h", quadra: "Quadra B", prof: "Paulo", reba: "Enzo", aux: "Lucas", status: "Pendente" },
  // ... demais registros
];

export function AgendamentosTable() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="max-h-115 overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
          <thead className="sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">
              <AgendamentosTh>Data</AgendamentosTh>
              <AgendamentosTh>Horário</AgendamentosTh>
              <AgendamentosTh>Quadra</AgendamentosTh>
              <AgendamentosTh>Prof</AgendamentosTh>
              <AgendamentosTh>Reba</AgendamentosTh>
              <AgendamentosTh>Aux</AgendamentosTh>
              <AgendamentosTh>Status</AgendamentosTh>
              <AgendamentosTh className="w-40">Ações</AgendamentosTh>
            </tr>
          </thead>
          <tbody className="bg-white">
            {agendamentos.map((ag) => (
              <AgendamentosRow key={ag.id} {...ag} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}