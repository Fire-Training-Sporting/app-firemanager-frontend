import { useEffect, useState } from "react";
import { AgendamentosRow } from "./AgendamentosRow";
import AgendamentosTh from "./AgendamentosTh";
import api from "../../../provider/api";


export function AgendamentosTable() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    api.get("/agendamentos")
      .then(response => {
        console.log(response.data);
        setAgendamentos(response.data);
      })
      .catch(err => console.error("Erro ao buscar agendamentos:", err));
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b-2 border-gray-200">
              <AgendamentosTh>Aluno</AgendamentosTh>
              <AgendamentosTh>Data</AgendamentosTh>
              <AgendamentosTh>Horário</AgendamentosTh>
              <AgendamentosTh>Condomínio</AgendamentosTh>
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