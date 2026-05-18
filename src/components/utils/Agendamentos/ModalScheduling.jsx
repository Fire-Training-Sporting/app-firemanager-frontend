import React, { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalScheduling({ onClose }) {
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [local, setLocal] = useState("");
  const [aluno, setAluno] = useState("");
  const [servico, setServico] = useState("");
  const [funcionarios, setFuncionarios] = useState([{ nome: "", funcao: "" }]);
  const [observacao, setObservacao] = useState("");
  const [condominios, setCondominios] = useState([]);
  const alunos = [
    "João Silva",
    "Maria Souza",
    "Pedro Lima",
    "Ana Pereira",
  ];
  const servicos = [
    "Beach tenis",
    "Tenis",
    "Personal",
  ];

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
    const novoAgendamento = {
      data,
      horaInicio,
      horaFim,
      condominio: local,
      aluno,
      servico,
      funcionarios,
      observacao,
    };
    console.log("Novo agendamento:", novoAgendamento);
    onClose();
  };

  return (
    <div className="p-3 w-full min-h-[200px] max-h-[calc(100vh-100px)] flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Novo Agendamento</h2>
      <div className="flex-1 overflow-auto pr-1">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              className="w-full border rounded-md px-2.5 py-1.5 text-sm"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Hora início</label>
            <input
              type="time"
              className="w-full border rounded-md px-2.5 py-1.5 text-sm"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Hora término</label>
            <input
              type="time"
              className="w-full border rounded-md px-2.5 py-1.5 text-sm"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Condomínio</label>
          <select
            className="w-full border rounded-md px-2.5 py-1.5 text-sm"
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

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Aluno</label>
            <select
              className="w-full border rounded-md px-2.5 py-1.5 text-sm"
              value={aluno}
              onChange={(e) => setAluno(e.target.value)}
            >
              <option value="">Selecione um aluno</option>
              {alunos.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Serviço</label>
            <select
              className="w-full border rounded-md px-2.5 py-1.5 text-sm"
              value={servico}
              onChange={(e) => setServico(e.target.value)}
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((servicoItem) => (
                <option key={servicoItem} value={servicoItem}>
                  {servicoItem}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Funcionários</label>
          {funcionarios.map((f, index) => (
            <div key={index} className="flex gap-2 mb-1.5">
              <input
                type="text"
                className="flex-1 border rounded-md px-2.5 py-1.5 text-sm"
                value={f.nome}
                onChange={(e) => updateFuncionario(index, "nome", e.target.value)}
                placeholder="Nome"
              />
              <input
                type="text"
                className="flex-1 border rounded-md px-2.5 py-1.5 text-sm"
                value={f.funcao}
                onChange={(e) => updateFuncionario(index, "funcao", e.target.value)}
                placeholder="Função"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addFuncionario}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition"
          >
            + Adicionar funcionário
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Observação</label>
          <textarea
            className="w-full border rounded-md px-2.5 py-1.5 text-sm"
            rows="1"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          ></textarea>
        </div>

      </form>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
        >
          Criar agendamento
        </button>
      </div>
    </div>
  );
}
