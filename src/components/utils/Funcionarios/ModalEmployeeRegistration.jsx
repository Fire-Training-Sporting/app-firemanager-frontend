import { useState, useEffect, useCallback } from "react";
import Header from "../Header";
import FormField from "../FormField";
import Button from "../Button";

const PERFIL_OPTIONS = [
  { value: "", label: "Selecione" },
  { value: "Administrador", label: "Administrador" },
  { value: "Escritório", label: "Escritório" },
  { value: "Quadra", label: "Quadra" }
];

function ModalEmployeeRegistration({ isOpen, onClose, onSave, title = "Cadastrar Funcionário" }) {
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

  const handleChange = useCallback((field) => (e) => {
    setForm((prevForm) => ({ ...prevForm, [field]: e.target.value }));
  }, []);

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

          <h2 className="text-3xl font-bold mb-6">{title}</h2>

          <FormField
            label="Nome"
            value={form.nome}
            onChange={handleChange("nome")}
          />

          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
          />

          <FormField
            label="Telefone"
            type="tel"
            value={form.telefone}
            onChange={handleChange("telefone")}
          />

          <FormField
            label="Perfil"
            type="select"
            value={form.perfil}
            onChange={handleChange("perfil")}
            options={PERFIL_OPTIONS}
          />

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Cadastrar Funcionário
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEmployeeRegistration;