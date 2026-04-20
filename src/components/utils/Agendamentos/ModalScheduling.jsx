import React, { useState } from "react";

export default function ModalScheduling({ onClose }) {
  const [funcionarios, setFuncionarios] = useState([{ nome: "", funcao: "" }]);

  const addFuncionario = () => {
    setFuncionarios([...funcionarios, { nome: "", funcao: "" }]);
  };

  const updateFuncionario = (index, field, value) => {
    const updated = [...funcionarios];
    updated[index][field] = value;
    setFuncionarios(updated);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Novo Agendamento</h2>
      <form className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input type="date" className="w-full border rounded-md px-3 py-2" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Hora início</label>
            <input type="time" className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Hora término</label>
            <input type="time" className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Local</label>
          <select className="w-full border rounded-md px-3 py-2">
            <option>Quadra A</option>
            <option>Quadra B</option>
            <option>Quadra C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aluno</label>
          <select className="w-full border rounded-md px-3 py-2">
            <option>Maria Silva</option>
            <option>João Santos</option>
            <option>Ana Costa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Serviço</label>
          <select className="w-full border rounded-md px-3 py-2">
            <option>Treinamento</option>
            <option>Aula de reforço</option>
            <option>Atendimento especial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Funcionários</label>
          {funcionarios.map((f, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                className="flex-1 border rounded-md px-3 py-2"
                value={f.nome}
                onChange={(e) => updateFuncionario(index, "nome", e.target.value)}
              >
                <option value="">Selecione funcionário</option>
                <option>Bruno</option>
                <option>Paulo</option>
                <option>Lucas</option>
              </select>
              <select
                className="flex-1 border rounded-md px-3 py-2"
                value={f.funcao}
                onChange={(e) => updateFuncionario(index, "funcao", e.target.value)}
              >
                <option value="">Selecione função</option>
                <option>Instrutor</option>
                <option>Auxiliar</option>
                <option>Reba</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={addFuncionario}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
          >
            + Adicionar funcionário
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Observação</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            rows="3"
            placeholder="Digite observações..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}