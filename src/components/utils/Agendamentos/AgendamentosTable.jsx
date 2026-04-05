import { useState } from "react";
import ModalScheduling from "./ModalScheduling";

const mockAgendamentos = [
    {
        id: 1,
        data: "01/02/2026",
        horario: "08:00",
        quadra: "Quadra A",
        professor: "Bruno",
        rebatedor: "João",
        auxiliar: "Giovana",
        status: "pendente",
    },
    {
        id: 2,
        data: "01/02/2026",
        horario: "09:00",
        quadra: "Quadra B",
        professor: "Kalleb",
        rebatedor: "Lucas",
        auxiliar: "Beatriz",
        status: "confirmado",
    },
    {
        id: 3,
        data: "02/02/2026",
        horario: "10:00",
        quadra: "Quadra C",
        professor: "Vitor",
        rebatedor: "João",
        auxiliar: "Giovana",
        status: "cancelado",
    },
];

function AgendamentosTable() {
    const [agendamentos, setAgendamentos] = useState(mockAgendamentos);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = (newScheduling) => {
        setAgendamentos([...agendamentos, { id: agendamentos.length + 1, ...newScheduling }]);
        setIsModalOpen(false);
    };

    const handleConfirm = (id) => {
        setAgendamentos(
            agendamentos.map((ag) =>
                ag.id === id ? { ...ag, status: "confirmado" } : ag
            )
        );
    };

    const handleCancel = (id) => {
        setAgendamentos(
            agendamentos.map((ag) =>
                ag.id === id ? { ...ag, status: "cancelado" } : ag
            )
        );
    };

    return (
        <div className="bg-white p-12">
            <p className="text-4xl font-bold mb-6 ml-0.5">Agendamentos</p>
            <div className="bg-[#5a5a5a] p-6 rounded-2xl text-white">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-semibold">Filtrar:</span>
                        <button className="text-2xl bg-white text-black px-4 py-1 rounded-2xl font-semibold">
                            Todos
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-xl bg-blue-600 px-4 py-2 rounded-lg font-semibold"
                    >
                        + Novo agendamento
                    </button>
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_150px_150px] gap-2 mb-4">
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Data</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Horário</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Quadra</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Professor</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Rebatedor</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Auxiliar</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Status</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Confirmar</div>
                    <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Cancelar</div>
                </div>

                <div className="flex flex-col gap-3">
                    {agendamentos.map((ag, index) => {
                        const bg = index % 2 === 0 ? "bg-orange-300" : "bg-orange-500";

                        return (
                            <div
                                key={ag.id}
                                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_150px_150px] gap-3 items-center"
                            >
                                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                                    {ag.data}
                                </div>
                                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                                    {ag.horario}
                                </div>
                                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                                    {ag.quadra}
                                </div>
                                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                                    {ag.professor}
                                </div>
                                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                                    {ag.rebatedor}
                                </div>
                                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                                    {ag.auxiliar}
                                </div>
                                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                                    {ag.status}
                                </div>
                                <div className="text-xl p-0 rounded-lg">
                                    <button
                                        onClick={() => handleConfirm(ag.id)}
                                        className="w-full h-12 bg-green-600 rounded-lg text-white font-semibold"
                                    >
                                        Confirmar
                                    </button>

                                </div>
                                <div className="text-xl p-0 rounded-lg">
                                    <button
                                        onClick={() => handleCancel(ag.id)}
                                        className="w-full h-13 bg-red-600 rounded-lg text-white font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ModalScheduling
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}

export default AgendamentosTable;