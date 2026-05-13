import {AgendamentosRow} from "./AgendamentosRow";
import AgendamentosTh from "./AgendamentosTh";

export function AgendamentosTable({ agendamentos = [], onEdit }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="h-fit max-h-[calc(100vh-300px)] overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b-2 border-gray-200">
              <AgendamentosTh>Aluno</AgendamentosTh>
              <AgendamentosTh>Data</AgendamentosTh>
              <AgendamentosTh>Hora Início</AgendamentosTh>
              <AgendamentosTh>Condomínio</AgendamentosTh>
              <AgendamentosTh>Professor</AgendamentosTh>
              <AgendamentosTh>Rebatedor</AgendamentosTh>
              <AgendamentosTh>Auxiliar</AgendamentosTh>
              <AgendamentosTh>Status</AgendamentosTh>
              <AgendamentosTh className="w-40">Ações</AgendamentosTh>
            </tr>
          </thead>
          <tbody className="bg-white">
            {agendamentos.map((agendamento) => (
              <AgendamentosRow key={agendamento.id} {...agendamento} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
