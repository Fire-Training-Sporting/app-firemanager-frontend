import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../utils/Header";
import AlertMessage from "../utils/AlertMessage";
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

function HistoricoAulasTable({ aulas, loading, currentPage, totalPages, totalItems, onPageChange }) {
    const totalPagesExibidas = Math.max(1, totalPages);
    const startItem = totalItems === 0 ? 0 : currentPage * 10 + 1;
    const endItem = Math.min(totalItems, (currentPage + 1) * 10);

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <h2 className="text-sm font-semibold text-slate-700 ">
                        Histórico de aulas no período
                        <span className="ml-2 text-xs text-slate-400 font-normal">
                            ({loading ? "carregando" : `${totalItems} registro${totalItems !== 1 ? "s" : ""}`})
                        </span>
                    </h2>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-gray-100">
                        <tr className="border-b border-slate-200">
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">ID</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Aluno</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Data</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Hora Início</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Hora Fim</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Condomínio</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Professor</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Rebatedor</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Auxiliar</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#23272F]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {!loading && aulas.length > 0 ? (
                            aulas.map((agendamento) => (
                                <tr key={agendamento.id} className="border-b border-gray-100 odd:bg-white even:bg-gray-50 hover:bg-orange-50 transition-colors duration-150">
                                    <td className="px-4 py-3 text-sm text-slate-700">{agendamento.id}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarValor(agendamento.aluno)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarData(agendamento.data)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarHora(agendamento.horaInicio)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarHora(agendamento.horaFim)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarValor(agendamento.condominio)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">{formatarValor(agendamento.professor)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarValor(agendamento.rebatedor)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarValor(agendamento.auxiliar)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarValor(agendamento.status)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="p-6 text-center text-gray-500">
                                    Nenhum agendamento encontrado para o período selecionado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
                <div className="text-xs text-slate-500">
                    Mostrando {startItem}-{endItem} de {totalItems}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0 || loading}
                        className={`inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm leading-5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${currentPage === 0 || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
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
                        className={`inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm leading-5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${totalPages === 0 || currentPage >= totalPages - 1 || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
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
                <div className="mb-5">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#23272F] sm:text-4xl">Suas aulas</h1>
                    <p className="text-sm text-slate-500">Visualize pagamentos e histórico de aulas por período.</p>
                </div>

                <div className="mb-5 flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Filtrar por período</h2>
                        <p className="text-sm text-slate-500">Selecione o intervalo de datas para atualizar os resultados.</p>
                    </div>

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
                        <div key={index} className="flex h-32 flex-col justify-between rounded-lg border border-gray-200 border-t-2 border-t-[#F8821E] bg-white p-3 shadow-md sm:h-36 sm:p-4">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">{kpi.label}</p>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-[#23272F] sm:mt-3 sm:text-4xl">{kpi.value}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="rounded-md bg-gray-100 px-2 py-1 font-semibold text-gray-700">Período selecionado</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
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
