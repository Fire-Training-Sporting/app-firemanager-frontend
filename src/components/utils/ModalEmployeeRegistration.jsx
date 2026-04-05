import { useState, useEffect } from "react";
import Header from "./Header";

function ModalEmployeeRegistration({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    perfil: ""
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = () => {
    onSave(form);
    setForm({ nome: "", email: "", telefone: "", perfil: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed h-full inset-0 z-50 bg-white text-white">
      <Header />
      <div className="flex justify-center p-3 min-h-[calc(100vh-64px)]">
        <div className="relative top-5 w-xl h-full bg-[#3f3f3f] rounded-3xl p-6 shadow-2xl overflow-y-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-red-500 text-5xl font-medium hover:text-red-600"
          >
            ×
          </button>

          <h2 className="text-3xl font-bold mb-6">Cadastrar Funcionário</h2>

          <label className="block mb-4 bg-black rounded-xl">
            <span className="text-xl font-semibold">Nome</span>
            <input
              value={form.nome}
              onChange={handleChange("nome")}
              className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
              placeholder="Nome"
            />
          </label>

          <label className="block mb-4 bg-black rounded-xl">
            <span className="text-xl font-semibold">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
              placeholder="Email"
            />
          </label>

          <label className="block mb-4 bg-black rounded-xl">
            <span className="text-xl font-semibold">Telefone</span>
            <input
              type="tel"
              value={form.telefone}
              onChange={handleChange("telefone")}
              className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
              placeholder="Telefone"
            />
          </label>

          <label className="block mb-4 bg-black rounded-xl">
            <span className="text-xl font-semibold">Perfil</span>
            <select
              value={form.perfil}
              onChange={handleChange("perfil")}
              className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
            >
              <option value="">Selecione</option>
              <option value="Administrador">Administrador</option>
              <option value="Escritório">Escritório</option>
              <option value="Quadra">Quadra</option>
            </select>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold hover:bg-green-700"
            >
              Cadastrar Funcionário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEmployeeRegistration;