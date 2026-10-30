export default function StatusUsuarioBadge({ arquivado, size = "md" }) {
  const sizeClassName =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClassName} ${
        arquivado ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"
      }`}
    >
      {arquivado ? "Arquivado" : "Ativo"}
    </span>
  );
}
