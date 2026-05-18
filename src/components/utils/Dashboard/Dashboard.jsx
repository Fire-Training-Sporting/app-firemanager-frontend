import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export function Dashboard() {

    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN"];

    const agendamentosData = {
        labels: meses,
        datasets: [
            {
                label: "Agendamentos",
                data: [80, 70, 90, 120, 140, 160],
                backgroundColor: "#d6d3d1"
            }
        ]
    };

    const receitaData = {
        labels: meses,
        datasets: [
            {
                label: "Receita",
                data: [2000, 4000, 4500, 6000, 5500, 8000],
                borderColor: "#d6d3d1",
                backgroundColor: "#d6d3d1",
                tension: 0.3
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                ticks: { color: "#fff" }
            },
            y: {
                ticks: { color: "#fff" }
            }
        }
    };

    const concluidosData = [60, 50, 80, 90, 110, 120];
    const canceladosData = [20, 15, 10, 20, 15, 20];
    const condominiosDestaque = [
        { nome: "Residencial Aurora", valor: 482, progresso: 0.95 },
        { nome: "Parque das Flores", valor: 315, progresso: 0.78 },
        { nome: "Vila Olímpia", valor: 280, progresso: 0.72 },
        { nome: "Grand Palazzo", valor: 212, progresso: 0.62 },
    ];

    const professores = [
        { initials: "RM", nome: "Ricardo Mendes", aulas: 154 },
        { initials: "AS", nome: "Ana Silva", aulas: 142 },
        { initials: "JP", nome: "João Paulo", aulas: 128 },
    ];

    const alunosRanking = [
        { nome: "Beatriz Souza", frequencia: "98%", agendamentos: 100 },
        { nome: "Marcos Vinicius", frequencia: "95%", agendamentos: 95 },
        { nome: "Carlos Eduardo", frequencia: "92%", agendamentos: 73 },
    ];

    const agendamentosDataAtualizado = {
        labels: meses,
        datasets: [
            {
                label: "Concluídos",
                data: concluidosData,
                backgroundColor: "#f97316",
                borderRadius: 12,
            },
            {
                label: "Cancelados",
                data: canceladosData,
                backgroundColor: "#cbd5e1",
                borderRadius: 12,
            },
        ],
    };

    const chartOptionsAtualizado = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { color: "#0f172a", font: { weight: 600 } },
                barPercentage: 0.8,
                categoryPercentage: 1,
            },
            y: {
                stacked: true,
                ticks: { color: "#0f172a", beginAtZero: true },
                grid: { display: true, color: "rgba(15, 23, 42, 0.08)" },
            },
        },
    };

    return (
        <div className="max-h-screen overflow-hidden bg-[#F8F8F8] px-3 py-2 text-slate-900">
            <h1 className="text-2xl font-bold mb-2">Dashboard administrativa</h1>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500 mb-1.5">Novos alunos</div>
                    <div className="flex items-end gap-2">
                        <span className="text-xl font-extrabold text-slate-900">124</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-700">+12%</span>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500 mb-1.5">Total de agendamentos</div>
                    <div className="flex items-end gap-2">
                        <span className="text-xl font-extrabold text-slate-900">1.842</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-700">+5.4%</span>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500 mb-1.5">Taxa conclusão vs cancelamento</div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-900">88%</div>
                        <div>
                            <div className="text-base font-semibold text-slate-900">Conclusão</div>
                            <div className="text-[0.65rem] text-slate-500">12% cancelado • Meta 85%</div>
                        </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: "88%" }} />
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500 mb-1.5">Média por condomínio</div>
                    <div className="text-xl font-extrabold text-slate-900">42.5</div>
                    <div className="text-[0.65rem] text-slate-500 mt-1">sessões/mês</div>
                </div>
            </div>

            <div className="mt-3 grid gap-2 xl:grid-cols-2">
                <div className="xl:col-span-1 rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Evolução de Agendamentos por Mês</h2>
                            <p className="text-[0.65rem] text-slate-500">Performance anual por status</p>
                        </div>
                        <div className="flex items-center gap-2 text-[0.65rem]">
                            <span className="flex items-center gap-2 text-slate-700">
                                <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                                Concluídos
                            </span>
                            <span className="flex items-center gap-2 text-slate-500">
                                <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                                Cancelados
                            </span>
                        </div>
                    </div>
                    <div className="h-[150px]">
                        <Bar data={agendamentosDataAtualizado} options={chartOptionsAtualizado} />
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="mb-2">
                        <h2 className="text-sm font-semibold text-slate-900">Condomínios em Destaque</h2>
                    </div>
                    <div className="space-y-2">
                        {condominiosDestaque.map((condominio) => (
                            <div key={condominio.nome}>
                                <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                                    <span>{condominio.nome}</span>
                                    <span className="font-semibold text-slate-900">{condominio.valor} agend.</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${condominio.progresso * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-2 grid gap-2 lg:grid-cols-2">
                <div className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="mb-1.5">
                        <h2 className="text-sm font-semibold text-slate-900">Ranking de Professores</h2>
                    </div>
                    <div className="space-y-1">
                        {professores.map((professor) => (
                            <div key={professor.nome} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 font-semibold">{professor.initials}</div>
                                    <div>
                                        <div className="font-medium text-slate-900 text-sm">{professor.nome}</div>
                                        <div className="text-[0.65rem] text-slate-500">Professor</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-slate-900">{professor.aulas}</div>
                                    <div className="text-[0.65rem] text-slate-500">Aulas</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-3 shadow-sm border border-slate-200">
                    <div className="mb-1.5">
                        <h2 className="text-sm font-semibold text-slate-900">Ranking de Alunos</h2>
                    </div>
                    <div className="space-y-1">
                        {alunosRanking.map((aluno) => (
                            <div key={aluno.nome} className="rounded-2xl bg-slate-50 p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <div className="font-medium text-slate-900 text-sm">{aluno.nome}</div>
                                        <div className="text-[0.65rem] text-slate-500">Frequência {aluno.frequencia}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-slate-900">{aluno.agendamentos}</div>
                                        <div className="text-[0.65rem] text-slate-500">Agendamentos</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
