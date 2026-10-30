import { useEffect, useRef } from "react";

// Pilha dos modais abertos: só o do topo responde ao teclado, assim um modal
// de confirmação aberto sobre outro não fecha (ou confirma) os dois de uma vez.
const openModals = [];

/**
 * Atalhos de teclado dos modais:
 * - ESC chama `onClose`;
 * - ENTER clica no botão de `confirmButtonRef` (respeitando `disabled`).
 *
 * Com o foco em um botão, link ou textarea, o ENTER mantém o comportamento nativo.
 */
export default function useModalKeyboard({ onClose, confirmButtonRef, enabled = true }) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!enabled) return undefined;

    const id = Symbol("modal");
    openModals.push(id);

    // O botão que abriu o modal continua focado; sem isso o ENTER o clicaria de novo.
    if (document.activeElement instanceof HTMLButtonElement) {
      document.activeElement.blur();
    }

    function handleKeyDown(event) {
      if (openModals[openModals.length - 1] !== id || event.isComposing) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Enter" || event.repeat) return;

      const target = event.target;
      if (target instanceof Element && target.closest("button, a, textarea, [contenteditable='true']")) {
        return;
      }

      const confirmButton = confirmButtonRef?.current;
      if (!confirmButton) return;

      // Evita o submit nativo do formulário; o clique no botão já faz o submit.
      event.preventDefault();
      confirmButton.click();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      openModals.splice(openModals.indexOf(id), 1);
    };
  }, [enabled, confirmButtonRef]);
}
