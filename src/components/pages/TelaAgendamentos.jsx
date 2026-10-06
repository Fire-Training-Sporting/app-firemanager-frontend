import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import SearchFilter from '../utils/SearchFilter';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';
import ModalAgendamentoDetalhes from '../utils/Agendamentos/ModalAgendamentoDetalhes';
import ConfirmationModal from '../utils/ConfirmationModal';
import AlertMessage from '../utils/AlertMessage';
import api from "../../provider/api";
import { getUsuarioLogado, getUsuarioId, getItemId, normalizarCargo, formatarData, formatarHora, getItemName, exibirSucesso, formatarValor } from "../../utils/helpers";

const search_columns = [
  { label: "Aluno", value: "aluno" },
  { label: "ID", value: "id" },
  { label: "Data", value: "data" },
  { label: "Condomínio", value: "condominio" },
  { label: "Professor", value: "professor" },
  { label: "Status", value: "status" },
];

function usuarioPodeVerAgendamento(agendamento, cargo, usuarioId) {
  const cargoNormalizado = normalizarCargo(cargo);

  if (cargoNormalizado === "root" || cargoNormalizado === "administracao") {
    return true;
  }

  if (!usuarioId) {
    return false;
  }

  const usuarioIdString = String(usuarioId);

  if (cargoNormalizado === "professor") {
    return [agendamento?.professor, agendamento?.rebatedor, agendamento?.auxiliar].some(
      (participante) => String(getItemId(participante) ?? "") === usuarioIdString
    );
  }

  if (cargoNormalizado === "aluno") {
    const alunoPrincipal = String(getItemId(agendamento?.aluno) ?? "") === usuarioIdString;
    const alunosGrupo = Array.isArray(agendamento?.alunos)
      && agendamento.alunos.some((item) => String(getItemId(item) ?? "") === usuarioIdString);

    return alunoPrincipal || alunosGrupo;
  }

  return false;
}

function filtrarAgendamentosPorCargo(agendamentos, cargo, usuarioId) {
  return (agendamentos || []).filter((agendamento) => usuarioPodeVerAgendamento(agendamento, cargo, usuarioId));
}

export default function TelaAgendamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editAgendamento, setEditAgendamento] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalAgendamentos, setTotalAgendamentos] = useState(0);
  const [filtroAtual, setFiltroAtual] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sucessoAgendamento, setSucessoAgendamento] = useState("");
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const [agendamentoParaConfirmar, setAgendamentoParaConfirmar] = useState(null);
  const [agendamentoDetalhes, setAgendamentoDetalhes] = useState(null);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);
  const [observacaoCancelamento, setObservacaoCancelamento] = useState("");
  const [erroCancelamento, setErroCancelamento] = useState("");
  const [agendamentoParaFinalizar, setAgendamentoParaFinalizar] = useState(null);
  const usuarioLogado = getUsuarioLogado();
  const cargo = sessionStorage.getItem("cargo");
  const usuarioId = getUsuarioId(usuarioLogado);

  useEffect(() => {
    buscarDados(0);
  }, []);

  const buscarDados = async (pagina = paginaAtual, filtro = filtroAtual) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ page: String(pagina), size: "10" });
      if (filtro?.value) {
        params.set("campo", filtro.field);
        params.set("busca", filtro.value);
      }

      const response = await api.get("/agendamentos", { params });
      const paginaResponse = response.data;
      const listaAgendamentos = paginaResponse?.content || [];
      const totalPaginasResposta = Number(paginaResponse?.totalPages) || 0;
      const ultimaPagina = Math.max(0, totalPaginasResposta - 1);

      if (pagina > ultimaPagina) {
        await buscarDados(ultimaPagina, filtro);
        return;
      }

      const agendamentosPermitidos = filtrarAgendamentosPorCargo(
        listaAgendamentos,
        cargo,
        usuarioId
      );
      setAgendamentos(agendamentosPermitidos);
      setPaginaAtual(Number(paginaResponse?.page) || 0);
      setTotalPaginas(totalPaginasResposta);
      setTotalAgendamentos(paginaResponse?.totalElements ?? listaAgendamentos.length);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarAgendamentos = ({ field, value }) => {
    const filtro = value.trim() ? { field, value: value.trim() } : null;
    setFiltroAtual(filtro);
    return buscarDados(0, filtro);
  };

  const mudarPagina = (pagina) => {
    return buscarDados(pagina, filtroAtual);
  };

  const atualizarDados = () => {
    return buscarDados(paginaAtual, filtroAtual);
  };

  const adicionarDados = () => {
    setEditAgendamento(null);
    setShowModal(true);
  };

  const visualizarDetalhes = (agendamento) => {
    setAgendamentoDetalhes(agendamento);
  };

  const exibirSucessoLocal = exibirSucesso(setSucessoAgendamento, setSucessoVisivel);

  const handleAgendamentoSalvo = (acao = "created") => {
    exibirSucessoLocal(
      acao === "updated"
        ? "Agendamento atualizado com sucesso"
        : "Agendamento cadastrado com sucesso"
    );
    atualizarDados();
  };

  const normalizarAgendamentoParaModal = (agendamento) => ({
    id: agendamento?.id ?? null,
    data: formatarData(agendamento?.data),
    horaInicio: formatarHora(agendamento?.horaInicio),
    horaFim: formatarHora(agendamento?.horaFim),
    condominio: getItemId(agendamento?.condominio) || agendamento?.condominio?.nome || "",
    aluno: getItemId(agendamento?.aluno),
    alunos: agendamento?.alunos || [],
    servico: getItemId(agendamento?.servico),
    professor: getItemId(agendamento?.professor),
    rebatedor: getItemId(agendamento?.rebatedor),
    auxiliar: getItemId(agendamento?.auxiliar),
    observacao: agendamento?.observacao || "",
    nomes: {
      condominio: getItemName(agendamento?.condominio),
      aluno: getItemName(agendamento?.aluno),
      alunos: Array.isArray(agendamento?.alunos)
        ? agendamento.alunos.map((item) => getItemName(item))
        : [],
      servico: getItemName(agendamento?.servico),
      professor: getItemName(agendamento?.professor),
      rebatedor: getItemName(agendamento?.rebatedor),
      auxiliar: getItemName(agendamento?.auxiliar),
    },
  });

  const editarDados = (agendamento) => {
    setEditAgendamento(normalizarAgendamentoParaModal(agendamento));
    setShowModal(true);
  };

  const duplicarAgendamento = (agendamento) => {
    const agendamentoNormalizado = normalizarAgendamentoParaModal(agendamento);
    // Remove o ID para criar um novo agendamento
    const agendamentoDuplicado = {
      ...agendamentoNormalizado,
      id: null,
    };
    setEditAgendamento(agendamentoDuplicado);
    setShowModal(true);
  };

  const solicitarCancelamento = (id) => {
    const agendamento = agendamentos.find((item) => item.id === id);
    setAgendamentoParaCancelar(agendamento ?? { id });
    setObservacaoCancelamento(agendamento?.observacao ?? "");
    setErroCancelamento("");
  };

  const cancelarCancelamento = () => {
    setAgendamentoParaCancelar(null);
    setObservacaoCancelamento("");
    setErroCancelamento("");
  };

  const solicitarConfirmacao = (agendamento) => {
    setAgendamentoParaConfirmar(agendamento);
  };

  const solicitarFinalizacao = (agendamento) => {
    setAgendamentoParaFinalizar(agendamento);
  };

  const cancelarConfirmacao = () => {
    setAgendamentoParaConfirmar(null);
  };

  const confirmarAgendamento = async () => {
    if (!agendamentoParaConfirmar?.id) {
      return;
    }

    try {
      await api.patch(`/agendamentos/status/${agendamentoParaConfirmar.id}`, {
        status: "confirmado",
        observacao: agendamentoParaConfirmar.observacao || "",
      });

      exibirSucesso("Agendamento confirmado com sucesso");
      setAgendamentoParaConfirmar(null);
      await atualizarDados();
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      window.alert("Não foi possível confirmar o agendamento. Tente novamente.");
    }
  };

  const confirmarCancelamento = async () => {
    if (!agendamentoParaCancelar?.id) {
      return;
    }

    const observacao = observacaoCancelamento.trim();

    if (!observacao) {
      setErroCancelamento("A observação é obrigatória para cancelar o agendamento.");
      return;
    }

    try {
      await api.patch(`/agendamentos/status/${agendamentoParaCancelar.id}`, {
        status: "cancelado",
        observacao,
      });

      exibirSucesso("Agendamento cancelado com sucesso");
      setAgendamentoParaCancelar(null);
      setObservacaoCancelamento("");
      setErroCancelamento("");
      await atualizarDados();
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      window.alert("Não foi possível cancelar o agendamento. Tente novamente.");
    }
  };

  const cancelarFinalizacao = () => {
    setAgendamentoParaFinalizar(null);
  };

  const confirmarFinalizacao = async () => {
    if (!agendamentoParaFinalizar?.id) return;

    try {
      setIsLoading(true);
      await api.patch(`/agendamentos/status/${agendamentoParaFinalizar.id}`, {
        status: "finalizado",
        observacao: agendamentoParaFinalizar.observacao || "",
      });

      exibirSucesso("Agendamento finalizado com sucesso");
      setAgendamentoParaFinalizar(null);
      await atualizarDados();
    } catch (error) {
      console.error("Erro ao finalizar agendamento:", error);
      window.alert("Não foi possível finalizar o agendamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatarValor = (valor) => {
    if (Array.isArray(valor)) {
      return valor
        .map((item) => {
          if (item && typeof item === "object") {
            return item.nome ?? item.nomeCompleto ?? item.descricao ?? item.titulo ?? item.razaoSocial ?? item.aluno?.nome ?? "-";
          }
          return item ?? "-";
        })
        .filter((item) => item !== "-")
        .join(", ") || "-";
    }

    if (valor && typeof valor === "object") {
      return valor.nome ?? valor.nomeCompleto ?? valor.descricao ?? valor.titulo ?? valor.razaoSocial ?? valor.aluno?.nome ?? "-";
    }

    return valor ?? "-";
  };

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
      title="Agendamentos"
      searchPlaceholder="Pesquisar agendamento..."
      onSearch={buscarDados}
      onAdd={adicionarDados}
      addLabel="Agendar serviço"
      customControls={
        <SearchFilter
          columns={search_columns}
          onSearch={filtrarAgendamentos}
          isLoading={isLoading}
        />
      }
    >
      <AlertMessage
        variant="success"
        message={sucessoVisivel ? sucessoAgendamento : ""}
      />

      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <AgendamentosTable
          agendamentos={agendamentos}
          onViewDetails={visualizarDetalhes}
          currentPage={paginaAtual}
          totalPages={totalPaginas}
          totalElements={totalAgendamentos}
          isLoading={isLoading}
          onPageChange={mudarPagina}
        />
      </div>

      {showModal && (
        <ModalScheduling
          agendamento={editAgendamento}
          onClose={() => setShowModal(false)}
          onCreated={handleAgendamentoSalvo}
        />
      )}

      {agendamentoDetalhes && (
        <ModalAgendamentoDetalhes
          agendamento={agendamentoDetalhes}
          onClose={() => setAgendamentoDetalhes(null)}
          onEdit={() => {
            setAgendamentoDetalhes(null);
            editarDados(agendamentoDetalhes);
          }}
          onConfirm={() => {
            setAgendamentoDetalhes(null);
            solicitarConfirmacao(agendamentoDetalhes);
          }}
          onDelete={() => {
            setAgendamentoDetalhes(null);
            solicitarCancelamento(agendamentoDetalhes.id);
          }}
          onFinalize={() => {
            setAgendamentoDetalhes(null);
            solicitarFinalizacao(agendamentoDetalhes);
          }}
          onDuplicate={() => {
            setAgendamentoDetalhes(null);
            duplicarAgendamento(agendamentoDetalhes);
          }}
        />
      )}



      <ConfirmationModal
        isOpen={!!agendamentoParaConfirmar}
        title="Confirmar agendamento"
        message="Deseja confirmar este agendamento no sistema?"
        items={agendamentoParaConfirmar ? [
          { label: "ID", value: agendamentoParaConfirmar.id },
          { label: "Aluno", value: formatarValor(agendamentoParaConfirmar.aluno) },
          { label: "Data", value: formatarValor(agendamentoParaConfirmar.data) },
          { label: "Hora início", value: formatarValor(agendamentoParaConfirmar.horaInicio) },
          { label: "Hora fim", value: formatarValor(agendamentoParaConfirmar.horaFim) },
          { label: "Condomínio", value: formatarValor(agendamentoParaConfirmar.condominio) },
          { label: "Professor", value: formatarValor(agendamentoParaConfirmar.professor) },
          { label: "Status atual", value: formatarValor(agendamentoParaConfirmar.status) },
        ] : []}
        confirmLabel="Sim, confirmar"
        cancelLabel="Não, cancelar"
        variant="success"
        onCancel={cancelarConfirmacao}
        onConfirm={confirmarAgendamento}
      />

      <ConfirmationModal
        isOpen={!!agendamentoParaCancelar}
        title="Cancelar agendamento"
        message="Informe uma observação para registrar o motivo do cancelamento."
        items={agendamentoParaCancelar ? [
          { label: "ID", value: agendamentoParaCancelar.id },
          { label: "Aluno", value: formatarValor(agendamentoParaCancelar.aluno) },
          { label: "Data", value: formatarValor(agendamentoParaCancelar.data) },
          { label: "Hora início", value: formatarValor(agendamentoParaCancelar.horaInicio) },
          { label: "Hora fim", value: formatarValor(agendamentoParaCancelar.horaFim) },
          { label: "Condomínio", value: formatarValor(agendamentoParaCancelar.condominio) },
          { label: "Professor", value: formatarValor(agendamentoParaCancelar.professor) },
          { label: "Rebatedor", value: formatarValor(agendamentoParaCancelar.rebatedor) },
          { label: "Auxiliar", value: formatarValor(agendamentoParaCancelar.auxiliar) },
          { label: "Status", value: formatarValor(agendamentoParaCancelar.status) },
        ] : []}
        confirmLabel="Sim, cancelar"
        cancelLabel="Não, voltar"
        confirmDisabled={!observacaoCancelamento.trim()}
        onCancel={cancelarCancelamento}
        onConfirm={confirmarCancelamento}
      >
        <div className="space-y-2">
          <label htmlFor="observacao-cancelamento" className="block text-sm font-medium text-gray-700">
            Observação
          </label>
          <textarea
            id="observacao-cancelamento"
            value={observacaoCancelamento}
            onChange={(e) => {
              setObservacaoCancelamento(e.target.value);
              if (erroCancelamento) {
                setErroCancelamento("");
              }
            }}
            rows={4}
            placeholder="Ex.: Chuva forte"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
          <AlertMessage variant="error" message={erroCancelamento} />
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={!!agendamentoParaFinalizar}
        title="Finalizar agendamento"
        message="Deseja marcar este agendamento como finalizado? Esta ação não pode ser desfeita."
        items={agendamentoParaFinalizar ? [
          { label: "ID", value: agendamentoParaFinalizar.id },
          { label: "Aluno", value: formatarValor(agendamentoParaFinalizar.alunos?.length ? agendamentoParaFinalizar.alunos : agendamentoParaFinalizar.aluno) },
          { label: "Data", value: formatarValor(agendamentoParaFinalizar.data) },
          { label: "Hora fim", value: formatarValor(agendamentoParaFinalizar.horaFim) },
          { label: "Status atual", value: formatarValor(agendamentoParaFinalizar.status) },
        ] : []}
        confirmLabel="Sim, finalizar"
        cancelLabel="Não, cancelar"
        variant="success"
        onCancel={cancelarFinalizacao}
        onConfirm={confirmarFinalizacao}
      />
    </PageLayout>
  </div>
  );
}
