import { useState, useCallback } from "react";
import Header from "../Header";
import FormField from "../FormField";
import Button from "../Button";

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
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <Header />

      <div className="flex justify-center p-6">
        <div className="relative w-[500px] bg-[#4a4a4a] rounded-xl p-6 shadow-2xl space-y-4 text-white">

          {/* Fechar */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-red-500 text-4xl font-bold hover:text-red-600"
          >
            ×
          </button>

          {/* Título */}
          <h2 className="text-3xl font-bold">{title}</h2>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Data"
              type="date"
              value={form.data}
              onChange={handleChange("data")}
            />

            <FormField
              label="Início"
              type="time"
              value={form.horarioInicio}
              onChange={handleChange("horarioInicio")}
            />

            <FormField
              label="Término"
              type="time"
              value={form.horarioFim}
              onChange={handleChange("horarioFim")}
            />

            <FormField
              label="Local"
              value={form.local}
              onChange={handleChange("local")}
            />
          </div>

          {/* FULL */}
          <FormField
            label="Aluno"
            value={form.aluno}
            onChange={handleChange("aluno")}
          />

          <FormField
            label="Serviço"
            type="select"
            value={form.servico}
            onChange={handleChange("servico")}
            options={SERVICO_OPTIONS}
          />

          {/* SALDO */}
          <div className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold">
            Saldo do serviço: 4
          </div>

          {/* FUNCIONÁRIO */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Funcionário"
              value={form.funcionario}
              onChange={handleChange("funcionario")}
            />

            <FormField
              label="Função"
              value={form.funcao}
              onChange={handleChange("funcao")}
            />
          </div>

          {/* BOTÃO AZUL */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
            Adicionar funcionário
          </Button>

          {/* OBSERVAÇÃO */}
          <FormField
            label="Observação"
            type="textarea"
            value={form.observacao}
            onChange={handleChange("observacao")}
          />

          {/* BOTÃO FINAL */}
          <Button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
          >
            Criar agendamento
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalScheduling;
