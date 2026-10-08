import { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalAlunoDetalhes({
  aluno,
  onClose,
  onEdit,
  onDelete,
  onAddSaldo,
  onRefresh,
}) {
  const [condominios, setCondominios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [saldos, setSaldos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const normalizarCargo = (cargo) =>
    String(cargo ?? "")
      .trim()
      .toLowerCase();

  const usuarioPodeGerenciarAluno = (cargo) => {
    const cargoNormalizado = normalizarCargo(cargo);
    return [
      "root",
      "administracao",
      "administrativo",
      "admnistrativo",
    ].includes(cargoNormalizado);
  };

  const getDisplayValue = (value) => {
    if (Array.isArray(value)) {
      return (
        value
          .map((item) => {
            if (typeof item === "object") {
              return item?.nome ?? "-";
            }
            return item;
          })
          .join(", ") || "-"
      );
    }

    if (typeof value === "object") {
      return value?.nome ?? "-";
    }

    return value ?? "-";
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

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        const [condominiosResponse, servicosResponse, saldosResponse] =
          await Promise.all([
            api.get("/condominios"),
            api.get("/servicos"),
            api.get("/saldos").catch(() => ({ data: [] })),
          ]);

        setCondominios(condominiosResponse.data || []);
        setServicos(servicosResponse.data || []);
        setSaldos(saldosResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados para o aluno:", err);
        setError("Erro ao carregar dados");
        setLoading(false);
      }
    };

    buscarDados();
  }, [aluno?.id]);

  if (!aluno) return null;

  const showActions = usuarioPodeGerenciarAluno(
    sessionStorage.getItem("cargo"),
  );

  // Extrai o condomínio do aluno
  const condominioSelecionado = Array.isArray(aluno.condominio)
    ? aluno.condominio[0]
    : aluno.condominio;
  const condominio =
    condominioSelecionado && typeof condominioSelecionado === "object"
      ? condominioSelecionado
      : condominios.find(
          (item) => String(item.id) === String(condominioSelecionado),
        );

  // Filtra saldos do aluno
  const getSaldoAlunoId = (saldo) =>
    String(
      saldo.aluno?.id ??
        saldo.fk_usuario?.id ??
        saldo.fk_usuario ??
        saldo.usuario?.id ??
        saldo.usuario ??
        saldo.aluno ??
        "",
    );

  const saldosDoAluno = saldos.filter((saldo) => {
    const alunoId = getSaldoAlunoId(saldo);
    return String(alunoId) === String(aluno.id);
  });

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
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition p-1 rounded hover:bg-gray-200"
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* HEADER */}
        <div className="bg-linear-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
          <div>
            <h2 className="text-white text-lg font-bold">Detalhes do Aluno</h2>
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
              <span className="text-xs text-gray-500 font-medium">
                ID do Aluno:
              </span>
              <h3 className="text-2xl font-bold text-gray-800">#{aluno.id}</h3>
            </div>

            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
              Ativo
            </span>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoCard
              title="Email"
              value={aluno.email}
              className="md:col-span-2"
              fieldName="email"
            />

            <InfoCard title="Nome" value={aluno.nome} fieldName="nome" />

            <InfoCard
              title="Telefone"
              value={formatarTelefone(aluno.telefone)}
              fieldName="telefone"
            />

            <InfoCard
              title="Condomínio"
              value={getDisplayValue(condominio)}
              fieldName="condominio"
            />

            <InfoCard
              title="Endereço"
              value={aluno.endereco || getDisplayValue(condominio?.endereco)}
              fieldName="endereco"
            />
          </div>

          {/* SALDOS */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-3">
              Saldos por Serviço
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["Tênis", "Beach Tennis", "Funcional"].map((servicoNome) => {
                const saldo = saldosDoAluno.find((s) => {
                  const servicoId = String(
                    s.servico?.id ??
                      s.fk_servico?.id ??
                      s.fk_servico ??
                      s.servico_id ??
                      s.servico ??
                      "",
                  );
                  const servico = servicos.find(
                    (srv) => String(srv.id) === servicoId,
                  );
                  return servico?.nome === servicoNome;
                });

                const quantidade = saldo?.quantidade || 0;

                return (
                  <div
                    key={servicoNome}
                    className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 text-sm"
                  >
                    <div className="text-xs text-gray-600 mb-1">
                      {servicoNome}
                    </div>
                    <div className="text-lg font-bold text-orange-700">
                      {quantidade}
                    </div>
                  </div>
                );
              })}
            </div>
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

              <button
                type="button"
                onClick={() => {
                  if (showActions) onAddSaldo?.();
                }}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Adicionar Saldo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
