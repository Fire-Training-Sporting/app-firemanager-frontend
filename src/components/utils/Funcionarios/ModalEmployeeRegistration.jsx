import { useState } from "react";

const PERFIL_OPTIONS = [
  { value: "", label: "Selecione" },
  { value: "Administrador", label: "Administrador" },
  { value: "Escritório", label: "Escritório" },
  { value: "Quadra", label: "Quadra" }
];

export default function ModalEmployeeRegistration({ onClose, onSave }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    perfil: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ nome: "", email: "", telefone: "", perfil: "" });
    onClose();
  };

  return (
    <div className="relative p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cadastrar Funcionário</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="tel"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          placeholder="Telefone"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <select
          name="perfil"
          value={form.perfil}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          {PERFIL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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