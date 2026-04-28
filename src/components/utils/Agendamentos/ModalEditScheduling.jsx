import React, { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalEditScheduling({ agendamento, onClose }) {
  const [data, setData] = useState(agendamento.data || "");
  const [horaInicio, setHoraInicio] = useState(agendamento.horaInicio || "");
  const [horaFim, setHoraFim] = useState(agendamento.horaFim || "");
  const [local, setLocal] = useState(agendamento.condominio || "");
  const [aluno, setAluno] = useState(agendamento.aluno || "");
  const [servico, setServico] = useState(agendamento.servico || "");
  const [funcionarios, setFuncionarios] = useState(
    agendamento.funcionarios || [{ nome: "", funcao: "" }]
  );
  const [observacao, setObservacao] = useState(agendamento.observacao || "");
  const [condominios, setCondominios] = useState([]);

  useEffect(() => {
    api.get("/condominios/nome")
      .then(response => setCondominios(response.data))
      .catch(err => console.error("Erro ao buscar condomínios:", err));
  }, []);

  const addFuncionario = () => {
    setFuncionarios([...funcionarios, { nome: "", funcao: "" }]);
  };

  const updateFuncionario = (index, field, value) => {
    const updated = [...funcionarios];
    updated[index][field] = value;
    setFuncionarios(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosAtualizados = {
      data,
      horaInicio,
      horaFim,
      condominio: local,
      aluno,
      servico,
      funcionarios,
      observacao,
    };
    console.log("Agendamento atualizado:", dadosAtualizados);
    onClose();
  };

  return (
    <div className="p-6 min-h-[200px] max-h-[calc(100vh-250px)]">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Editar Agendamento</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="date"
            className="w-full border rounded-md px-2.5 py-2 text-sm"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Hora início</label>
            <input
              type="time"
              className="w-full border rounded-md px-2.5 py-2 text-sm"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Hora término</label>
            <input
              type="time"
              className="w-full border rounded-md px-2.5 py-2 text-sm"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Condomínio</label>
          <select
            className="w-full border rounded-md px-2.5 py-2 text-sm"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          >
            <option value="">Selecione um condomínio</option>
            {condominios.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aluno</label>
          <input
            type="text"
            className="w-full border rounded-md px-2.5 py-2 text-sm"
            value={aluno}
            onChange={(e) => setAluno(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Serviço</label>
          <input
            type="text"
            className="w-full border rounded-md px-2.5 py-2 text-sm"
            value={servico}
            onChange={(e) => setServico(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Funcionários</label>
          {funcionarios.map((f, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <input
                type="text"
                className="flex-1 border rounded-md px-2.5 py-2 text-sm"
                value={f.nome}
                onChange={(e) => updateFuncionario(index, "nome", e.target.value)}
                placeholder="Nome"
              />
              <input
                type="text"
                className="flex-1 border rounded-md px-2.5 py-2 text-sm"
                value={f.funcao}
                onChange={(e) => updateFuncionario(index, "funcao", e.target.value)}
                placeholder="Função"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addFuncionario}
            className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition"
          >
            + Adicionar funcionário
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Observação</label>
          <textarea
            className="w-full border rounded-md px-2.5 py-2 text-sm"
            rows="2"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
