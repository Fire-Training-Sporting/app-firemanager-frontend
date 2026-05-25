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
    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
        <h2 className="text-lg font-bold text-white">Cadastrar Serviço</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-red-200 transition rounded-full p-1 bg-black/20"
        >
          ✕
        </button>
      </div>

      {/* Conteúdo */}
      <div className="px-5 py-4">
        <form onSubmit={handleSave} className="flex flex-col space-y-3">
          <div>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome do serviço"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#F8821E] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F8821E] text-white font-semibold rounded-md shadow-md transition-transform transform hover:scale-105"
            >
              Cadastrar serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}