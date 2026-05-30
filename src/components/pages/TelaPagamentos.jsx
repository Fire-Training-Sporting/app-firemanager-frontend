import { useEffect, useMemo, useState } from "react";
import Header from "../utils/Header";

const aulasBase = [
    {
        id: 1180,
        aluno: "Marina Souza",
        data: "2026-04-16",
        horaInicio: "10:00",
        horaFim: "11:00",
        condominio: "Residencial Atlântico",
        professor: "Carlos Henrique",
        rebatedor: "Felipe Costa",
        auxiliar: "-",
        servico: "Tênis",
        funcao: "Professor",
        status: "Confirmada",
        saldo: 1,
    },
    {
        id: 1181,
        aluno: "João Pedro",
        data: "2026-04-17",
        horaInicio: "13:00",
        horaFim: "14:00",
        condominio: "Residencial Atlântico",
        professor: "Carlos Henrique",
        rebatedor: "Felipe Costa",
        auxiliar: "Lucas Rocha",
        servico: "Beach Tennis",
        funcao: "Rebatedor",
        status: "Cancelada",
        saldo: 0,
    },
    {
        id: 1182,
        aluno: "Ana Clara",
        data: "2026-04-20",
        horaInicio: "16:00",
        horaFim: "17:00",
        condominio: "Condomínio Green Park",
        professor: "Carlos Henrique",
        rebatedor: "-",
        auxiliar: "Lucas Rocha",
        servico: "Tênis",
        funcao: "Professor",
        status: "Confirmada",
        saldo: 1,
    },
    {
        id: 1183,
        aluno: "Bruno Lima",
        data: "2026-04-24",
        horaInicio: "09:00",
        horaFim: "10:00",
        condominio: "Condomínio Green Park",
        professor: "Carlos Henrique",
        rebatedor: "Felipe Costa",
        auxiliar: "-",
        servico: "Beach Tennis",
        funcao: "Rebatedor",
        status: "Confirmada",
        saldo: 1,
    },
    {
        id: 1184,
        aluno: "Larissa Alves",
        data: "2026-05-03",
        horaInicio: "08:00",
        horaFim: "09:00",
        condominio: "Residencial Oceano",
        professor: "Carlos Henrique",
        rebatedor: "Felipe Costa",
        auxiliar: "Lucas Rocha",
        servico: "Tênis",
        funcao: "Professor",
        status: "Confirmada",
        saldo: 1,
    },
    {
        id: 1185,
        aluno: "Eduarda Martins",
        data: "2026-05-05",
        horaInicio: "11:00",
        horaFim: "12:00",
        condominio: "Residencial Oceano",
        professor: "Carlos Henrique",
        rebatedor: "-",
        auxiliar: "Lucas Rocha",
        servico: "Personal",
        funcao: "Auxiliar",
        status: "Confirmada",
        saldo: 1,
    },
    {
        id: 1186,
        aluno: "Pedro Henrique",
        data: "2026-05-10",
        horaInicio: "15:00",
        horaFim: "16:00",
        condominio: "Residencial Atlântico",
        professor: "Carlos Henrique",
        rebatedor: "Felipe Costa",
        auxiliar: "-",
        servico: "Tênis",
        funcao: "Professor",
        status: "Cancelada",
        saldo: 0,
    },
    {
        id: 1187,
        aluno: "Camila Ribeiro",
        data: "2026-05-12",
        horaInicio: "10:00",
        horaFim: "11:00",
        condominio: "Residencial Atlântico",
        professor: "Carlos Henrique",
        rebatedor: "Felipe Costa",
        auxiliar: "Lucas Rocha",
        servico: "Beach Tennis",
        funcao: "Professor",
        status: "Confirmada",
        saldo: 1,
    },
    {
        id: 1188,
        aluno: "Gustavo Nunes",
        data: "2026-05-15",
        horaInicio: "09:00",
        horaFim: "10:00",
        condominio: "Condomínio Green Park",
        professor: "Carlos Henrique",
        rebatedor: "Felipe Costa",
        auxiliar: "-",
        servico: "Tênis",
        funcao: "Rebatedor",
        status: "Pendente",
        saldo: 0,
    },
    {
        id: 1189,
        aluno: "Patrícia Gomes",
        data: "2026-05-19",
        horaInicio: "17:00",
        horaFim: "18:00",
        condominio: "Residencial Oceano",
        professor: "Carlos Henrique",
        rebatedor: "-",
        auxiliar: "Lucas Rocha",
        servico: "Personal",
        funcao: "Auxiliar",
        status: "Confirmada",
        saldo: 1,
    },
];

const statusColor = {
    Confirmada: "bg-green-100 text-green-700",
    Pendente: "bg-[#ffd700]/25 text-[#b88600]",
    Cancelada: "bg-red-100 text-red-700",
};

function formatarData(isoDate) {
    if (!isoDate) return "-";

    const data = new Date(`${isoDate}T12:00:00`);
    if (Number.isNaN(data.getTime())) {
        return String(isoDate);
    }

    return data.toLocaleDateString("pt-BR");
}

function formatarHora(hora) {
    if (!hora) return "-";

    return String(hora).slice(0, 5);
}

function formatarValor(valor) {
    if (valor == null || valor === "") {
        return "-";
    }

    if (typeof valor === "object") {
        return valor.nome ?? valor.descricao ?? valor.titulo ?? "-";
    }

    return String(valor);
}

function HistoricoAulasTable({ aulas }) {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = aulas.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageItems = aulas.slice(startIndex, endIndex);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const goPrev = () => setCurrentPage((page) => Math.max(1, page - 1));
    const goNext = () => setCurrentPage((page) => Math.min(totalPages, page + 1));

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 gap-4">
                <h2 className="text-sm font-semibold text-gray-700">
                    Histórico de aulas no período
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                        ({totalItems} registro{totalItems !== 1 ? "s" : ""})
                    </span>
                </h2>
                <p className="text-xs text-gray-500">Tabela paginada no mesmo padrão visual de agendamentos.</p>
            </div>

            <div className="w-full overflow-x-auto">
                <div className="h-fit">
                    <table className="w-full border-separate border-spacing-0 rounded-lg">
                        <thead className="sticky top-0 z-10 bg-white">
                            <tr className="border-b-2 border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Aluno</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Data</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Hora Início</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Hora Fim</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Condomínio</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Professor</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Rebatedor</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Auxiliar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {pageItems.length > 0 ? (
                                pageItems.map((aula) => (
                                    <tr key={aula.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-700">{aula.id}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{aula.aluno}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarData(aula.data)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarHora(aula.horaInicio)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarHora(aula.horaFim)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(aula.condominio)}</td>
                                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">{aula.professor}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(aula.rebatedor)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(aula.auxiliar)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="p-6 text-center text-gray-500">
                                        Nenhuma aula encontrada para o período selecionado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 px-0 pt-3 border-t mt-4">
                <div className="text-xs text-gray-600">
                    Mostrando {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(totalItems, endIndex)} de {totalItems}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goPrev}
                        disabled={currentPage === 1}
                        className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        Anterior
                    </button>
                    <div className="text-xs">
                        Página {currentPage} de {totalPages}
                    </div>
                    <button
                        onClick={goNext}
                        disabled={currentPage === totalPages}
                        className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}

export function TelaPagamentos() {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [erroData, setErroData] = useState("");

    const hoje = useMemo(() => {
        const data = new Date();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${data.getFullYear()}-${mes}-${dia}`;
    }, []);

    useEffect(() => {
        if (dataInicio && dataFim && dataInicio > dataFim) {
            setErroData("A data inicial não pode ser maior que a data final.");
        } else if (dataFim && dataFim > hoje) {
            setErroData("A data final não pode ser maior que hoje.");
        } else {
            setErroData("");
        }
    }, [dataInicio, dataFim, hoje]);

    const aulasFiltradas = useMemo(() => {
        if (erroData) return [];

        return aulasBase.filter((aula) => {
            if (dataInicio && aula.data < dataInicio) return false;
            if (dataFim && aula.data > dataFim) return false;
            return true;
        });
    }, [dataInicio, dataFim, erroData]);

    const saldoTotal = useMemo(
        () => aulasFiltradas.reduce((soma, aula) => soma + aula.saldo, 0),
        [aulasFiltradas]
    );
    const aulasComoProfessor = useMemo(
        () => aulasFiltradas.filter((aula) => String(aula.funcao).toLowerCase() === "professor").length,
        [aulasFiltradas]
    );
    const aulasComoRebatedor = useMemo(
        () => aulasFiltradas.filter((aula) => String(aula.funcao).toLowerCase() === "rebatedor").length,
        [aulasFiltradas]
    );
    const aulasComoAuxiliar = useMemo(
        () => aulasFiltradas.filter((aula) => String(aula.funcao).toLowerCase() === "auxiliar").length,
        [aulasFiltradas]
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 min-h-0 px-6 py-4 flex flex-col gap-3 overflow-hidden xl:px-8">
                <div className="flex justify-between items-center gap-4 flex-wrap shrink-0">
                    <div>
                        <h1 className="font-bold text-xl text-gray-900 mb-0.5 xl:text-2xl">Aulas do professor</h1>
                        <p className="text-sm text-gray-500">Resumo do período com indicadores e histórico detalhado</p>
                    </div>

                    <div className="flex gap-2 items-end flex-wrap justify-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Inicial</label>
                            <input
                                type="date"
                                value={dataInicio}
                                max={dataFim || hoje}
                                onChange={(e) => setDataInicio(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Final</label>
                            <input
                                type="date"
                                value={dataFim}
                                min={dataInicio}
                                max={hoje}
                                onChange={(e) => setDataFim(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                            />
                        </div>
                        {(dataInicio || dataFim) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setDataInicio("");
                                    setDataFim("");
                                }}
                                className="px-3 py-2 text-xs text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors bg-white"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>

                {erroData && <div className="mt-2 text-xs text-red-600 font-semibold">{erroData}</div>}

                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 shrink-0">
                    {[
                        { label: "Saldo total", value: saldoTotal },
                        { label: "Aulas como professor", value: aulasComoProfessor },
                        { label: "Aulas como rebatedor", value: aulasComoRebatedor },
                        { label: "Aulas como auxiliar", value: aulasComoAuxiliar },
                    ].map((kpi, index) => (
                        <div key={index} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-200">
                            <p className="text-[11px] text-gray-500 mb-1.5 leading-tight">{kpi.label}</p>
                            <p className="text-2xl font-bold text-gray-900 xl:text-3xl">{kpi.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex-1 min-h-0 overflow-hidden">
                    <HistoricoAulasTable aulas={aulasFiltradas} />
                </div>
            </div>
        </div>
    );
}
