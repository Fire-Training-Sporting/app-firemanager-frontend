function AgendamentosRow({ agendamento, index, onConfirm, onCancel }) {
  const bg = index % 2 === 0 ? "bg-orange-300" : "bg-orange-500";

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmado": return "bg-green-500";
      case "pendente": return "bg-yellow-500";
      case "cancelado": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_250px] gap-3 items-center">
      <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
        {agendamento.data}
      </div>
      <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
        {agendamento.horario}
      </div>
      <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
        {agendamento.quadra}
      </div>
      <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
        {agendamento.professor}
      </div>
      <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
        {agendamento.rebatedor}
      </div>
      <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
        {agendamento.auxiliar}
      </div>
      <div className={`text-xl ${getStatusColor(agendamento.status)} p-3 rounded-lg text-center font-semibold text-white`}>
        {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(agendamento.id)}
          className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 text-xl"
        >
          Confirmar
        </button>
        <button
          onClick={() => onCancel(agendamento.id)}
          className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 text-xl"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default AgendamentosRow;