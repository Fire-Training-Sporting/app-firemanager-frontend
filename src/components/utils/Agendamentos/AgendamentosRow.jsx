function AgendamentosRow({ agendamento, index, onConfirm, onCancel }) {
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

  const bg = index % 2 === 0 ? colors.bg.orange : colors.bg.darkOrange;

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmado": return colors.bg.green;
      case "pendente": return colors.bg.yellow;
      case "cancelado": return colors.bg.red;
      default: return colors.bg.gray;
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
          className={`flex-1 ${colors.bg.green} ${colors.hoverBg.green} text-white px-4 py-3 rounded-lg font-semibold text-xl`}
        >
          Confirmar
        </button>
        <button
          onClick={() => onCancel(agendamento.id)}
          className={`flex-1 ${colors.bg.red} ${colors.hoverBg.red} text-white px-4 py-3 rounded-lg font-semibold text-xl`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default AgendamentosRow;