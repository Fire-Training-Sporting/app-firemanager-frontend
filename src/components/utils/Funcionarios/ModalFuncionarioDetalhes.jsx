import { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalFuncionarioDetalhes({
  funcionario,
  onClose,
  onEdit,
  onDelete,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const normalizarCargo = (cargo) =>
    String(cargo ?? "")
      .trim()
      .toLowerCase();

  const usuarioPodeGerenciarFuncionario = (cargo) => {
    const cargoNormalizado = normalizarCargo(cargo);
    return ["root", "administracao", "administrativo", "admnistrativo"].includes(
      cargoNormalizado
    );
  };

  const formatarTelefone = (value) => {
    if (!value) return "-";
    const numeros = String(value).replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (numeros.length === 10) {
      return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }
    return value;
  };

  const copyToClipboard = async (text, fieldName) => {
    if (!text || text === "-") return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar para área de transferência:", err);
    }
  };

  const InfoCard = ({ title, value, className, fieldName }) => (
    <div className={`bg-gray-50 border border-gray-200 rounded-xl p-3 ${className || ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="block text-[11px] font-bold uppercase text-gray-500 mb-1 tracking-wide">
            {title}
          </span>
          <span className="text-sm text-gray-800 font-medium">{value || "-"}</span>
        </div>
        {value && value !== "-" && (
          <button
            type="button"
            onClick={() => copyToClipboard(value, fieldName)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition p-1 rounded hover:bg-gray-200 cursor-pointer"
            title="Copiar"
          >
            {copiedField === fieldName ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );

  if (!funcionario) return null;

  const showActions = usuarioPodeGerenciarFuncionario(
    sessionStorage.getItem("cargo")
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* HEADER */}
        <div className="bg-linear-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
          <div>
            <h2 className="text-white text-lg font-bold">Detalhes do Funcionário</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-red-200 transition rounded-full px-2 py-1 bg-black/20"
          >
            ✕
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="overflow-y-auto px-5 py-4 space-y-5">
          {/* STATUS */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs text-gray-500 font-medium">ID do Funcionário:</span>
              <h3 className="text-2xl font-bold text-gray-800">#{funcionario.id}</h3>
            </div>

            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
              Ativo
            </span>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoCard
              title="Email"
              value={funcionario.email}
              fieldName="email"
            />

            <InfoCard
              title="Telefone"
              value={formatarTelefone(funcionario.telefone)}
              fieldName="telefone"
            />

            <InfoCard title="Nome" value={funcionario.nome} fieldName="nome" />

            <InfoCard
              title="Cargo"
              value={funcionario.tipoUsuario?.cargo || funcionario.perfil}
              fieldName="cargo"
            />

            {funcionario.condominio && (
              <InfoCard
                title="Condomínio"
                value={
                  typeof funcionario.condominio === "object"
                    ? funcionario.condominio.nome
                    : funcionario.condominio
                }
                className="md:col-span-2"
                fieldName="condominio"
              />
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t bg-gray-50 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold hover:bg-black transition"
          >
            Fechar
          </button>

          {showActions && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (showActions) onDelete?.();
                }}
                className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
              >
                Excluir
              </button>

              <button
                type="button"
                onClick={() => {
                  if (showActions) onEdit?.();
                }}
                className="px-3 py-2 rounded-lg bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600 transition"
              >
                Editar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
