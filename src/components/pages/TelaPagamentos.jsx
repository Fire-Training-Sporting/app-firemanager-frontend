import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../utils/Header";
import AlertMessage from "../utils/AlertMessage";
import api, { getAllPages } from "../../provider/api";
import { formatarData, formatarHora, formatarValor, getUsuarioId } from "../../utils/helpers";

function HistoricoAulasTable({ aulas, loading, currentPage, totalPages, totalItems, onPageChange }) {
    const totalPagesExibidas = Math.max(1, totalPages);
    const startItem = totalItems === 0 ? 0 : currentPage * 10 + 1;
    const endItem = Math.min(totalItems, (currentPage + 1) * 10);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
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
                    <thead className="bg-slate-200">
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Aluno</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Data</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Hora Início</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Hora Fim</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Condomínio</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Professor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Rebatedor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Auxiliar</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-800">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {!loading && aulas.length > 0 ? (
                            aulas.map((agendamento) => (
                                <tr key={agendamento.id} className="border-b border-gray-100 odd:bg-white even:bg-gray-100 hover:bg-orange-100 transition-colors duration-150">
                                    <td className="px-4 py-3 text-sm text-slate-700">{agendamento.id}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarValor(agendamento.aluno)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarData(agendamento.data)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarHora(agendamento.horaInicio)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarHora(agendamento.horaFim)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{formatarValor(agendamento.condominio)}</td>
                                    <td className="px-4 py-3 text-sm text-sky-600 font-medium">{formatarValor(agendamento.professor)}</td>
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

            <div className="flex items-center justify-between gap-4 px-5 pt-4 border-t border-slate-200 mt-4 mb-4">
                <div className="text-xs text-slate-500">
                    Mostrando {startItem}-{endItem} de {totalItems}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0 || loading}
                        className={`px-2 py-0.5 text-sm rounded-md border ${currentPage === 0 || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        Anterior
                    </button>
                    <div className="text-xs">
                            Página {currentPage + 1} de {totalPagesExibidas}
                    </div>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={totalPages === 0 || currentPage >= totalPages - 1 || loading}
                        className={`px-2 py-0.5 text-sm rounded-md border ${totalPages === 0 || currentPage >= totalPages - 1 || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}

export function TelaPagamentos() {
    const role = sessionStorage.getItem("cargo") || "";
    const isAdmin = ["adm", "root", "administracao"].includes(role.toLowerCase());
    const hoje = useMemo(() => {
        const data = new Date();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${data.getFullYear()}-${mes}-${dia}`;
    }, []);

    const [dataInicio, setDataInicio] = useState(hoje);
    const [dataFim, setDataFim] = useState(hoje);
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
                const usuarios = await getAllPages("/usuarios");
                const listaFuncionarios = usuarios.filter((usuario) =>
                        ["professor", "rebatedor", "auxiliar"].includes(
                            usuario.tipoUsuario?.cargo?.toLowerCase()
                        )
                    );

                setFuncionarios(listaFuncionarios);

                if (!funcionarioSelecionadoId && listaFuncionarios.length > 0) {
                    setFuncionarioSelecionadoId(String(listaFuncionarios[0].id));
                }
            } catch (error) {
                console.error("Erro ao buscar funcionários para pagamentos:", error);
            }
        }

        carregarFuncionarios();
    }, [isAdmin, funcionarioSelecionadoId]);

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

    const funcionarioSelecionado = funcionarios.find((usuario) => String(usuario.id) === String(funcionarioSelecionadoId));

    function handleFuncionarioChange(event) {
        setFuncionarioSelecionadoId(event.target.value);
    }

    const aulasComoProfessorCount = resumoAulas.professor;
    const aulasComoRebatedorCount = resumoAulas.rebatedor;
    const aulasComoAuxiliarCount = resumoAulas.auxiliar;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden ">
            <Header />

            <div className="mx-auto w-full max-w-screen-2xl px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Suas aulas</h1>
                    <p className="text-sm text-slate-500">Visualize pagamentos e histórico de aulas por período.</p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Filtrar por período</h2>
                        <p className="text-sm text-slate-500">Selecione o intervalo de datas para atualizar os resultados.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Data inicial</label>
                            <input
                                type="date"
                                value={dataInicio}
                                max={dataFim || undefined}
                                onChange={(e) => setDataInicio(e.target.value)}
                                className="outline-none text-sm bg-transparent text-slate-700"
                            />
                        </div>

                        <div className="h-10 w-px bg-slate-200" />

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Data final</label>
                            <input
                                type="date"
                                value={dataFim}
                                min={dataInicio}
                                onChange={(e) => setDataFim(e.target.value)}
                                className="outline-none text-sm bg-transparent text-slate-700"
                            />
                        </div>

                        {isAdmin && (
                            <div className="flex flex-col gap-1 w-56">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Funcionário</label>
                                <select
                                    value={funcionarioSelecionadoId}
                                    onChange={handleFuncionarioChange}
                                    className="outline-none text-sm bg-transparent text-slate-700"
                                >
                                    <option value="">Selecione um funcionário</option>
                                    {funcionarios.map((funcionario) => (
                                        <option key={funcionario.id} value={funcionario.id}>
                                            {funcionario.nome}
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
                            className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-300"
                        >
                            Limpar
                        </button>
                    </div>
                </div>

                <AlertMessage variant="error" message={erroData} />
                <AlertMessage variant="error" message={erroCarregamento} />

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 items-stretch mb-6">
                    {[
                        { label: "Total de aulas", value: totalAgendamentos },
                        { label: "Aulas como professor", value: aulasComoProfessorCount },
                        { label: "Aulas como rebatedor", value: aulasComoRebatedorCount },
                        { label: "Aulas como auxiliar", value: aulasComoAuxiliarCount },
                    ].map((kpi, index) => (
                        <div key={index} className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-white to-slate-50 p-3 sm:p-4 border border-slate-200 shadow-sm h-32 sm:h-36 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-100 opacity-60" />
                            <div className="relative">
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium sm:text-[10px] sm:tracking-[0.25em]">{kpi.label}</p>
                                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">{kpi.value}</p>
                            </div>
                            <div className="relative flex items-center gap-2 text-[11px] text-slate-500">
                                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-700 font-semibold sm:px-2.5 sm:text-[11px]">Último período</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full h-full">
                    <HistoricoAulasTable
                        aulas={agendamentos}
                        loading={loading}
                        currentPage={paginaAtual}
                        totalPages={totalPaginas}
                        totalItems={totalAgendamentos}
                        onPageChange={carregarHistorico}
                    />
                </div>
            </div>
        </div>
    );
}
