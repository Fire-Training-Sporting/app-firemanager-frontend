const variantStyles = {
  success: {
    container: "border-green-400 bg-green-100 text-green-800",
    badge: "bg-green-200 text-green-700",
    symbol: "✓",
  },
  error: {
    container: "border-red-400 bg-red-100 text-red-800",
    badge: "bg-red-200 text-red-700",
    symbol: "!",
  },
};

export default function AlertMessage({ variant = "error", message = "", className = "" }) {
  if (!message) {
    return null;
  }

  const styles = variantStyles[variant] ?? variantStyles.error;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`mb-3 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold shadow-sm ${styles.container} ${className}`.trim()}
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${styles.badge}`}>
        {styles.symbol}
      </span>
      <span className="leading-5">{message}</span>
    </div>
  );
}