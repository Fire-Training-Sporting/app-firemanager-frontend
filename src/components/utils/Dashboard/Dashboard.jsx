import api from "../../../provider/api";
import { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";

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

    const [usuarios, setUsuarios] = useState([]);
    const [condominios, setCondominios] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    useEffect(() => {
        buscarDados();
    }, []);

    async function buscarDados() {

        try {

            setLoading(true);

            const [
                responseUsuarios,
                responseCondominios,
                responseAgendamentos
            ] = await Promise.all([
                api.get("/usuarios"),
                api.get("/condominios"),
                api.get("/agendamentos")
            ]);

            setUsuarios(responseUsuarios.data);
            setCondominios(responseCondominios.data);
            setAgendamentos(responseAgendamentos.data);

        } catch (error) {

            console.error("Erro ao buscar dados:", error);

        } finally {

            setLoading(false);

        }
    }

    const usuariosFiltrados = usuarios.filter((usuario) => {

        if (!dataInicio && !dataFim) {
            return true;
        }

        const dataCriacao = new Date(usuario.criadoEm);

        if (dataInicio && dataCriacao < new Date(dataInicio)) {
            return false;
        }

        if (dataFim && dataCriacao > new Date(dataFim + "T23:59:59")) {
            return false;
        }

        return true;
    });

    const alunos = usuariosFiltrados.filter(
        (usuario) =>
            usuario.tipoUsuario?.cargo?.toLowerCase() === "aluno"
    );

    const funcionarios = usuariosFiltrados.filter(
        (usuario) =>
            ["professor", "rebatedor", "auxiliar"].includes(
                usuario.tipoUsuario?.cargo?.toLowerCase()
            )
    );

    const administradores = usuariosFiltrados.filter(
        (usuario) =>
            ["adm", "root"].includes(
                usuario.tipoUsuario?.cargo?.toLowerCase()
            )
    );

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

    const hoje = new Date();

    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const inicioMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

    const alunosMesAtual = usuarios.filter((u) => {
        const data = new Date(u.criadoEm);
        return data >= inicioMesAtual;
    });

    const alunosMesPassado = usuarios.filter((u) => {
        const data = new Date(u.criadoEm);
        return data >= inicioMesPassado && data <= fimMesPassado;
    });

    const atual = alunosMesAtual.length;
    const anterior = alunosMesPassado.length;

    let percentual = 0;

    if (anterior === 0) {
        percentual = atual > 0 ? 100 : 0;
    } else {
        percentual = ((atual - anterior) / anterior) * 100;
    }

    // AGENDAMENTOS
    const agendamentosMesAtual = agendamentos.filter((a) => {
        const data = new Date(a.criadoEm);
        return data >= inicioMesAtual;
    });

    const agendamentosMesPassado = agendamentos.filter((a) => {
        const data = new Date(a.criadoEm);
        return data >= inicioMesPassado && data <= fimMesPassado;
    });

    const atualAg = agendamentosMesAtual.length;
    const anteriorAg = agendamentosMesPassado.length;

    let percentualAg = 0;

    if (anteriorAg === 0) {
        percentualAg = atualAg > 0 ? 100 : 0;
    } else {
        percentualAg = ((atualAg - anteriorAg) / anteriorAg) * 100;
    }

    const crescimentoAg = percentualAg.toFixed(1);
    const isPositivoAg = percentualAg >= 0;

    const totalAgendamentos = agendamentos.length;

    const concluidos = agendamentos.filter(
        (a) => a.status?.toLowerCase() === "concluido"
    ).length;

    const cancelados = agendamentos.filter(
        (a) => a.status?.toLowerCase() === "cancelado"
    ).length;

    let taxaConclusao = 0;

    if (totalAgendamentos > 0) {
        taxaConclusao = (concluidos / totalAgendamentos) * 100;
    }

    const taxaFormatada = taxaConclusao.toFixed(0);

    const totalCondominios = condominios.length;

    let mediaPorCondominio = 0;

    if (totalCondominios > 0) {
        mediaPorCondominio = totalAgendamentos / totalCondominios;
    }

    const mediaFormatada = mediaPorCondominio.toFixed(1);

    const ultimos6Meses = Array.from({ length: 6 }, (_, i) => {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1);

        return {
            label: data.toLocaleString("pt-BR", { month: "short" }).toUpperCase(),
            mes: data.getMonth(),
            ano: data.getFullYear()
        };
    });

    const concluidosPorMes = Array(6).fill(0);
    const canceladosPorMes = Array(6).fill(0);

    agendamentos.forEach((a) => {
        const data = new Date(a.criadoEm);

        ultimos6Meses.forEach((m, index) => {
            if (
                data.getMonth() === m.mes &&
                data.getFullYear() === m.ano
            ) {
                if (a.status?.toLowerCase() === "concluido") {
                    concluidosPorMes[index]++;
                }

                if (a.status?.toLowerCase() === "cancelado") {
                    canceladosPorMes[index]++;
                }
            }
        });
    });

    const meses = ultimos6Meses.map((m) => m.label);

    const agendamentosDataAtualizado = {
        labels: meses,
        datasets: [
            {
                label: "Concluídos",
                data: concluidosPorMes,
                backgroundColor: "#f97316",
                borderRadius: 12,
            },
            {
                label: "Cancelados",
                data: canceladosPorMes,
                backgroundColor: "#cbd5e1",
                borderRadius: 12,
            },
        ],
    };

    const contagemPorCondominio = {};

    agendamentos.forEach((a) => {
        const condominioId =
            a.condominio?.id || a.condominioId;

        if (!condominioId) return;

        contagemPorCondominio[condominioId] =
            (contagemPorCondominio[condominioId] || 0) + 1;
    });

    const condominiosDestaque = condominios
        .map((c) => ({
            id: c.id,
            nome: c.nome,
            valor: contagemPorCondominio[c.id] || 0
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);

    const maxValor = Math.max(
        ...condominiosDestaque.map(c => c.valor),
        1
    );

    const condominiosComProgresso = condominiosDestaque.map((c) => ({
        ...c,
        progresso: c.valor / maxValor
    }));

    const aulasPorProfessor = {};

    agendamentos.forEach((a) => {
        const professorId = a.professor?.id || a.professorId;

        if (!professorId) return;

        aulasPorProfessor[professorId] =
            (aulasPorProfessor[professorId] || 0) + 1;
    });

    const professores = usuariosFiltrados
        .filter((u) => u.tipoUsuario?.cargo?.toLowerCase() === "professor")
        .map((p) => ({
            id: p.id,
            nome: p.nome,
            initials: p.nome
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("") || "",
            aulas: aulasPorProfessor[p.id] || 0
        }))
        .sort((a, b) => b.aulas - a.aulas)
        .slice(0, 5);

    const agendamentosPorAluno = {};

    agendamentos.forEach((a) => {
        const alunoId = a.aluno?.id || a.usuarioId;

        if (!alunoId) return;

        agendamentosPorAluno[alunoId] =
            (agendamentosPorAluno[alunoId] || 0) + 1;
    });

    const alunosRanking = usuariosFiltrados
        .filter((u) => u.tipoUsuario?.cargo?.toLowerCase() === "aluno")
        .map((a) => ({
            id: a.id,
            nome: a.nome,
            frequencia: totalAgendamentos > 0
                ? ((agendamentosPorAluno[a.id] || 0) / totalAgendamentos * 100).toFixed(1) + "%"
                : "0%",
            agendamentos: agendamentosPorAluno[a.id] || 0
        }))
        .sort((a, b) => b.agendamentos - a.agendamentos)
        .slice(0, 5);

    function limparFiltro() {
        setDataInicio("");
        setDataFim("");
    }

    const inicio = dataInicio ? new Date(dataInicio) : null;
    const fim = dataFim ? new Date(dataFim) : null;

    const inicioAtual = inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimAtual = fim || hoje;

    const diferencaDias =
        (fimAtual - inicioAtual) / (1000 * 60 * 60 * 24);

    const inicioAnterior = new Date(inicioAtual);
    inicioAnterior.setDate(inicioAnterior.getDate() - diferencaDias);

    const fimAnterior = new Date(inicioAtual);
    fimAnterior.setDate(fimAnterior.getDate() - 1);

    const alunosPeriodoAtual = usuarios.filter((u) => {
        const data = new Date(u.criadoEm);
        return data >= inicioAtual && data <= fimAtual;
    });

    const alunosPeriodoAnterior = usuarios.filter((u) => {
        const data = new Date(u.criadoEm);
        return data >= inicioAnterior && data <= fimAnterior;
    });

    const atualAlunos = alunosPeriodoAtual.length;
    const anteriorAlunos = alunosPeriodoAnterior.length;

    let percentualAlunos = 0;

    if (anteriorAlunos === 0) {
        percentualAlunos = atualAlunos > 0 ? 100 : 0;
    } else {
        percentualAlunos =
            ((atualAlunos - anteriorAlunos) / anteriorAlunos) * 100;
    }

    const crescimentoAlunos = percentualAlunos.toFixed(1);
    const isPositivo = percentualAlunos >= 0;

    const agendamentosPeriodoAtual = agendamentos.filter((a) => {
        const data = new Date(a.criadoEm);
        return data >= inicioAtual && data <= fimAtual;
    });

    const agendamentosPeriodoAnterior = agendamentos.filter((a) => {
        const data = new Date(a.criadoEm);
        return data >= inicioAnterior && data <= fimAnterior;
    });

    if (anteriorAg === 0) {
        percentualAg = atualAg > 0 ? 100 : 0;
    } else {
        percentualAg =
            ((atualAg - anteriorAg) / anteriorAg) * 100;
    }

    return (
        <div className="min-h-screen bg-[#f1f5f9] px-4 py-4 text-slate-900">

            <h1 className="text-4xl font-black tracking-tight mb-6">
                Dashboard administrativa
            </h1>

            {/* FILTRO DE DATA */}
            <div className="
        flex flex-col md:flex-row
        items-start md:items-center
        justify-between
        gap-4
        mb-6
        ">

                <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        Visão geral
                    </h2>

                    <p className="text-sm text-slate-500">
                        Filtre os dados por período
                    </p>
                </div>

                <div className="
            flex items-center gap-3
            bg-white
            border border-slate-200
            rounded-2xl
            px-4 py-3
            shadow-sm
            ">

                    <div className="flex flex-col">
                        <label className="text-xs text-slate-400 font-medium mb-1">
                            Data inicial
                        </label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="
    outline-none
    text-sm
    bg-transparent
    text-slate-700
    "
                        />
                    </div>

                    <div className="h-10 w-px bg-slate-200" />

                    <div className="flex flex-col">
                        <label className="text-xs text-slate-400 font-medium mb-1">
                            Data final
                        </label>

                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="
    outline-none
    text-sm
    bg-transparent
    text-slate-700
    "
                        />
                    </div>

                    <button className="
                ml-2
                rounded-xl
                bg-orange-500
                px-4 py-2
                text-sm font-semibold
                text-white
                transition-all duration-300
                hover:bg-orange-600
                ">
                        Filtrar
                    </button>
                    <button
                        onClick={limparFiltro}
                        className="
        ml-2
        rounded-xl
        bg-slate-200
        px-4 py-2
        text-sm font-semibold
        text-slate-700
        transition-all duration-300
        hover:bg-slate-300
    "
                    >
                        Limpar
                    </button>
                </div>
            </div>

            {/* TOP CARDS */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-stretch">

                {/* CARD 1 */}
                <div className="
    relative overflow-hidden
    rounded-[28px]
    bg-gradient-to-br from-white to-slate-50
    p-5
    border border-slate-200
    shadow-sm
    h-[190px]
    flex flex-col justify-between
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-xl
">

                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100 opacity-60" />

                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
                            TOTAL DE ALUNOS
                        </p>

                        <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
                            {alunos.length}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`
            rounded-full px-3 py-1 text-xs font-semibold
            ${isPositivo
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }
        `}>
                            {isPositivo ? "+" : ""}{crescimentoAlunos}%
                        </span>

                        <span className="text-xs text-slate-500">
                            comparado ao mês passado
                        </span>
                    </div>
                </div>

                {/* CARD 2 */}
                <div className="
    relative overflow-hidden
    rounded-[28px]
    bg-gradient-to-br from-white to-slate-50
    p-5
    border border-slate-200
    shadow-sm
    h-[190px]
    flex flex-col justify-between
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-xl
">

                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-100 opacity-50 blur-2xl" />

                    <div>
                        <p className="
            text-xs uppercase
            tracking-[0.25em]
            text-slate-400
            font-medium
        ">
                            TOTAL DE AGENDAMENTOS
                        </p>

                        <h2 className="
            mt-4
            text-5xl
            font-black
            tracking-tight
            text-slate-900
        ">
                            {agendamentos.length}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`
            rounded-full
            px-3 py-1
            text-xs font-semibold
            ${isPositivoAg
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }
        `}>
                            {isPositivoAg ? "+" : ""}{crescimentoAg}%
                        </span>

                        <span className="text-xs text-slate-500">
                            comparado ao mês passado
                        </span>
                    </div>
                </div>

                {/* CARD 3 */}
                <div className="
    relative overflow-hidden
    rounded-[28px]
    bg-gradient-to-br from-white to-slate-50
    p-5
    border border-slate-200
    shadow-sm
    h-[190px]
    flex flex-col justify-between
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-xl
">

                    <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-orange-100 opacity-60" />

                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
                            TAXA DE CONCLUSÃO
                        </p>

                        <div className="flex items-center gap-4 mt-4">

                            <div className="
                flex h-16 w-16
                items-center justify-center
                rounded-full
                bg-orange-100
                text-xl
                font-black
                text-orange-600
            ">
                                {taxaFormatada}%
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Conclusão
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    {cancelados} cancelados
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span>Meta</span>
                            <span>85%</span>
                        </div>

                        <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-orange-500"
                                style={{ width: `${taxaConclusao}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* CARD 4 */}
                <div className="
    relative overflow-hidden
    rounded-[28px]
    bg-gradient-to-br from-white to-slate-50
    p-5
    border border-slate-200
    shadow-sm
    h-[190px]
    flex flex-col justify-between
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-xl
">

                    <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-orange-100 opacity-60" />

                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
                            MÉDIA POR CONDOMÍNIO
                        </p>

                        <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
                            {mediaFormatada}
                        </h2>

                        <p className="text-xs text-slate-500 mt-2">
                            sessões por mês
                        </p>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-orange-500"
                            style={{
                                width: `${Math.min((mediaPorCondominio / 100) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* GRÁFICOS */}
            <div className="mt-6 grid gap-4 xl:grid-cols-2">

                {/* GRÁFICO */}
                <div className="
            rounded-[28px]
            bg-white
            p-5
            border border-slate-200
            shadow-sm
            ">

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Evolução de Agendamentos
                            </h2>

                            <p className="text-sm text-slate-500">
                                Performance anual por status
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                                Concluídos
                            </span>

                            <span className="flex items-center gap-2 text-slate-500">
                                <span className="h-3 w-3 rounded-full bg-slate-300"></span>
                                Cancelados
                            </span>
                        </div>
                    </div>

                    <div className="h-[300px]">
                        <Bar
                            data={agendamentosDataAtualizado}
                            options={chartOptionsAtualizado}
                        />
                    </div>
                </div>

                {/* CONDOMÍNIOS */}
                <div className="
    rounded-[28px]
    bg-white
    p-5
    border border-slate-200
    shadow-sm
">

                    <h2 className="text-lg font-bold text-slate-900 mb-5">
                        Condomínios em Destaque
                    </h2>

                    <div className="space-y-5">

                        {condominiosComProgresso.map((condominio) => (
                            <div key={condominio.nome}>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-700">
                                        {condominio.nome}
                                    </span>

                                    <span className="font-bold text-slate-900">
                                        {condominio.valor} agend.
                                    </span>
                                </div>

                                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-orange-500"
                                        style={{
                                            width: `${condominio.progresso * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* RANKINGS */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">

                {/* PROFESSORES */}
                <div className="
    rounded-[28px]
    bg-white
    p-6
    border border-slate-200
    shadow-sm
    min-h-[420px]
    ">

                    <div className="flex items-center justify-between mb-6">

                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                Ranking de Professores
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Professores com mais aulas realizadas
                            </p>
                        </div>

                        <div className="
            h-12 w-12
            rounded-2xl
            bg-orange-100
            flex items-center justify-center
            text-orange-600
            font-black
            text-lg
            ">
                            🏆
                        </div>
                    </div>

                    <div className="space-y-4">

                        {professores.map((professor, index) => (
                            <div
                                key={professor.nome}
                                className="
                    flex items-center justify-between
                    rounded-3xl
                    bg-slate-50
                    p-5
                    transition-all duration-300
                    hover:bg-orange-50
                    hover:shadow-md
                    "
                            >

                                <div className="flex items-center gap-4">

                                    <div className="
                        flex h-14 w-14
                        items-center justify-center
                        rounded-2xl
                        bg-orange-100
                        text-orange-700
                        font-black
                        text-lg
                        ">
                                        {professor.initials}
                                    </div>

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <span className="
                                text-xs
                                px-2 py-1
                                rounded-full
                                bg-orange-100
                                text-orange-700
                                font-bold
                                ">
                                                #{index + 1}
                                            </span>

                                            <div className="font-bold text-lg text-slate-900">
                                                {professor.nome}
                                            </div>
                                        </div>

                                        <div className="text-sm text-slate-500 mt-1">
                                            Professor de quadra
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">

                                    <div className="text-3xl font-black text-slate-900">
                                        {professor.aulas}
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        aulas
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ALUNOS */}
                <div className="
    rounded-[28px]
    bg-white
    p-6
    border border-slate-200
    shadow-sm
    min-h-[420px]
    ">

                    <div className="flex items-center justify-between mb-6">

                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                Ranking de Alunos
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Alunos mais frequentes da plataforma
                            </p>
                        </div>

                        <div className="
            h-12 w-12
            rounded-2xl
            bg-orange-100
            flex items-center justify-center
            text-orange-600
            font-black
            text-lg
            ">
                            🎯
                        </div>
                    </div>

                    <div className="space-y-4">

                        {alunosRanking.map((aluno, index) => (
                            <div
                                key={aluno.nome}
                                className="
                    rounded-3xl
                    bg-slate-50
                    p-5
                    transition-all duration-300
                    hover:bg-orange-50
                    hover:shadow-md
                    "
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <div className="flex items-center gap-2 mb-1">

                                            <span className="
                                text-xs
                                px-2 py-1
                                rounded-full
                                bg-orange-100
                                text-orange-700
                                font-bold
                                ">
                                                #{index + 1}
                                            </span>

                                            <div className="font-bold text-lg text-slate-900">
                                                {aluno.nome}
                                            </div>
                                        </div>

                                        <div className="text-sm text-slate-500">
                                            Frequência {aluno.frequencia}
                                        </div>
                                    </div>

                                    <div className="text-right">

                                        <div className="text-3xl font-black text-slate-900">
                                            {aluno.agendamentos}
                                        </div>

                                        <div className="text-sm text-slate-500">
                                            agendamentos
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}
