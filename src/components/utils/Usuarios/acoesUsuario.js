import api from "../../../provider/api";
import { getUsuarioId, getUsuarioLogado, normalizarCargo } from "../../../utils/helpers";

export const STATUS_USUARIO_OPCOES = [
  { label: "Ativos", value: "ATIVO" },
  { label: "Arquivados", value: "ARQUIVADO" },
  { label: "Todos", value: "TODOS" },
];

/**
 * Configuração das ações de ciclo de vida do usuário (arquivar, desarquivar, excluir).
 * Usada pelas telas de alunos e funcionários para montar o modal de confirmação.
 */
export const ACOES_USUARIO = {
  arquivar: {
    titulo: "Confirmar arquivamento",
    mensagem:
      "O usuário perderá o acesso ao sistema, mas o histórico de agendamentos e saldos será mantido. Ele poderá ser desarquivado depois.",
    confirmLabel: "Sim, arquivar",
    variant: "warning",
    sucesso: "Usuário arquivado com sucesso",
    executar: (id) => api.patch(`/usuarios/${id}/arquivar`),
  },
  desarquivar: {
    titulo: "Confirmar desarquivamento",
    mensagem: "O usuário voltará a ter acesso ao sistema.",
    confirmLabel: "Sim, desarquivar",
    variant: "success",
    sucesso: "Usuário desarquivado com sucesso",
    executar: (id) => api.patch(`/usuarios/${id}/desarquivar`),
  },
  excluir: {
    titulo: "Confirmar exclusão definitiva",
    mensagem:
      "Esta ação é permanente e só é permitida para usuários sem histórico. Usuários com histórico devem ser arquivados.",
    confirmLabel: "Sim, excluir",
    variant: "danger",
    sucesso: "Usuário excluído com sucesso",
    executar: (id) => api.delete(`/usuarios/${id}`),
  },
};

function getCargoLogado() {
  return normalizarCargo(sessionStorage.getItem("cargo"));
}

function ehUsuarioLogado(usuario) {
  const usuarioLogadoId = getUsuarioId(getUsuarioLogado());
  return usuarioLogadoId != null && String(usuarioLogadoId) === String(usuario?.id);
}

/**
 * Espelha as regras do backend: somente root/administração arquivam,
 * administração não arquiva root/administração, root não pode ser arquivado
 * e ninguém arquiva a si mesmo.
 */
export function podeArquivarUsuario(usuario) {
  const cargoLogado = getCargoLogado();
  const cargoAlvo = normalizarCargo(usuario?.tipoUsuario?.cargo);

  if (!["root", "administracao"].includes(cargoLogado) || ehUsuarioLogado(usuario)) {
    return false;
  }

  if (cargoAlvo === "root") {
    return false;
  }

  return cargoLogado === "root" || cargoAlvo !== "administracao";
}

export function podeExcluirUsuario(usuario) {
  return getCargoLogado() === "root" && !ehUsuarioLogado(usuario);
}

export function podeFiltrarStatusUsuario() {
  return ["root", "administracao"].includes(getCargoLogado());
}
