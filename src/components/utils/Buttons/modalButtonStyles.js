// Estilos padronizados para os botões dos modais.

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-semibold shadow-sm transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  info: "bg-blue-600 text-white hover:bg-blue-700",
  success: "bg-green-600 text-white hover:bg-green-700",
};

const sizes = {
  md: "h-10",
  // mesma altura dos inputs dos formulários (py-3 + borda)
  field: "h-[50px]",
};

// Botão com ícone à esquerda usa padding esquerdo menor para compensar
// a área transparente dos PNGs e manter o conteúdo visualmente centralizado.
export function modalButton(variant = "secondary", { icon = false, size = "md" } = {}) {
  return `${base} ${sizes[size]} ${icon ? "pl-3.5 pr-4" : "px-4"} ${variants[variant]}`;
}

export const modalIcon = "h-[18px] w-[18px] shrink-0 translate-y-px";

// Ícone branco a partir de um PNG escuro/colorido (ex.: lixeira em botão vermelho).
export const modalIconWhite = `${modalIcon} brightness-0 invert`;

export const modalCloseButton =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 shadow-sm transition-colors hover:bg-red-700 cursor-pointer";

export const modalBackButton =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/30 cursor-pointer";

// Ações secundárias dentro do formulário (ex.: "+ Adicionar aluno").
export const modalInlineButton =
  "inline-flex h-8 items-center justify-center gap-1 rounded-md bg-blue-50 px-3 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 cursor-pointer";

// Remover item de uma lista dentro do formulário (mesma altura dos selects).
export const modalRemoveButton =
  "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-red-50 transition-colors hover:bg-red-100 cursor-pointer";
