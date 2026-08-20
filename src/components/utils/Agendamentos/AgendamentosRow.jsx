export function AgendamentosRow({ id, data, horaInicio, horaFim, condominio, aluno, alunos, professor, rebatedor, auxiliar, status, onViewDetails }) {
  const statusNormalizado = String(status || "").trim().toLowerCase();
  const statusStyle = {
    confirmado: "bg-green-100 text-green-700",
    pendente: "bg-yellow-100 text-yellow-700",
    cancelado: "bg-red-100 text-red-700",
    finalizado: "bg-[#F8821E] text-white",
  }[statusNormalizado] || "bg-gray-100 text-gray-700";

  const statusLabel = statusNormalizado
    ? statusNormalizado.charAt(0).toUpperCase() + statusNormalizado.slice(1)
    : "-";

  // Tratar como será exibido o valor, considerando que pode ser um objeto ou uma string
  const getDisplayValue = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (item && typeof item === "object") {
            return item.nome ?? item.nomeCompleto ?? item.aluno?.nome ?? "-";
          }

          return item ?? "-";
        })
        .filter((item) => item !== "-")
        .join(", ") || "-";
    }

    if (value && typeof value === "object") {
      return value.nome ?? "-";
    }
    return value ?? "-";
  };

  /* Funções para formatar data/hora */
  const parseDate = (value) => {
    if (!value && value !== 0) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value);
    if (typeof value === 'string') {
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) return null;
      const iso = value.replace(' ', 'T');
      const d = new Date(iso);
      return isNaN(d) ? null : d;
    }
    return null;
  };

  const formatDateValue = (value) => {
    const d = parseDate(value);
    if (d instanceof Date) {
      return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
    }
    return value ?? '-';
  };

  const formatTimeValue = (value) => {
    if (!value && value !== 0) return '-';
    if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
      const parts = value.split(':');
      return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}`;
    }
    const d = parseDate(value);
    if (d instanceof Date) {
      return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(d);
    }
    return value ?? '-';
  };

  function abrirRota(destino) {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
    window.open(mapsUrl, "_blank");
  }

  return (
    <tr
      className="border-b border-gray-200 hover:bg-[#F3F4F8] transition-colors duration-150 cursor-pointer"
      onClick={onViewDetails}
      title="Clique para ver os detalhes do agendamento"
    >
      <td className="px-4 py-3 text-sm text-gray-800 align-middle font-semibold">{id}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{getDisplayValue(alunos?.length ? alunos : aluno)}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatDateValue(data)}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatTimeValue(horaInicio)}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatTimeValue(horaFim)}</td>
      <td
        className="px-4 py-3 text-sm text-gray-800 underline align-middle cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          abrirRota(getDisplayValue(condominio));
        }}
      >
        {getDisplayValue(condominio)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{getDisplayValue(professor)}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{getDisplayValue(rebatedor)}</td>
      <td className="px-4 py-3 text-sm text-gray-800 align-middle">{getDisplayValue(auxiliar)}</td>
      <td className="px-4 py-2 text-sm font-semibold align-middle">
        <span className={`px-3 py-1 rounded-full ${statusStyle}`}>
          {statusLabel}
        </span>
      </td>
    </tr>
  );
}
