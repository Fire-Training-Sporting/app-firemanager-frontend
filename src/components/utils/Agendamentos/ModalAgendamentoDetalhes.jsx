import { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalAgendamentoDetalhes({
  agendamento,
  onClose,
}) {
  const [condominios, setCondominios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!agendamento) return null;

  const formatDateValue = (value) => {
    if (!value) return "-";

    const d = new Date(value);

    if (isNaN(d)) return value;

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const formatTimeValue = (value) => {
    if (!value) return "-";

    if (typeof value === "string") {
      return value.slice(0, 5);
    }

    const d = new Date(value);

    if (isNaN(d)) return value;

    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
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

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        const [condominiosResponse, usuariosResponse, servicosResponse] = await Promise.all([
          api.get("/condominios"),
          api.get("/usuarios"),
          api.get("/servicos"),
        ]);

        setCondominios(condominiosResponse.data || []);
        setUsuarios(usuariosResponse.data || []);
        setListaServicos(servicosResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados para o agendamento:", err);
        setError("Erro ao carregar dados");
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  // Extrai o endereço do condomínio associado
  const condominio = Array.isArray(agendamento.condominio)
    ? agendamento.condominio[0]
    : agendamento.condominio;
  const endereco = condominio?.endereco || "Endereço não disponível";

  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    endereco
  )}&output=embed`;

  const mapsRedirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    endereco
  )}`;

  const InfoCard = ({ title, value }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
      <span className="block text-[11px] font-bold uppercase text-gray-500 mb-1 tracking-wide">
        {title}
      </span>

      <span className="text-sm text-gray-800 font-medium break-words">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* HEADER */}
        <div className="bg-linear-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
          <div>
            <h2 className="text-white text-lg font-bold">
              Detalhes do Agendamento
            </h2>

            <p className="text-orange-100 text-xs">
              Visualização completa do agendamento
            </p>
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
                ID do Agendamento
              </span>

              <h3 className="text-2xl font-bold text-gray-800">
                #{agendamento.id}
              </h3>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${String(agendamento.status || "")
                  .toLowerCase()
                  .includes("confirm")
                  ? "bg-green-100 text-green-700"
                  : String(agendamento.status || "")
                    .toLowerCase()
                    .includes("cancel")
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {agendamento.status || "Pendente"}
            </span>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <InfoCard
              title="Data"
              value={formatDateValue(agendamento.data)}
            />

            <InfoCard
              title="Serviço"
              value={getDisplayValue(agendamento.servico)}
            />

            <InfoCard
              title="Hora início"
              value={formatTimeValue(agendamento.horaInicio)}
            />

            <InfoCard
              title="Hora fim"
              value={formatTimeValue(agendamento.horaFim)}
            />

            <InfoCard
              title="Professor"
              value={getDisplayValue(agendamento.professor)}
            />

            <InfoCard
              title="Rebatedor"
              value={getDisplayValue(agendamento.rebatedor)}
            />

            <InfoCard
              title="Auxiliar"
              value={getDisplayValue(agendamento.auxiliar)}
            />

            <InfoCard
              title="Tipo"
              value={agendamento.tipo}
            />

          </div>

          {/* ALUNOS */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-3">
              Alunos
            </h4>

            <div className="flex flex-wrap gap-2">
              {(agendamento.alunos || []).length > 0 ? (
                agendamento.alunos.map((aluno, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-700 font-medium"
                  >
                    {getDisplayValue(aluno)}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 rounded-xl bg-gray-100 text-sm text-gray-600">
                  {getDisplayValue(agendamento.aluno)}
                </div>
              )}
            </div>
          </div>

          {/* OBSERVAÇÃO */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-2">
              Observação
            </h4>

            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {agendamento.observacao || "Nenhuma observação cadastrada."}
            </p>
          </div>

          {/* ENDEREÇO + MAPA */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  Localização
                </h4>

                <p className="text-xs text-gray-500">
                  Endereço do condomínio
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.open(mapsRedirectUrl, "_blank")}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
              >
                Abrir no Maps
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <span className="block text-[11px] font-bold uppercase text-gray-500 mb-1 tracking-wide">
                  Endereço
                </span>

                <span className="text-sm text-gray-800 font-medium">
                  {condominio?.logradouro + ", " + condominio?.numero || "Endereço não disponível"}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <iframe
                title="Mapa"
                src={mapsEmbedUrl}
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                className="border-0"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t bg-gray-50 px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold hover:bg-black transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}