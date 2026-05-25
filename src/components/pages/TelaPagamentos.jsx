import { useState, useMemo } from "react";
import Header from "../utils/Header";
import { Bar, Doughnut } from "react-chartjs-2";
import { BeachBall, Dumbbell, TennisBall, User } from "@boxicons/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// ─── Dados mocados completos ────────────────────────────────────────────────
const todasAsAulas = [
    { data: "2026-04-16", horario: "10h - 11h", quadra: "Quadra A", servico: "Tênis",        funcao: "Professor", status: "Confirmada", saldo: 1 },
    { data: "2026-04-17", horario: "13h - 14h", quadra: "Quadra B", servico: "Beach Tennis", funcao: "Rebatedor", status: "Pendente",   saldo: 0 },
    { data: "2026-04-20", horario: "16h - 17h", quadra: "Quadra B", servico: "Tênis",        funcao: "Professor", status: "Cancelada",  saldo: 0 },
    { data: "2026-04-24", horario: "09h - 10h", quadra: "Quadra C", servico: "Beach Tennis", funcao: "Rebatedor", status: "Confirmada", saldo: 1 },
    { data: "2026-05-03", horario: "08h - 09h", quadra: "Quadra A", servico: "Tênis",        funcao: "Professor", status: "Confirmada", saldo: 1 },
    { data: "2026-05-05", horario: "11h - 12h", quadra: "Quadra B", servico: "Personal",   funcao: "Auxiliar",  status: "Confirmada", saldo: 1 },
    { data: "2026-05-10", horario: "15h - 16h", quadra: "Quadra C", servico: "Tênis",        funcao: "Professor", status: "Cancelada",  saldo: 0 },
    { data: "2026-05-12", horario: "10h - 11h", quadra: "Quadra A", servico: "Beach Tennis", funcao: "Professor", status: "Confirmada", saldo: 1 },
    { data: "2026-05-15", horario: "09h - 10h", quadra: "Quadra B", servico: "Tênis",        funcao: "Rebatedor", status: "Pendente",   saldo: 0 },
];

const statusColor = {
    "Confirmada": "bg-green-100 text-green-700",
    "Pendente":   "bg-[#ffd700]/25 text-[#b88600]",
    "Cancelada":  "bg-red-100 text-red-700"
};

const servicoConfig = {
    "Tênis":        { Icon: TennisBall, color: "#ffd700" },
    "Beach Tennis": { Icon: BeachBall, color: "#ff8800" },
    "Personal":   { Icon: Dumbbell, color: "#ef4444" },
};

function formatarData(isoDate) {
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y.slice(2)}`;
}

// ─── Saldo por Serviço ───────────────────────────────────────────────────────
function SaldoServico({ aulas }) {
    const contagem = useMemo(() => {
        const map = {};
        aulas.filter(a => a.status === "Confirmada").forEach(a => {
            map[a.servico] = (map[a.servico] || 0) + 1;
        });
        return map;
    }, [aulas]);

    const total = Object.values(contagem).reduce((s, v) => s + v, 0) || 1;
    const servicos = Object.entries(contagem).sort((a, b) => b[1] - a[1]);

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Saldo por serviço</h2>
            {servicos.length === 0 ? (
                <p className="text-xs text-gray-400 mt-4 text-center">Nenhuma aula confirmada</p>
            ) : (
                <div className="space-y-3.5">
                    {servicos.map(([nome, count]) => {
                        const cfg = servicoConfig[nome] || { Icon: User, color: "#999" };
                        const pct = Math.round((count / total) * 100);
                        const Icon = cfg.Icon;
                        return (
                            <div key={nome} className="flex items-center gap-3">
                                {/* Quadrado com ícone */}
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-base"
                                    style={{ backgroundColor: cfg.color + "28", border: `2px solid ${cfg.color}` }}
                                >
                                    <Icon size="sm" fill={cfg.color} />
                                </div>
                                {/* Label + Barra */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 mb-1.5">{nome}</p>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                                        />
                                    </div>
                                </div>
                                {/* Contagem */}
                                <div className="text-right shrink-0 w-10">
                                    <span className="text-sm font-bold text-gray-800">{count}</span>
                                    <span className="block text-[10px] text-gray-400 leading-tight">Aulas</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Aulas por Semana ────────────────────────────────────────────────────────
function AulasSemana({ aulas }) {
    const confirmadas = [0, 0, 0, 0, 0, 0, 0]; 
    const canceladas  = [0, 0, 0, 0, 0, 0, 0];

    aulas.forEach(a => {
        const dia = new Date(a.data + "T12:00:00").getDay();
        const idx = dia >= 0 && dia <= 6 ? dia : null;
        if (idx === null) return;
        if (a.status === "Confirmada") confirmadas[idx]++;
        else if (a.status === "Cancelada") canceladas[idx]++;
    });

    const data = {
        labels: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"],
        datasets: [
            { label: "Confirmadas", data: confirmadas, backgroundColor: "#ff8800", borderRadius: 4 },
            { label: "Canceladas",  data: canceladas,  backgroundColor: "#ef4444", borderRadius: 4 }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, labels: { font: { size: 11 }, boxWidth: 10, padding: 8 } }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f3f4f6" }, ticks: { stepSize: 1 } }
        }
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Aulas por semana</h2>
            <div className="h-32">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}

// ─── Participação por Função (Donut + legenda lateral) ───────────────────────
function ParticipacaoFuncao({ aulas }) {
    const contagem = useMemo(() => {
        const map = {};
        aulas.filter(a => a.status === "Confirmada").forEach(a => {
            map[a.funcao] = (map[a.funcao] || 0) + 1;
        });
        return map;
    }, [aulas]);

    const funcoes = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
    const cores = ["#ef4444", "#ffd700", "#f5a623", "#22c55e", "#a855f7"];

    const donutData = {
        labels: funcoes.map(([f]) => f),
        datasets: [{
            data: funcoes.map(([, v]) => v),
            backgroundColor: cores,
            borderWidth: 2,
            borderColor: "#fff",
            hoverOffset: 4
        }]
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } }
        }
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Participação por função</h2>
            {funcoes.length === 0 ? (
                <p className="text-xs text-gray-400 mt-4 text-center">Nenhuma aula confirmada</p>
            ) : (
                <div className="flex items-center gap-5">
                    <div className="h-28 w-28 shrink-0">
                        <Doughnut data={donutData} options={donutOptions} />
                    </div>
                    <div className="flex flex-col gap-2.5 flex-1">
                        {funcoes.map(([nome, count], i) => (
                            <div key={nome} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cores[i] }} />
                                    <span className="text-xs text-gray-600">{nome}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Tela Principal ──────────────────────────────────────────────────────────
export function TelaPagamentos() {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Todas");
    const [erroData, setErroData] = useState("");

    // Data de hoje no formato yyyy-mm-dd
    const hoje = useMemo(() => {
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${mm}-${dd}`;
    }, []);

    // Validação de datas
    useMemo(() => {
        if (dataInicio && dataFim && dataInicio > dataFim) {
            setErroData("A data inicial não pode ser maior que a data final.");
        } else if (dataFim && dataFim > hoje) {
            setErroData("A data final não pode ser maior que hoje.");
        } else {
            setErroData("");
        }
    }, [dataInicio, dataFim, hoje]);

    // Filtragem por período — afeta TUDO
    const aulasFiltradas = useMemo(() => {
        if (erroData) return [];
        return todasAsAulas.filter(a => {
            if (dataInicio && a.data < dataInicio) return false;
            if (dataFim && a.data > dataFim) return false;
            return true;
        });
    }, [dataInicio, dataFim, erroData]);

    // KPIs derivados do período
    const saldoTotal = useMemo(() => aulasFiltradas.reduce((s, a) => s + a.saldo, 0), [aulasFiltradas]);
    const confirmadas = useMemo(() => aulasFiltradas.filter(a => a.status === "Confirmada").length, [aulasFiltradas]);
    const canceladas = useMemo(() => aulasFiltradas.filter(a => a.status === "Cancelada").length, [aulasFiltradas]);
    const mediaSemana = useMemo(() => {
        if (!confirmadas) return 0;
        if (!dataInicio || !dataFim) return confirmadas;
        const dias = (new Date(dataFim) - new Date(dataInicio)) / (1000 * 60 * 60 * 24) + 1;
        return Math.round(confirmadas / Math.max(1, dias / 7));
    }, [confirmadas, dataInicio, dataFim]);

    // Tabela com filtro adicional de status
    const historicoExibido = useMemo(() => {
        if (filtroStatus === "Todas") return aulasFiltradas;
        return aulasFiltradas.filter(a => a.status === filtroStatus);
    }, [aulasFiltradas, filtroStatus]);

    return (
        <>
            <Header />

            {/* Título + Filtros de Calendário */}
            <div className="px-24 py-5 bg-gray-50">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-2xl text-gray-900 mb-0.5">Meus Pagamentos</h1>
                        <p className="text-sm text-gray-500">Saldo acumulado por aulas realizadas</p>
                    </div>
                    <div className="flex gap-3 items-end">
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
                                onClick={() => { setDataInicio(""); setDataFim(""); }}
                                className="px-3 py-2 text-xs text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors bg-white"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>
                {erroData && (
                    <div className="mt-2 text-xs text-red-600 font-semibold">
                        {erroData}
                    </div>
                )}
            </div>

            <div className="px-24 pt-0 pb-6 bg-gray-50 space-y-4">
                {/* KPIs */}
                <div className="grid grid-cols-4 gap-4">
                    {/* ...existing code... */}
                    {[
                        { label: "Saldo total no período", value: saldoTotal },
                        { label: "Aulas confirmadas", value: confirmadas },
                        { label: "Aulas canceladas", value: canceladas },
                        { label: "Média por semana", value: mediaSemana },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <p className="text-xs text-gray-500 mb-2 leading-tight">{kpi.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                        </div>
                    ))}
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-3 gap-4">
                    <SaldoServico aulas={aulasFiltradas} />
                    <AulasSemana aulas={aulasFiltradas} />
                    <ParticipacaoFuncao aulas={aulasFiltradas} />
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Histórico de aulas no período
                            <span className="ml-2 text-xs text-gray-400 font-normal">
                                ({historicoExibido.length} registro{historicoExibido.length !== 1 ? "s" : ""})
                            </span>
                        </h2>
                        <div className="flex gap-2">
                            {["Todas", "Confirmada", "Cancelada"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFiltroStatus(f)}
                                    className={`px-3 py-1 border rounded-full text-xs font-medium transition-colors ${
                                        filtroStatus === f
                                            ? "border-orange-500 text-orange-600 bg-orange-50"
                                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    }`}
                                >
                                    {f === "Confirmada" ? "Confirmadas" : f === "Cancelada" ? "Canceladas" : f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gray-200">
                                <tr className="border-b border-gray-200">
                                    {["Data", "Horário", "Quadra", "Serviço", "Função", "Status", "Saldo"].map((col) => (
                                        <th key={col} className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide text-black">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {historicoExibido.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                                            Nenhuma aula encontrada para o período selecionado
                                        </td>
                                    </tr>
                                ) : (
                                    historicoExibido.map((aula, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-2.5 px-3 text-sm text-gray-700">{formatarData(aula.data)}</td>
                                            <td className="py-2.5 px-3 text-sm text-gray-700">{aula.horario}</td>
                                            <td className="py-2.5 px-3 text-sm text-gray-700">{aula.quadra}</td>
                                            <td className="py-2.5 px-3 text-sm text-gray-700">
                                                {aula.servico}
                                            </td>
                                            <td className="py-2.5 px-3 text-sm text-blue-600 font-medium">{aula.funcao}</td>
                                            <td className={`py-2.5 px-3`}>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[aula.status]}`}>
                                                    {aula.status}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-sm font-semibold text-gray-800">
                                                {aula.saldo > 0 ? `+${aula.saldo}` : "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}