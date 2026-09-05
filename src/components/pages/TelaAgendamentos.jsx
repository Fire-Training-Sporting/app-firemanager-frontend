import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import SearchFilter from '../utils/SearchFilter';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';
import ModalAgendamentoDetalhes from '../utils/Agendamentos/ModalAgendamentoDetalhes';
import ConfirmationModal from '../utils/ConfirmationModal';
import AlertMessage from '../utils/AlertMessage';
import api from "../../provider/api";

const search_columns = [
  { label: "Aluno", value: "aluno" },
  { label: "ID", value: "id" },
  { label: "Data", value: "data" },
  { label: "Condomínio", value: "condominio" },
  { label: "Professor", value: "professor" },
  { label: "Status", value: "status" },
];

function getUsuarioLogado() {
  const usuarioString = sessionStorage.getItem("usuario");

  if (!usuarioString) {
    return null;
  }

  try {
    return JSON.parse(usuarioString);
  } catch {
    return null;
  }
}

function getUsuarioId(usuario) {
  return sessionStorage.getItem("userId") ?? usuario?.userId ?? usuario?.id ?? null;
}

function getItemId(value) {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value === "object") {
    return value.id ?? value.codigo ?? value.value ?? null;
  }

  return value;
}

function normalizarCargo(cargo) {
  return String(cargo ?? "").trim().toLowerCase();
}

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
  const [agendamentosOriginais, setAgendamentosOriginais] = useState([]);
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
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/agendamentos");
      const agendamentosPermitidos = filtrarAgendamentosPorCargo(
        response.data,
        cargo,
        usuarioId
      );

      setAgendamentos(agendamentosPermitidos);
      setAgendamentosOriginais(agendamentosPermitidos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizarTextoBusca = (valor) => String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const valorParaTextoBusca = (valor) => {
    if (valor == null || valor === "") {
      return "";
    }

    if (Array.isArray(valor)) {
      return valor
        .map((item) => valorParaTextoBusca(item))
        .filter(Boolean)
        .join(" ");
    }

    if (typeof valor === "object") {
      return [
        valor.nome,
        valor.nomeCompleto,
        valor.descricao,
        valor.titulo,
        valor.razaoSocial,
        valor.aluno?.nome,
        valor.id,
      ]
        .map((item) => (item == null ? "" : String(item)))
        .filter(Boolean)
        .join(" ");
    }

    if (valor instanceof Date) {
      return valor.toLocaleDateString("pt-BR");
    }

    return String(valor);
  };

  const obterValorBuscaAgendamento = (agendamento, field) => {
    if (field === "aluno") {
      return [
        valorParaTextoBusca(agendamento?.aluno),
        valorParaTextoBusca(agendamento?.alunos),
      ]
        .filter(Boolean)
        .join(" ");
    }

    return valorParaTextoBusca(agendamento?.[field]);
  };

  const filtrarAgendamentos = async ({ field, value }) => {
    try {
      setIsLoading(true);

      if (!value.trim()) {
        setAgendamentos(agendamentosOriginais);
        return;
      }

      // Filtro local para melhor performance
      const filtrados = agendamentosOriginais.filter((agendamento) => {
        const compareValue = normalizarTextoBusca(value);
        const fieldString = normalizarTextoBusca(obterValorBuscaAgendamento(agendamento, field));
        return fieldString.includes(compareValue);
      });

      setAgendamentos(filtrados);
    } catch (error) {
      console.error("Erro ao filtrar agendamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarDados = () => {
    setEditAgendamento(null);
    setShowModal(true);
  };

  const extrairId = (value) => {
    if (value == null || value === "") {
      return "";
    }

    if (typeof value === "object") {
      const id = value.id ?? value.codigo ?? value.value ?? value._id ?? "";
      return String(id);
    }

    return String(value);
  };

  const extrairNome = (value) => {
    if (value == null || value === "") {
      return "";
    }

    if (typeof value === "object") {
      return value.nome ?? value.descricao ?? value.razaoSocial ?? value.titulo ?? "";
    }

    return String(value);
  };

  const formatarData = (valor) => {
    if (!valor) {
      return "";
    }

    if (typeof valor === "string") {
      return valor.slice(0, 10);
    }

    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
      return valor.toISOString().slice(0, 10);
    }

    return String(valor).slice(0, 10);
  };

  const formatarHora = (valor) => {
    if (!valor) {
      return "";
    }

    return String(valor).slice(0, 5);
  };

  const visualizarDetalhes = (agendamento) => {
    setAgendamentoDetalhes(agendamento);
  };

  const exibirSucesso = (mensagem) => {
    setSucessoAgendamento(mensagem);
    setSucessoVisivel(true);

    window.clearTimeout(exibirSucesso.timeoutId);
    exibirSucesso.timeoutId = window.setTimeout(() => {
      setSucessoAgendamento("");
      setSucessoVisivel(false);
    }, 7000);
  };

  const handleAgendamentoSalvo = (acao = "created") => {
    exibirSucesso(
      acao === "updated"
        ? "Agendamento atualizado com sucesso"
        : "Agendamento cadastrado com sucesso"
    );
    buscarDados();
  };

  const normalizarAgendamentoParaModal = (agendamento) => ({
    id: agendamento?.id ?? null,
    data: formatarData(agendamento?.data),
    horaInicio: formatarHora(agendamento?.horaInicio),
    horaFim: formatarHora(agendamento?.horaFim),
    condominio: extrairId(agendamento?.condominio) || agendamento?.condominio?.nome || "",
    aluno: extrairId(agendamento?.aluno),
    alunos: agendamento?.alunos || [],
    servico: extrairId(agendamento?.servico),
    professor: extrairId(agendamento?.professor),
    rebatedor: extrairId(agendamento?.rebatedor),
    auxiliar: extrairId(agendamento?.auxiliar),
    observacao: agendamento?.observacao || "",
    nomes: {
      condominio: extrairNome(agendamento?.condominio),
      aluno: extrairNome(agendamento?.aluno),
      alunos: Array.isArray(agendamento?.alunos)
        ? agendamento.alunos.map((item) => extrairNome(item))
        : [],
      servico: extrairNome(agendamento?.servico),
      professor: extrairNome(agendamento?.professor),
      rebatedor: extrairNome(agendamento?.rebatedor),
      auxiliar: extrairNome(agendamento?.auxiliar),
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
      await buscarDados();
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
      await buscarDados();
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
      await buscarDados();
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
