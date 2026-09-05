import { useEffect, useMemo, useState } from "react";
import api from "../../../provider/api";
import AlertMessage from "../AlertMessage";

const saldoServicesOrder = ["Tênis", "Beach Tennis", "Funcional"];

const inputCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]";

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ModalSaldo({ aluno = null, onClose }) {
  const [servicos, setServicos] = useState([]);
  const [form, setForm] = useState({
    servico: "",
    quantidade: "1",
  });
  const [loadingServicos, setLoadingServicos] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const alunoId = useMemo(() => aluno?.id ?? "", [aluno]);

  useEffect(() => {
    const carregarServicos = async () => {
      try {
        setLoadingServicos(true);

        const response = await api.get("/servicos");
        const ativos = (response.data || []).filter((servico) =>
          servico.ativo !== false && saldoServicesOrder.includes(servico.nome)
        );

        const ordenados = saldoServicesOrder
          .map((nome) => ativos.find((servico) => servico.nome === nome))
          .filter(Boolean);

        setServicos(ordenados);

        if (!form.servico && ordenados.length > 0) {
          const tenis = ordenados.find((servico) => servico.nome === "Tênis");
          setForm((current) => ({
            ...current,
            servico: String((tenis || ordenados[0]).id),
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        setSubmitError(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Não foi possível carregar os serviços disponíveis."
        );
      } finally {
        setLoadingServicos(false);
      }
    };

    carregarServicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSubmitError("");
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!alunoId || !form.servico || !form.quantidade) {
      setSubmitError("Selecione um serviço e informe uma quantidade válida.");
      return;
    }

    try {
      setIsSaving(true);
      setSubmitError("");

      await api.post("/saldos", {
        aluno: Number(alunoId),
        quantidade: Number(form.quantidade),
        servico: Number(form.servico),
      });

      onClose();
    } catch (error) {
      console.error("Erro ao criar saldo:", error);
      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          (error?.response?.status === 404
            ? "Aluno ou serviço não encontrado."
            : "Não foi possível criar o saldo. Tente novamente.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">
      <div className="bg-linear-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
        <h2 className="text-lg font-bold text-white">Adicionar saldo</h2>

        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-red-200 transition rounded-full p-1 bg-black/20"
        >
          ✕
        </button>
      </div>

      <div className="px-5 py-4">
        <div className="mb-4 rounded-xl bg-[#FAFAFA] p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">{aluno?.nome || "Aluno"}</p>
          <p className="mt-1 text-gray-600">Escolha o serviço e a quantidade de saldo a adicionar.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <Field label="Serviço">
            <select
              name="servico"
              value={form.servico}
              onChange={handleChange}
              className={inputCls}
              disabled={loadingServicos}
            >
              <option value="">
                {loadingServicos ? "Carregando serviços..." : "Selecione"}
              </option>
              {servicos.map((servico) => (
                <option key={servico.id} value={servico.id}>
                  {servico.nome}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Quantidade">
            <input
              type="number"
              name="quantidade"
              min="1"
              step="1"
              value={form.quantidade}
              onChange={handleChange}
              placeholder="1"
              className={inputCls}
            />
          </Field>

          <AlertMessage variant="error" message={submitError} />

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
              disabled={isSaving || loadingServicos}
              className="px-4 py-2 bg-linear-to-r from-[#F8821E] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F8821E] text-white font-semibold rounded-md shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Salvando..." : "Adicionar saldo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}