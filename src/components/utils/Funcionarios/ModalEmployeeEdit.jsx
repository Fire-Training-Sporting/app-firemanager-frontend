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

const colors = {
  bg: {
    gray: "bg-[#4F4F4F]",
    darkGray: "bg-[#363636]",
    orange: "bg-[#F99A4D]",
    darkOrange: "bg-[#F8821E]",
    white: "bg-[#F3F4F8]",
    green: "bg-[#17A34A]",
    red: "bg-[#DC2625]",
    blue: "bg-[#2563EA]",
    yellow: "bg-[#E9B308]",
  },
  text: {
    red: "text-[#DC2625]",
    blue: "text-[#2563EA]",
    green: "text-[#17A34A]",
    gray: "text-[#4F4F4F]",
  },
  hoverBg: {
    red: "hover:bg-[#B91C1C]",      
    blue: "hover:bg-[#1E40AF]",     
    green: "hover:bg-[#166534]",    
    orange: "hover:bg-[#EA580C]",   
    gray: "hover:bg-[#2E2E2E]",     
    yellow: "hover:bg-[#CA8A04]",   
  },
  hoverText: {
    red: "hover:text-[#B91C1C]",
  }
};

function ModalEmployeeEdit({ isOpen, onClose, onUpdate, employee }) {
  const [form, setForm] = useState(employee || { nome: "", email: "", telefone: "", perfil: "" });

  useEffect(() => {
    if (employee) {
      setForm(employee);
    }
  }, [employee]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = useCallback((field) => (e) => {
    setForm((prevForm) => ({ ...prevForm, [field]: e.target.value }));
  }, []);

  const handleUpdate = () => {
    onUpdate(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed h-full inset-0 z-50 ${colors.bg.white} text-white`}>
      <Header />
      <div className="flex justify-center p-3 min-h-[calc(100vh-64px)]">
        <div className={`relative top-5 w-xl h-full ${colors.bg.gray} rounded-3xl p-6 shadow-2xl overflow-y-auto`}>
          <button
            type="button"
            onClick={onClose}
            className={`absolute right-4 top-4 ${colors.text.red} text-5xl font-medium ${colors.hoverText.red}`}
          >
            ×
          </button>

          <h2 className="text-3xl font-bold mb-6">Editar Funcionário</h2>

          <FormField label="Nome" value={form.nome} onChange={handleChange("nome")} />
          <FormField label="Email" type="email" value={form.email} onChange={handleChange("email")} />
          <FormField label="Telefone" type="tel" value={form.telefone} onChange={handleChange("telefone")} />
          <FormField label="Perfil" type="select" value={form.perfil} onChange={handleChange("perfil")} options={PERFIL_OPTIONS} />

          <div className="flex gap-3">
            <Button
              onClick={handleUpdate}
              className={`flex-1 ${colors.bg.blue} ${colors.hoverBg.blue} text-white font-semibold`}
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEmployeeEdit;