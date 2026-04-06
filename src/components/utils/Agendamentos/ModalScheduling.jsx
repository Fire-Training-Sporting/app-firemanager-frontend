import { useState, useCallback } from "react";
import Header from "../Header";
import FormField from "../FormField";
import Button from "../Button";

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

const SERVICO_OPTIONS = [
  { value: "", label: "Selecione" },
  { value: "Tênis", label: "Tênis" },
  { value: "Beach tênis", label: "Beach tênis" },
  { value: "Personal training", label: "Personal training" }
];

function ModalScheduling({ isOpen, onClose, onSave, title = "Criar agendamento" }) {
  const [form, setForm] = useState({
    data: "",
    horarioInicio: "",
    horarioFim: "",
    local: "",
    aluno: "",
    servico: "",
    funcionario: "",
    funcao: "",
    observacao: ""
  });

  const handleChange = useCallback(
    (field) => (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const handleSave = () => {
    onSave(form);
    setForm({
      data: "",
      horarioInicio: "",
      horarioFim: "",
      local: "",
      aluno: "",
      servico: "",
      funcionario: "",
      funcao: "",
      observacao: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${colors.bg.white} overflow-y-auto`}>
      <Header />

      <div className="flex justify-center p-6">
        <div className={`relative w-500px ${colors.bg.gray} rounded-xl p-6 shadow-2xl space-y-4 text-white`}>

          <button
            onClick={onClose}
            className={`absolute right-4 top-4 ${colors.text.red} text-4xl font-bold ${colors.hoverText.red}`}
          >
            ×
          </button>

          <h2 className="text-3xl font-bold">{title}</h2>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Data" type="date" value={form.data} onChange={handleChange("data")} />
            <FormField label="Início" type="time" value={form.horarioInicio} onChange={handleChange("horarioInicio")} />
            <FormField label="Término" type="time" value={form.horarioFim} onChange={handleChange("horarioFim")} />
            <FormField label="Local" value={form.local} onChange={handleChange("local")} />
          </div>

          <FormField label="Aluno" value={form.aluno} onChange={handleChange("aluno")} />

          <FormField
            label="Serviço"
            type="select"
            value={form.servico}
            onChange={handleChange("servico")}
            options={SERVICO_OPTIONS}
          />

          <div className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold">
            Saldo do serviço: 4
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Funcionário" value={form.funcionario} onChange={handleChange("funcionario")} />
            <FormField label="Função" value={form.funcao} onChange={handleChange("funcao")} />
          </div>

          <Button className={`w-full ${colors.bg.blue} ${colors.hoverBg.blue} text-white font-semibold py-3 rounded-lg`}>
            Adicionar funcionário
          </Button>

          <FormField
            label="Observação"
            type="textarea"
            value={form.observacao}
            onChange={handleChange("observacao")}
          />

          <Button
            onClick={handleSave}
            className={`w-full ${colors.bg.green} ${colors.hoverBg.green} text-white font-semibold py-3 rounded-lg`}
          >
            Criar agendamento
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalScheduling;