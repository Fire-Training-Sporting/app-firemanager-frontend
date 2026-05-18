import { useState } from "react";

export default function ServicoModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    nome: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ nome: "" });
    onClose();
  };

  return (
    <div className="relative p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cadastrar Serviço</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome do serviço"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
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
