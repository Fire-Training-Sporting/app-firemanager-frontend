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

    return (
        <div className="px-24 py-6 min-h-screen">

            {/* Título */}
            <h1 className="font-extrabold text-3xl mb-6">
                Dashboard - Acompanhamento financeiro
            </h1>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-8 text-white">

                <div className="bg-stone-700 rounded-2xl flex flex-col items-center justify-center h-28 shadow-md">
                    <h1 className="text-3xl font-extrabold">R$17.328</h1>
                    <span className="text-lg">Entrada</span>
                </div>

                <div className="bg-stone-700 rounded-2xl flex flex-col items-center justify-center h-28 shadow-md">
                    <h1 className="text-3xl font-extrabold">R$8.927</h1>
                    <span className="text-lg">Saída</span>
                </div>

                <div className="bg-stone-700 rounded-2xl flex flex-col items-center justify-center h-28 shadow-md">
                    <h1 className="text-3xl font-extrabold">108</h1>
                    <span className="text-lg text-center">Agendamentos concluídos</span>
                </div>

                <div className="bg-stone-700 rounded-2xl flex flex-col items-center justify-center h-28 shadow-md">
                    <h1 className="text-3xl font-extrabold">108</h1>
                    <span className="text-lg text-center">Agendamentos concluídos</span>
                </div>

            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">

                {/* Agendamentos */}
                <div className="bg-stone-700 rounded-2xl p-4 text-white shadow-md">
                    <h2 className="mb-4 font-semibold">
                        Agendamentos por mês
                    </h2>
                    <Bar data={agendamentosData} options={chartOptions} />
                </div>

                {/* Receita */}
                <div className="bg-stone-700 rounded-2xl p-4 text-white shadow-md">
                    <h2 className="mb-4 font-semibold">
                        Receita por mês
                    </h2>
                    <Line data={receitaData} options={chartOptions} />
                </div>

            </div>

        </div>
    );
}