import { useEffect, useRef } from "react";
import successIcon from "../../assets/success.png";
import warningIcon from "../../assets/warning.png";

const variantStyles = {
  success: {
    container: "border-green-400 bg-green-100 text-green-800",
    badge: "bg-green-200",
    icon: successIcon,
    alt: "Sucesso",
  },
  error: {
    container: "border-red-400 bg-red-100 text-red-800",
    badge: "bg-red-200",
    icon: warningIcon,
    alt: "Aviso",
  },
};

export default function AlertMessage({ variant = "error", message = "", className = "" }) {
  const alertRef = useRef(null);

  useEffect(() => {
    const alertElement = alertRef.current;

    if (!message || !alertElement) {
      return undefined;
    }

    alertElement.hidden = false;
    const timeoutId = setTimeout(() => {
      alertElement.hidden = true;
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [message]);

  if (!message) {
    return null;
  }

  const styles = variantStyles[variant] ?? variantStyles.error;

  return (
    <div
      ref={alertRef}
      role="alert"
      aria-live="polite"
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 mb-3 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold shadow-sm ${styles.container} ${className}`.trim()}
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${styles.badge}`}>
        <img src={styles.icon} alt={styles.alt} className="h-4 w-4" />
      </span>
      <span className="leading-5">{message}</span>
      <button
        type="button"
        aria-label="Fechar alerta"
        onClick={() => {
          alertRef.current.hidden = true;
        }}
        className="ml-2 text-lg leading-none opacity-70 transition-opacity hover:opacity-100"
      >
        X
      </button>
    </div>
  );
}