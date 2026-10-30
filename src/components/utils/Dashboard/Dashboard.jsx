import api, { getAllPages } from "../../../provider/api";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function criarPeriodoAtual() {
    const hoje = new Date();
    return {
        inicio: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`,
        fim: formatarDataLocal(hoje),
    };
}

function deslocarData(data, dias) {
    const resultado = new Date(`${data}T00:00:00Z`);
    resultado.setUTCDate(resultado.getUTCDate() + dias);
    return resultado.toISOString().slice(0, 10);
}

function obterDataRegistro(valor) {
    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
        return formatarDataLocal(valor);
    }

    const data = String(valor ?? "").slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : "";
}

function normalizarTexto(valor) {
    return String(valor ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function extrairIdentificador(valor) {
    if (valor == null || valor === "") return "";
    if (typeof valor === "object") {
        return String(valor.id ?? valor.codigo ?? valor.value ?? valor._id ?? "");
    }
    return String(valor);
}

function criarIntervalos(dataInicio, dataFim) {
    const dias = Math.round(
        (Date.parse(`${dataFim}T00:00:00Z`) - Date.parse(`${dataInicio}T00:00:00Z`))
        / 86400000
    ) + 1;
    const intervalos = [];
    const inicio = new Date(`${dataInicio}T00:00:00Z`);
    const fim = new Date(`${dataFim}T00:00:00Z`);
    const granularidade = dias <= 14 ? "dia" : dias <= 90 ? "semana" : "mes";

    for (let cursor = inicio; cursor <= fim;) {
        const proximo = new Date(cursor);
        if (granularidade === "dia") {
            proximo.setUTCDate(proximo.getUTCDate() + 1);
        } else if (granularidade === "semana") {
            proximo.setUTCDate(proximo.getUTCDate() + 7);
        } else {
            proximo.setUTCMonth(proximo.getUTCMonth() + 1, 1);
        }

        const dataFinal = new Date(Math.min(proximo.getTime() - 86400000, fim.getTime()));
        const formatar = (data) => data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            timeZone: "UTC",
        });
        const label = granularidade === "mes"
            ? cursor.toLocaleDateString("pt-BR", { month: "short", year: "2-digit", timeZone: "UTC" })
            : granularidade === "semana"
                ? `${formatar(cursor)} - ${formatar(dataFinal)}`
                : formatar(cursor);

        intervalos.push({
            inicio: cursor.toISOString().slice(0, 10),
            fim: dataFinal.toISOString().slice(0, 10),
            label,
        });
        cursor = new Date(dataFinal);
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return intervalos;
}

function Indicador({ titulo, valor, detalhe, tendencia, positivo = true }) {
    return (
        <article className="flex min-h-32 flex-col justify-between rounded-lg border border-gray-200 border-t-2 border-t-[#F8821E] bg-white p-4 shadow-md sm:p-5">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{titulo}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[#23272F]">{valor}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
                {tendencia !== undefined && (
                    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${positivo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {positivo ? "+" : ""}{tendencia}%
                    </span>
                )}
                <span className="text-xs text-slate-500">{detalhe}</span>
            </div>
        </article>
    );
}

function EstadoVazio({ children }) {
    return (
        <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-slate-500">
            {children}
        </p>
    );
}

export function Dashboard() {
    const [usuarios, setUsuarios] = useState([]);
    const [condominios, setCondominios] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [agendamentosAnteriores, setAgendamentosAnteriores] = useState([]);
    const [periodoFiltro, setPeriodoFiltro] = useState(criarPeriodoAtual);
    const [periodoConsultado, setPeriodoConsultado] = useState(periodoFiltro);
    const [abaAtiva, setAbaAtiva] = useState("geral");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [erroData, setErroData] = useState("");

    useEffect(() => {
        let cancelado = false;

        async function buscarDados() {
            const diasNoPeriodo = Math.round(
                (Date.parse(`${periodoConsultado.fim}T00:00:00Z`)
                    - Date.parse(`${periodoConsultado.inicio}T00:00:00Z`))
                / 86400000
            ) + 1;
            const periodoAnterior = {
                inicio: deslocarData(periodoConsultado.inicio, -diasNoPeriodo),
                fim: deslocarData(periodoConsultado.inicio, -1),
            };

            setLoading(true);
            setErro("");

            try {
                const [usuariosResponse, condominiosResponse, agendamentosAtuais, agendamentosAnterioresResponse] =
                    await Promise.all([
                        getAllPages("/usuarios", { status: "TODOS" }),
                        api.get("/condominios"),
                        getAllPages("/agendamentos", {
                            dataInicio: periodoConsultado.inicio,
                            dataFim: periodoConsultado.fim,
                            sort: "data,asc",
                        }),
                        getAllPages("/agendamentos", {
                            dataInicio: periodoAnterior.inicio,
                            dataFim: periodoAnterior.fim,
                            sort: "data,asc",
                        }),
                    ]);

                if (!cancelado) {
                    setUsuarios(usuariosResponse);
                    setCondominios(condominiosResponse.data);
                    setAgendamentos(agendamentosAtuais);
                    setAgendamentosAnteriores(agendamentosAnterioresResponse);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
                if (!cancelado) {
                    setUsuarios([]);
                    setCondominios([]);
                    setAgendamentos([]);
                    setAgendamentosAnteriores([]);
                    setErro("Não foi possível carregar os dados do dashboard.");
                }
            } finally {
                if (!cancelado) setLoading(false);
            }
        }

        buscarDados();
        return () => {
            cancelado = true;
        };
    }, [periodoConsultado]);

    const usuariosNoPeriodo = usuarios.filter((usuario) => {
        const data = obterDataRegistro(
            usuario.criadoEm ?? usuario.createdAt ?? usuario.dataCriacao ?? usuario.dataCadastro
        );
        return data >= periodoConsultado.inicio && data <= periodoConsultado.fim;
    });
    const alunos = usuarios.filter(
        (usuario) => normalizarTexto(usuario.tipoUsuario?.cargo) === "aluno"
    );
    const novosAlunos = usuariosNoPeriodo.filter(
        (usuario) => normalizarTexto(usuario.tipoUsuario?.cargo) === "aluno"
    );
    const totalAgendamentos = agendamentos.length;
    const concluidos = agendamentos.filter((agendamento) =>
        ["concluido", "finalizado"].includes(normalizarTexto(agendamento.status))
    ).length;
    const cancelados = agendamentos.filter(
        (agendamento) => normalizarTexto(agendamento.status) === "cancelado"
    ).length;
    const taxaConclusao = totalAgendamentos > 0
        ? (concluidos / totalAgendamentos) * 100
        : 0;
    const mediaPorCondominio = condominios.length > 0
        ? totalAgendamentos / condominios.length
        : 0;

    const usuariosPeriodoAnterior = usuarios.filter((usuario) => {
        const data = obterDataRegistro(
            usuario.criadoEm ?? usuario.createdAt ?? usuario.dataCriacao ?? usuario.dataCadastro
        );
        const diasNoPeriodo = Math.round(
            (Date.parse(`${periodoConsultado.fim}T00:00:00Z`)
                - Date.parse(`${periodoConsultado.inicio}T00:00:00Z`))
            / 86400000
        ) + 1;
        const inicioAnterior = deslocarData(periodoConsultado.inicio, -diasNoPeriodo);
        return data >= inicioAnterior && data < periodoConsultado.inicio
            && normalizarTexto(usuario.tipoUsuario?.cargo) === "aluno";
    });
    const alunosPeriodoAnterior = usuariosPeriodoAnterior.length;
    const percentualAlunos = alunosPeriodoAnterior > 0
        ? ((novosAlunos.length - alunosPeriodoAnterior) / alunosPeriodoAnterior) * 100
        : novosAlunos.length > 0 ? 100 : 0;
    const percentualAgendamentos = agendamentosAnteriores.length > 0
        ? ((totalAgendamentos - agendamentosAnteriores.length) / agendamentosAnteriores.length) * 100
        : totalAgendamentos > 0 ? 100 : 0;

    const intervalos = criarIntervalos(periodoConsultado.inicio, periodoConsultado.fim);
    const concluidosPorIntervalo = intervalos.map(({ inicio, fim }) =>
        agendamentos.filter((agendamento) => {
            const data = obterDataRegistro(agendamento.data ?? agendamento.criadoEm);
            return data >= inicio && data <= fim
                && ["concluido", "finalizado"].includes(normalizarTexto(agendamento.status));
        }).length
    );
    const canceladosPorIntervalo = intervalos.map(({ inicio, fim }) =>
        agendamentos.filter((agendamento) => {
            const data = obterDataRegistro(agendamento.data ?? agendamento.criadoEm);
            return data >= inicio && data <= fim
                && normalizarTexto(agendamento.status) === "cancelado";
        }).length
    );

    const opcoesGrafico = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: "index", intersect: false },
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { color: "#475569", maxRotation: 0, autoSkip: true },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: { color: "#475569", precision: 0 },
                grid: { color: "rgba(15, 23, 42, 0.08)" },
            },
        },
    };
    const dadosGrafico = {
        labels: intervalos.map((intervalo) => intervalo.label),
        datasets: [
            {
                label: "Concluídos",
                data: concluidosPorIntervalo,
                backgroundColor: "#f97316",
                borderRadius: 6,
            },
            {
                label: "Cancelados",
                data: canceladosPorIntervalo,
                backgroundColor: "#cbd5e1",
                borderRadius: 6,
            },
        ],
    };

    const contagemPorCondominio = {};
    agendamentos.forEach((agendamento) => {
        const condominio = agendamento.condominio
            ?? agendamento.condominioId
            ?? agendamento.fk_condominio
            ?? agendamento.fkCondominio;
        const chave = extrairIdentificador(condominio)
            || normalizarTexto(typeof condominio === "object" ? condominio.nome : condominio);
        if (chave) contagemPorCondominio[chave] = (contagemPorCondominio[chave] || 0) + 1;
    });
    const condominiosDestaque = condominios
        .map((condominio) => ({
            ...condominio,
            valor: contagemPorCondominio[extrairIdentificador(condominio.id)]
                || contagemPorCondominio[normalizarTexto(condominio.nome)]
                || 0,
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);
    const maiorContagemCondominio = Math.max(
        ...condominiosDestaque.map((condominio) => condominio.valor),
        1
    );

    const aulasPorProfessor = {};
    agendamentos.forEach((agendamento) => {
        const professorId = extrairIdentificador(agendamento.professor ?? agendamento.professorId);
        if (professorId) aulasPorProfessor[professorId] = (aulasPorProfessor[professorId] || 0) + 1;
    });
    const professores = usuarios
        .filter((usuario) => normalizarTexto(usuario.tipoUsuario?.cargo) === "professor")
        .map((professor) => ({
            id: professor.id,
            nome: professor.nome,
            iniciais: professor.nome?.split(" ").map((parte) => parte[0]).slice(0, 2).join("") || "",
            aulas: aulasPorProfessor[String(professor.id)] || 0,
        }))
        .sort((a, b) => b.aulas - a.aulas)
        .slice(0, 5);

    const agendamentosPorAluno = {};
    agendamentos
        .filter((agendamento) =>
            ["concluido", "finalizado", "cancelado"].includes(normalizarTexto(agendamento.status))
        )
        .forEach((agendamento) => {
            const status = normalizarTexto(agendamento.status);
            const participantes = [
                ...(Array.isArray(agendamento.alunos) ? agendamento.alunos : []),
                agendamento.aluno ?? agendamento.usuarioId,
            ];
            const alunosDoAgendamento = new Set(
                participantes.map(extrairIdentificador).filter(Boolean)
            );

            alunosDoAgendamento.forEach((alunoId) => {
                if (!agendamentosPorAluno[alunoId]) {
                    agendamentosPorAluno[alunoId] = { finalizados: 0, cancelados: 0 };
                }
                if (["concluido", "finalizado"].includes(status)) {
                    agendamentosPorAluno[alunoId].finalizados += 1;
                } else {
                    agendamentosPorAluno[alunoId].cancelados += 1;
                }
            });
        });
    const alunosRanking = alunos
        .map((aluno) => {
            const contagem = agendamentosPorAluno[String(aluno.id)] || { finalizados: 0, cancelados: 0 };
            const totalAvaliados = contagem.finalizados + contagem.cancelados;
            const frequenciaPercentual = totalAvaliados > 0
                ? (contagem.finalizados / totalAvaliados) * 100
                : 0;
            return {
                id: aluno.id,
                nome: aluno.nome,
                frequencia: `${frequenciaPercentual.toFixed(1)}%`,
                frequenciaPercentual,
                ...contagem,
            };
        })
        .sort((a, b) => b.frequenciaPercentual - a.frequenciaPercentual
            || b.finalizados - a.finalizados)
        .slice(0, 5);

    function aplicarFiltro() {
        if (
            !periodoFiltro.inicio
            || !periodoFiltro.fim
            || periodoFiltro.inicio > periodoFiltro.fim
        ) {
            setErroData("Informe um intervalo válido: a data inicial deve ser anterior ou igual à data final.");
            return;
        }
        setErroData("");
        setPeriodoConsultado({ ...periodoFiltro });
    }

    function limparFiltro() {
        const periodoAtual = criarPeriodoAtual();
        setPeriodoFiltro(periodoAtual);
        setErroData("");
        setPeriodoConsultado(periodoAtual);
    }

    const periodoLegivel = `${new Date(`${periodoConsultado.inicio}T00:00:00`).toLocaleDateString("pt-BR")} a ${new Date(`${periodoConsultado.fim}T00:00:00`).toLocaleDateString("pt-BR")}`;

    return (
        <main className="mx-auto flex w-[90%] max-w-[1600px] flex-1 flex-col py-4 text-slate-900 lg:h-[100dvh] lg:min-h-0 lg:overflow-y-auto">
            <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#23272F] sm:text-4xl">Dashboard administrativa</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Indicadores e análises de {periodoLegivel}
                    </p>
                </div>

                <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex min-w-32 flex-1 flex-col gap-1">
                        <label htmlFor="dashboard-data-inicio" className="text-xs font-semibold text-slate-500">Data inicial</label>
                        <input
                            id="dashboard-data-inicio"
                            type="date"
                            value={periodoFiltro.inicio}
                            max={periodoFiltro.fim || undefined}
                            onChange={(event) => setPeriodoFiltro((periodo) => ({ ...periodo, inicio: event.target.value }))}
                            className="min-w-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="flex min-w-32 flex-1 flex-col gap-1">
                        <label htmlFor="dashboard-data-fim" className="text-xs font-semibold text-slate-500">Data final</label>
                        <input
                            id="dashboard-data-fim"
                            type="date"
                            value={periodoFiltro.fim}
                            min={periodoFiltro.inicio || undefined}
                            onChange={(event) => setPeriodoFiltro((periodo) => ({ ...periodo, fim: event.target.value }))}
                            className="min-w-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={aplicarFiltro}
                        disabled={loading}
                        className="rounded-md bg-[#2563EA] px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-150 hover:bg-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-60"
                    >
                        Filtrar
                    </button>
                    <button
                        type="button"
                        onClick={limparFiltro}
                        disabled={loading}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-150 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-60"
                    >
                        Mês atual
                    </button>
                </div>
            </div>

            {erroData && (
                <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {erroData}
                </p>
            )}
            {erro && (
                <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {erro}
                </p>
            )}
            {loading && (
                <p role="status" className="mb-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700">
                    Carregando dados do período...
                </p>
            )}

            <div className="mb-4 flex gap-2 border-b border-gray-200" role="tablist" aria-label="Seções da dashboard">
                {[
                    { id: "geral", label: "Visão geral" },
                    { id: "rankings", label: "Rankings e análises" },
                ].map((aba) => (
                    <button
                        key={aba.id}
                        type="button"
                        role="tab"
                        id={`dashboard-tab-${aba.id}`}
                        aria-selected={abaAtiva === aba.id}
                        aria-controls={`dashboard-panel-${aba.id}`}
                        onClick={() => setAbaAtiva(aba.id)}
                        className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${abaAtiva === aba.id ? "border-[#F8821E] text-[#23272F]" : "border-transparent text-slate-500 hover:text-[#23272F]"}`}
                    >
                        {aba.label}
                    </button>
                ))}
            </div>

            <section
                id="dashboard-panel-geral"
                role="tabpanel"
                aria-labelledby="dashboard-tab-geral"
                hidden={abaAtiva !== "geral"}
                aria-busy={loading}
                className="min-h-0 flex-1"
            >
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    <Indicador
                        titulo="Novos alunos no período"
                        valor={novosAlunos.length}
                        detalhe="comparado ao intervalo anterior"
                        tendencia={percentualAlunos.toFixed(1)}
                        positivo={percentualAlunos >= 0}
                    />
                    <Indicador
                        titulo="Agendamentos no período"
                        valor={totalAgendamentos}
                        detalhe="comparado ao intervalo anterior"
                        tendencia={percentualAgendamentos.toFixed(1)}
                        positivo={percentualAgendamentos >= 0}
                    />
                    <Indicador
                        titulo="Taxa de conclusão"
                        valor={`${taxaConclusao.toFixed(0)}%`}
                        detalhe={`${cancelados} cancelados`}
                    />
                    <Indicador
                        titulo="Média por condomínio"
                        valor={mediaPorCondominio.toFixed(1)}
                        detalhe="agendamentos por condomínio no período"
                    />
                </div>

                <div className="mt-4 grid min-h-[500px] min-w-0 gap-4 lg:min-h-[380px] lg:flex-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
                    <article className="flex min-w-0 flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-5">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-[#23272F]">Evolução de agendamentos</h2>
                                <p className="text-sm text-slate-500">Aulas concluídas e canceladas no intervalo</p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-orange-500" />Concluídos</span>
                                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />Cancelados</span>
                            </div>
                        </div>
                        <div className="h-[300px] min-h-0 flex-1 lg:h-auto">
                            <Bar data={dadosGrafico} options={opcoesGrafico} />
                        </div>
                    </article>

                    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-5">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-[#23272F]">Condomínios em destaque</h2>
                            <p className="text-sm text-slate-500">Agendamentos no período selecionado</p>
                        </div>
                        <div className="space-y-4">
                            {condominiosDestaque.length > 0 ? condominiosDestaque.map((condominio) => (
                                <div key={condominio.id ?? condominio.nome}>
                                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                                        <span className="min-w-0 truncate font-medium text-slate-700">{condominio.nome}</span>
                                        <span className="shrink-0 font-bold text-slate-900">{condominio.valor}</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-sm bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-orange-500"
                                            style={{ width: `${(condominio.valor / maiorContagemCondominio) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <EstadoVazio>Não há condomínios cadastrados.</EstadoVazio>
                            )}
                        </div>
                    </article>
                </div>
            </section>

            <section
                id="dashboard-panel-rankings"
                role="tabpanel"
                aria-labelledby="dashboard-tab-rankings"
                hidden={abaAtiva !== "rankings"}
                aria-busy={loading}
                className="min-h-0 flex-1"
            >
                <div className="grid gap-4 lg:grid-cols-2">
                    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-5">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-[#23272F]">Ranking de professores</h2>
                            <p className="text-sm text-slate-500">Agendamentos no período selecionado</p>
                        </div>
                        <div className="space-y-2.5">
                            {professores.length > 0 ? professores.map((professor, index) => (
                                <div key={professor.id} className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2.5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-100 text-sm font-bold text-orange-700">
                                            {professor.iniciais || index + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-[#23272F]">{index + 1}. {professor.nome}</p>
                                            <p className="text-xs text-slate-500">Professor</p>
                                        </div>
                                    </div>
                                    <p className="shrink-0 text-right font-bold text-slate-900">
                                        {professor.aulas}<span className="ml-1 text-xs font-normal text-slate-500">aulas</span>
                                    </p>
                                </div>
                            )) : (
                                <EstadoVazio>Nenhum professor encontrado.</EstadoVazio>
                            )}
                        </div>
                    </article>

                    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-5">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-[#23272F]">Ranking de alunos</h2>
                            <p className="text-sm text-slate-500">Frequência em aulas avaliadas no período</p>
                        </div>
                        <div className="space-y-2.5">
                            {alunosRanking.length > 0 ? alunosRanking.map((aluno, index) => (
                                <div key={aluno.id} className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2.5">
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-[#23272F]">{index + 1}. {aluno.nome}</p>
                                        <p className="truncate text-xs text-slate-500">
                                            Frequência {aluno.frequencia} · {aluno.finalizados} concluídos · {aluno.cancelados} cancelados
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-right font-bold text-slate-900">
                                        {aluno.finalizados}<span className="ml-1 text-xs font-normal text-slate-500">aulas</span>
                                    </p>
                                </div>
                            )) : (
                                <EstadoVazio>Nenhum aluno encontrado.</EstadoVazio>
                            )}
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}
