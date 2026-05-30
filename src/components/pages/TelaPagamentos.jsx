import { useEffect, useMemo, useState } from "react";
import Header from "../utils/Header";
import api from "../../provider/api";

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

    if (Array.isArray(valor)) {
        return valor
            .map((item) => {
                if (item && typeof item === "object") {
                    return item.nome ?? item.nomeCompleto ?? item.aluno?.nome ?? "-";
                }

                return item ?? "-";
            })
            .filter((item) => item !== "-")
            .join(", ") || "-";
    }

    if (typeof valor === "object") {
        return valor.nome ?? valor.descricao ?? valor.titulo ?? "-";
    }

    return String(valor);
}

function getUsuarioId() {
    const usuarioString = sessionStorage.getItem("usuario");

    if (!usuarioString) {
        return null;
    }

    try {
        const usuario = JSON.parse(usuarioString);
        return sessionStorage.getItem("userId") ?? usuario?.userId ?? usuario?.id ?? null;
    } catch {
        return sessionStorage.getItem("userId");
    }
}

function HistoricoAulasTable({ aulas, loading }) {
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
            <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <h2 className="text-sm font-semibold text-gray-700">
                    Histórico de aulas no período
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                        ({loading ? "carregando" : `${totalItems} registro${totalItems !== 1 ? "s" : ""}`})
                    </span>
                </h2>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {!loading && pageItems.length > 0 ? (
                                pageItems.map((agendamento) => (
                                    <tr key={agendamento.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-700">{agendamento.id}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(agendamento.aluno)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarData(agendamento.data)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarHora(agendamento.horaInicio)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarHora(agendamento.horaFim)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(agendamento.condominio)}</td>
                                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">{formatarValor(agendamento.professor)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(agendamento.rebatedor)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(agendamento.auxiliar)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatarValor(agendamento.status)}</td>
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
    const [saldoProfessor, setSaldoProfessor] = useState(null);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioSelecionadoId, setFuncionarioSelecionadoId] = useState("");
    const [loading, setLoading] = useState(true);

    const usuarioLogadoId = getUsuarioId();
    const usuarioAlvoId = isAdmin ? funcionarioSelecionadoId : usuarioLogadoId;

    useEffect(() => {
        async function carregarFuncionarios() {
            if (!isAdmin) {
                return;
            }

            try {
                const responseUsuarios = await api.get("/usuarios");
                const listaFuncionarios = Array.isArray(responseUsuarios.data)
                    ? responseUsuarios.data.filter((usuario) =>
                        ["professor", "rebatedor", "auxiliar"].includes(
                            usuario.tipoUsuario?.cargo?.toLowerCase()
                        )
                    )
                    : [];

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

    useEffect(() => {
        async function carregarDadosBackend() {
            if (!usuarioAlvoId) {
                setAgendamentos([]);
                setSaldoProfessor(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const [responseSaldo, responseAgendamentos] = await Promise.all([
                    api.get(`/saldos/professor/${usuarioAlvoId}`),
                    api.get("/agendamentos"),
                ]);

                console.log("Saldo do professor:", responseSaldo.data);
                console.log("Agendamentos:", responseAgendamentos.data);

                setSaldoProfessor(responseSaldo.data);
                setAgendamentos(Array.isArray(responseAgendamentos.data) ? responseAgendamentos.data : []);
            } catch (error) {
                console.error("Erro ao buscar dados do backend:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarDadosBackend();
    }, [usuarioAlvoId]);

    useEffect(() => {
        if (dataInicio && dataFim && dataInicio > dataFim) {
            setErroData("A data inicial não pode ser maior que a data final.");
        } else {
            setErroData("");
        }
    }, [dataInicio, dataFim]);

    const funcionarioSelecionado = funcionarios.find((usuario) => String(usuario.id) === String(funcionarioSelecionadoId));
    const nomeProfessor = saldoProfessor?.professor?.nome ?? funcionarioSelecionado?.nome ?? "Professor";

    function handleFuncionarioChange(event) {
        setFuncionarioSelecionadoId(event.target.value);
    }

    function campoCorrespondeUsuario(campo) {
        if (!campo) return false;

        try {
            if (typeof campo === "object") {
                const ids = [campo.id, campo._id, campo.userId, campo.professorId, campo.usuarioId];
                for (const id of ids) {
                    if (id != null && String(id) === String(usuarioId)) return true;
                }

                // comparar por nome quando não houver id
                const nome = campo.nome ?? campo.nomeCompleto ?? campo.name ?? campo.fullName;
                if (nome && String(nome).trim() === String(nomeProfessor).trim()) return true;
                return false;
            }

            // campo é string/number: comparar diretamente com id ou com nome
            if (String(campo) === String(usuarioId)) return true;
            if (String(campo).trim() === String(nomeProfessor).trim()) return true;
            return false;
        } catch {
            return false;
        }
    }

    const agendamentosFiltrados = useMemo(() => {
        if (erroData) return [];

        return agendamentos.filter((agendamento) => {
            const dataAgendamento = String(agendamento?.data ?? "").slice(0, 10);

            if (dataInicio && dataAgendamento < dataInicio) return false;
            if (dataFim && dataAgendamento > dataFim) return false;

            // só incluir agendamentos em que o usuário participa (professor, rebatedor ou auxiliar)
            const participa = campoCorrespondeUsuario(agendamento?.professor) || campoCorrespondeUsuario(agendamento?.rebatedor) || campoCorrespondeUsuario(agendamento?.auxiliar);
            return participa;
        });
    }, [agendamentos, dataInicio, dataFim, erroData, usuarioAlvoId, nomeProfessor]);

    const totalAgendamentos = agendamentosFiltrados.length;
    const confirmados = agendamentosFiltrados.filter((agendamento) => String(agendamento?.status ?? "").toLowerCase().includes("confirm")).length;
    const pendentes = agendamentosFiltrados.filter((agendamento) => String(agendamento?.status ?? "").toLowerCase().includes("pend")).length;
    const cancelados = agendamentosFiltrados.filter((agendamento) => String(agendamento?.status ?? "").toLowerCase().includes("cancel")).length;

    const aulasComoProfessorCount = agendamentosFiltrados.filter((a) => campoCorrespondeUsuario(a?.professor)).length;
    const aulasComoRebatedorCount = agendamentosFiltrados.filter((a) => campoCorrespondeUsuario(a?.rebatedor)).length;
    const aulasComoAuxiliarCount = agendamentosFiltrados.filter((a) => campoCorrespondeUsuario(a?.auxiliar)).length;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 min-h-0 px-6 py-4 flex flex-col gap-3 overflow-hidden xl:px-8">
                <div className="flex justify-between items-center gap-4 flex-wrap shrink-0">
                    <div>
                        <h1 className="font-bold text-xl text-gray-900 mb-0.5 xl:text-2xl">Suas aulas</h1>
                    </div>

                    <div className="flex gap-2 items-end flex-wrap justify-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Inicial</label>
                            <input
                                type="date"
                                value={dataInicio}
                                max={dataFim || undefined}
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
                                
                                onChange={(e) => setDataFim(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                            />
                        </div>

                        {isAdmin && (
                            <div className="flex flex-col gap-1 min-w-70">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Funcionário</label>
                                <select
                                    value={funcionarioSelecionadoId}
                                    onChange={handleFuncionarioChange}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
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
                        { label: "Total de aulas", value: totalAgendamentos },
                        { label: "Aulas como professor", value: aulasComoProfessorCount },
                        { label: "Aulas como rebatedor", value: aulasComoRebatedorCount },
                        { label: "Aulas como auxiliar", value: aulasComoAuxiliarCount },
                    ].map((kpi, index) => (
                        <div key={index} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-200">
                            <p className="text-[11px] text-gray-500 mb-1.5 leading-tight">{kpi.label}</p>
                            <p className="text-2xl font-bold text-gray-900 xl:text-3xl">{kpi.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex-1 min-h-0 overflow-hidden">
                    <HistoricoAulasTable aulas={agendamentosFiltrados} loading={loading} />
                </div>
            </div>
        </div>
    );
}
