/**
 * Helper functions comuns para o projeto
 */

/**
 * Extrai o ID de um objeto, tentando múltiplas propriedades comuns
 */
export function getItemId(value) {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "object") {
    const id = value.id ?? value.codigo ?? value.value ?? value._id ?? "";
    return String(id);
  }

  return String(value);
}

/**
 * Extrai o nome/descrição de um objeto, tentando múltiplas propriedades comuns
 */
export function getItemName(value) {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "object") {
    return value.nome ?? value.descricao ?? value.razaoSocial ?? value.titulo ?? "";
  }

  return String(value);
}

/**
 * Formata data para o padrão brasileiro
 */
export function formatarData(valor) {
  if (!valor) {
    return "-";
  }

  if (typeof valor === "string") {
    return valor.slice(0, 10);
  }

  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor.toISOString().slice(0, 10);
  }

  return String(valor).slice(0, 10);
}

/**
 * Formata hora (slice para mostrar apenas HH:MM)
 */
export function formatarHora(valor) {
  if (!valor) {
    return "-";
  }

  return String(valor).slice(0, 5);
}

/**
 * Formata um valor para exibição, tratando objetos, arrays e valores primitivos
 */
export function formatarValor(valor) {
  if (valor == null || valor === "") {
    return "-";
  }

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
}

/**
 * Obtém o usuário logado do sessionStorage
 */
export function getUsuarioLogado() {
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

/**
 * Obtém o ID do usuário logado, tentando múltiplas fontes
 */
export function getUsuarioId(usuario) {
  return sessionStorage.getItem("userId") ?? usuario?.userId ?? usuario?.id ?? null;
}

/**
 * Normaliza texto para busca (remove acentos, converte para minúsculas)
 */
export function normalizarTextoBusca(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Normaliza cargo para comparação
 */
export function normalizarCargo(cargo) {
  return String(cargo ?? "").trim().toLowerCase();
}

/**
 * Converte valor para texto para busca
 */
export function valorParaTextoBusca(valor) {
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
}

/**
 * Exibe mensagem de sucesso temporária
 */
export function exibirSucesso(setMensagem, setVisivel, timeout = 7000) {
  return (mensagem) => {
    setMensagem(mensagem);
    setVisivel(true);

    window.clearTimeout(exibirSucesso.timeoutId);
    exibirSucesso.timeoutId = window.setTimeout(() => {
      setMensagem("");
      setVisivel(false);
    }, timeout);
  };
}
