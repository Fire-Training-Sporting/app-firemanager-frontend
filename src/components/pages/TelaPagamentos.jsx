import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../utils/Header";
import AlertMessage from "../utils/AlertMessage";
import AgendamentosTh from "../utils/Agendamentos/AgendamentosTh";
import api, { getAllPages } from "../../provider/api";
import { formatarData, formatarHora, formatarValor, getUsuarioId } from "../../utils/helpers";
import leftBlackIcon from "../../assets/left_black.png";
import rightBlackIcon from "../../assets/right_black.png";

function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function obterPeriodoUltimos15Dias(dataAtual = new Date()) {
    const dataInicio = new Date(dataAtual);
    dataInicio.setDate(dataInicio.getDate() - 15);
    return {
        inicio: formatarDataLocal(dataInicio),
        fim: formatarDataLocal(dataAtual),
    };
}

// Mesmo formato de data da tabela de agendamentos (dd/mm/aaaa)
function formatarDataBR(valor) {
    const match = String(valor ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : formatarData(valor);
}

const STATUS_STYLE = {
    confirmado: "bg-green-100 text-green-700",
    pendente: "bg-yellow-100 text-yellow-700",
    cancelado: "bg-red-100 text-red-700",
    finalizado: "bg-[#F8821E] text-white",
};

function StatusBadge({ status }) {
    const statusNormalizado = String(status || "").trim().toLowerCase();
    if (!statusNormalizado) return "-";

    return (
        <span className={`px-3 py-1 rounded-full ${STATUS_STYLE[statusNormalizado] || "bg-gray-100 text-gray-700"}`}>
            {statusNormalizado.charAt(0).toUpperCase() + statusNormalizado.slice(1)}
        </span>
    );
}

function HistoricoAulasTable({ aulas, loading, currentPage, totalPages, totalItems, onPageChange }) {
    const totalPagesExibidas = Math.max(1, totalPages);

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
                <thead className="bg-white">
                    <tr className="border-b-2 border-gray-200">
                        <AgendamentosTh>ID</AgendamentosTh>
                        <AgendamentosTh>Aluno</AgendamentosTh>
                        <AgendamentosTh>Data</AgendamentosTh>
                        <AgendamentosTh>Hora Início</AgendamentosTh>
                        <AgendamentosTh>Hora Fim</AgendamentosTh>
                        <AgendamentosTh>Condomínio</AgendamentosTh>
                        <AgendamentosTh>Professor</AgendamentosTh>
                        <AgendamentosTh>Rebatedor</AgendamentosTh>
                        <AgendamentosTh>Auxiliar</AgendamentosTh>
                        <AgendamentosTh>Status</AgendamentosTh>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {!loading && aulas.length > 0 ? (
                        aulas.map((agendamento) => (
                            <tr key={agendamento.id} className="border-b border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-orange-100 transition-colors duration-150">
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle font-semibold">{agendamento.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarValor(agendamento.alunos?.length ? agendamento.alunos : agendamento.aluno)}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarDataBR(agendamento.data)}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarHora(agendamento.horaInicio)}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarHora(agendamento.horaFim)}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarValor(agendamento.condominio)}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarValor(agendamento.professor)}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarValor(agendamento.rebatedor)}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 align-middle">{formatarValor(agendamento.auxiliar)}</td>
                                <td className="px-4 py-2 text-sm font-semibold align-middle">
                                    <StatusBadge status={agendamento.status} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="p-4 text-center text-gray-500">
                                {loading ? "Carregando..." : "Nenhum agendamento encontrado para o período selecionado."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex items-center justify-between gap-4 px-4 py-2 border-t border-gray-200 bg-white">
                <div className="text-xs text-gray-600">
                    {totalItems} agendamentos no total
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0 || loading}
                        className={`inline-flex items-center px-3 py-1 text-sm leading-5 rounded-md border border-gray-300 ${currentPage === 0 || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        <img src={leftBlackIcon} alt="" className="-ml-1.5 h-4 w-4 shrink-0" />
                        Anterior
                    </button>
                    <div className="text-xs">
                        Página {currentPage + 1} de {totalPagesExibidas}
                    </div>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={totalPages === 0 || currentPage >= totalPages - 1 || loading}
                        className={`inline-flex items-center px-3 py-1 text-sm leading-5 rounded-md border border-gray-300 ${totalPages === 0 || currentPage >= totalPages - 1 || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        Próxima
                        <img src={rightBlackIcon} alt="" className="-mr-1.5 h-4 w-4 shrink-0" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function TelaPagamentos() {
    const role = sessionStorage.getItem("cargo") || "";
    const isAdmin = ["adm", "root", "administracao"].includes(role.toLowerCase());
    const periodoPadrao = useMemo(() => obterPeriodoUltimos15Dias(), []);
    const [dataInicio, setDataInicio] = useState(periodoPadrao.inicio);
    const [dataFim, setDataFim] = useState(periodoPadrao.fim);
    const [erroData, setErroData] = useState("");
    const [agendamentos, setAgendamentos] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalAgendamentos, setTotalAgendamentos] = useState(0);
    const [resumoAulas, setResumoAulas] = useState({ professor: 0, rebatedor: 0, auxiliar: 0 });
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioSelecionadoId, setFuncionarioSelecionadoId] = useState("");
    const [loading, setLoading] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    const usuarioLogadoId = getUsuarioId();
    const usuarioAlvoId = isAdmin ? funcionarioSelecionadoId : usuarioLogadoId;

    useEffect(() => {
        async function carregarFuncionarios() {
            if (!isAdmin) {
                return;
            }

            try {
                const usuarios = await getAllPages("/usuarios", { status: "TODOS" });
                const listaFuncionarios = usuarios.filter((usuario) =>
                        ["professor", "rebatedor", "auxiliar"].includes(
                            usuario.tipoUsuario?.cargo?.toLowerCase()
                        )
                    );

                setFuncionarios(listaFuncionarios);

                if (listaFuncionarios.length > 0) {
                    setFuncionarioSelecionadoId((idAtual) => idAtual || String(listaFuncionarios[0].id));
                }
            } catch (error) {
                console.error("Erro ao buscar funcionários para pagamentos:", error);
            }
        }

        carregarFuncionarios();
    }, [isAdmin]);

    const carregarHistorico = useCallback(async (pagina = 0) => {
            if (!usuarioAlvoId) {
                setAgendamentos([]);
                setPaginaAtual(0);
                setTotalPaginas(0);
                setTotalAgendamentos(0);
                setResumoAulas({ professor: 0, rebatedor: 0, auxiliar: 0 });
                setLoading(false);
                return;
            }

            if (dataInicio && dataFim && dataInicio > dataFim) {
                setAgendamentos([]);
                setPaginaAtual(0);
                setTotalPaginas(0);
                setTotalAgendamentos(0);
                setResumoAulas({ professor: 0, rebatedor: 0, auxiliar: 0 });
                setLoading(false);
                return;
            }

            setLoading(true);
            setErroCarregamento("");

            try {
                const params = new URLSearchParams({
                    participanteId: String(usuarioAlvoId),
                    page: String(pagina),
                    size: "10",
                });
                if (dataInicio) params.set("dataInicio", dataInicio);
                if (dataFim) params.set("dataFim", dataFim);

                const responseHistorico = await api.get("/agendamentos/historico-pagamentos", { params });

                const { pagina: paginaResponse, ...resumo } = responseHistorico.data;
                setAgendamentos(paginaResponse?.content || []);
                setPaginaAtual(Number(paginaResponse?.page) || 0);
                setTotalPaginas(Number(paginaResponse?.totalPages) || 0);
                setTotalAgendamentos(Number(paginaResponse?.totalElements) || 0);
                setResumoAulas({
                    professor: Number(resumo.aulasComoProfessor) || 0,
                    rebatedor: Number(resumo.aulasComoRebatedor) || 0,
                    auxiliar: Number(resumo.aulasComoAuxiliar) || 0,
                });
            } catch (error) {
                console.error("Erro ao buscar dados do backend:", error);
                setErroCarregamento("Não foi possível carregar os dados de pagamentos.");
            } finally {
                setLoading(false);
            }
    }, [usuarioAlvoId, dataInicio, dataFim]);

    useEffect(() => {
        carregarHistorico(0);
    }, [carregarHistorico]);

    useEffect(() => {
        if (dataInicio && dataFim && dataInicio > dataFim) {
            setErroData("A data inicial não pode ser maior que a data final.");
        } else {
            setErroData("");
        }
    }, [dataInicio, dataFim]);

    function handleFuncionarioChange(event) {
        setFuncionarioSelecionadoId(event.target.value);
    }

    const aulasComoProfessorCount = resumoAulas.professor;
    const aulasComoRebatedorCount = resumoAulas.rebatedor;
    const aulasComoAuxiliarCount = resumoAulas.auxiliar;

    return (
        <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
            <Header />

            <main className="mx-auto w-[90%] flex-1 py-4">
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#23272F] sm:text-4xl">
                    {isAdmin ? "Pagamentos" : "Suas aulas"}
                </h1>

                <div className="mb-5 flex justify-start">
                    <div className="flex w-full flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm xl:w-auto">
                        <div className="flex min-w-36 flex-1 flex-col gap-1">
                            <label htmlFor="pagamentos-data-inicio" className="text-xs font-semibold text-slate-500">Data inicial</label>
                            <input
                                id="pagamentos-data-inicio"
                                type="date"
                                value={dataInicio}
                                max={dataFim || undefined}
                                onChange={(e) => setDataInicio(e.target.value)}
                                className="min-w-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="flex min-w-36 flex-1 flex-col gap-1">
                            <label htmlFor="pagamentos-data-fim" className="text-xs font-semibold text-slate-500">Data final</label>
                            <input
                                id="pagamentos-data-fim"
                                type="date"
                                value={dataFim}
                                min={dataInicio}
                                onChange={(e) => setDataFim(e.target.value)}
                                className="min-w-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {isAdmin && (
                            <div className="flex min-w-52 flex-1 flex-col gap-1 xl:flex-none">
                                <label htmlFor="pagamentos-funcionario" className="text-xs font-semibold text-slate-500">Funcionário</label>
                                <select
                                    id="pagamentos-funcionario"
                                    value={funcionarioSelecionadoId}
                                    onChange={handleFuncionarioChange}
                                    className="min-w-0 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="">Selecione um funcionário</option>
                                    {funcionarios.map((funcionario) => (
                                        <option key={funcionario.id} value={funcionario.id}>
                                            {funcionario.nome}{funcionario.arquivado ? " (arquivado)" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                setDataInicio("");
                                setDataFim("");
                            }}
                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-150 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                        >
                            Limpar
                        </button>
                    </div>
                </div>

                <AlertMessage variant="error" message={erroData} />
                <AlertMessage variant="error" message={erroCarregamento} />

                <div className="mb-5 grid grid-cols-2 items-stretch gap-3 sm:gap-4 xl:grid-cols-4">
                    {[
                        { label: "Total de aulas", value: totalAgendamentos },
                        { label: "Aulas como professor", value: aulasComoProfessorCount },
                        { label: "Aulas como rebatedor", value: aulasComoRebatedorCount },
                        { label: "Aulas como auxiliar", value: aulasComoAuxiliarCount },
                    ].map((kpi, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 border-t-2 border-t-[#F8821E] bg-white p-3 shadow-md sm:p-4">
                            <div className="flex min-w-0 flex-col items-start gap-1.5">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">{kpi.label}</p>
                                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 sm:text-xs">Período selecionado</span>
                            </div>
                            <p className="shrink-0 text-3xl font-bold tracking-tight text-[#23272F] sm:text-4xl">{kpi.value}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <HistoricoAulasTable
                        aulas={agendamentos}
                        loading={loading}
                        currentPage={paginaAtual}
                        totalPages={totalPaginas}
                        totalItems={totalAgendamentos}
                        onPageChange={carregarHistorico}
                    />
                </div>
            </main>
        </div>
    );
}
