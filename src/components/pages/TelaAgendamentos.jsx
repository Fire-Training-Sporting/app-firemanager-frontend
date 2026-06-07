import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import SearchFilter from '../utils/SearchFilter';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';
import ModalScheduling from '../utils/Agendamentos/ModalScheduling';
import ModalAgendamentoDetalhes from '../utils/Agendamentos/ModalAgendamentoDetalhes';
import ConfirmationModal from '../utils/ConfirmationModal';
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
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState(null);
  const [agendamentoParaConfirmar, setAgendamentoParaConfirmar] = useState(null);
  const [agendamentoDetalhes, setAgendamentoDetalhes] = useState(null);
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

  const filtrarAgendamentos = async ({ field, value }) => {
    try {
      setIsLoading(true);

      if (!value.trim()) {
        setAgendamentos(agendamentosOriginais);
        return;
      }

      // Filtro local para melhor performance
      const filtrados = agendamentosOriginais.filter((agendamento) => {
        const fieldValue = agendamento[field];
        let compareValue = value.toLowerCase();

        // Converter valor do campo para string para comparação
        let fieldString = "";

        if (typeof fieldValue === "object" && fieldValue !== null) {
          fieldString = fieldValue.nome ? fieldValue.nome.toLowerCase() : "";
        } else if (typeof fieldValue === "string") {
          fieldString = fieldValue.toLowerCase();
        } else if (typeof fieldValue === "number") {
          fieldString = fieldValue.toString().toLowerCase();
        } else if (fieldValue instanceof Date) {
          fieldString = fieldValue.toLocaleDateString("pt-BR").toLowerCase();
        }

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
      return String(value.id ?? value.codigo ?? value.value ?? "");
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

  const normalizarAgendamentoParaModal = (agendamento) => ({
    id: agendamento?.id ?? null,
    data: formatarData(agendamento?.data),
    horaInicio: formatarHora(agendamento?.horaInicio),
    horaFim: formatarHora(agendamento?.horaFim),
    condominio: extrairId(agendamento?.condominio),
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

  const solicitarExclusao = (id) => {
    const agendamento = agendamentos.find((item) => item.id === id);
    setAgendamentoParaExcluir(agendamento ?? { id });
  };

  const cancelarExclusao = () => {
    setAgendamentoParaExcluir(null);
  };

  const solicitarConfirmacao = (agendamento) => {
    setAgendamentoParaConfirmar(agendamento);
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

      setAgendamentoParaConfirmar(null);
      await buscarDados();
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      window.alert("Não foi possível confirmar o agendamento. Tente novamente.");
    }
  };

  const confirmarExclusao = async () => {
    if (!agendamentoParaExcluir?.id) {
      return;
    }

    try {
      await api.delete(`/agendamentos/${agendamentoParaExcluir.id}`);
      setAgendamentoParaExcluir(null);
      await buscarDados();
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      window.alert("Não foi possível excluir o agendamento. Tente novamente.");
    }
  };

  const formatarValor = (valor) => {
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

    if (valor && typeof valor === "object") {
      return valor.nome ?? "-";
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
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <AgendamentosTable
            agendamentos={agendamentos}
            onEdit={editarDados}
            onConfirm={solicitarConfirmacao}
            onDelete={solicitarExclusao}
            onViewDetails={visualizarDetalhes}
          />
        </div>

        {showModal && (
          <ModalScheduling
            agendamento={editAgendamento}
            onClose={() => setShowModal(false)}
            onCreated={buscarDados}
          />
        )}

        {agendamentoDetalhes && (
          <ModalAgendamentoDetalhes
            agendamento={agendamentoDetalhes}
            onClose={() => setAgendamentoDetalhes(null)}
          />
        )}

        <ConfirmationModal
          isOpen={!!agendamentoParaExcluir}
          title="Confirmar exclusão"
          message="Deseja realmente excluir este agendamento?"
          items={agendamentoParaExcluir ? [
            { label: "ID", value: agendamentoParaExcluir.id },
            { label: "Aluno", value: formatarValor(agendamentoParaExcluir.aluno) },
            { label: "Data", value: formatarValor(agendamentoParaExcluir.data) },
            { label: "Hora início", value: formatarValor(agendamentoParaExcluir.horaInicio) },
            { label: "Hora fim", value: formatarValor(agendamentoParaExcluir.horaFim) },
            { label: "Condomínio", value: formatarValor(agendamentoParaExcluir.condominio) },
            { label: "Professor", value: formatarValor(agendamentoParaExcluir.professor) },
            { label: "Rebatedor", value: formatarValor(agendamentoParaExcluir.rebatedor) },
            { label: "Auxiliar", value: formatarValor(agendamentoParaExcluir.auxiliar) },
            { label: "Status", value: formatarValor(agendamentoParaExcluir.status) },
          ] : []}
          confirmLabel="Sim, excluir"
          cancelLabel="Não, cancelar"
          onCancel={cancelarExclusao}
          onConfirm={confirmarExclusao}
        />

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
      </PageLayout>
    </div>
  );
}
