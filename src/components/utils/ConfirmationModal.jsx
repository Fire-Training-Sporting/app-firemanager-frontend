export default function ConfirmationModal({
  isOpen,
  title = "Confirmar ação",
  message,
  items = [],
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  const headerClassName =
    variant === "danger"
      ? "bg-linear-to-r from-red-600 to-red-500"
      : "bg-linear-to-r from-[#F8821E] to-[#EA580C]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <div className={`${headerClassName} px-5 py-4`}>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>

        <div className="space-y-3 px-5 py-4">
          {message && <p className="text-sm text-gray-700">{message}</p>}

          {items.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full border-collapse text-sm text-gray-700">
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={`${item.label}-${index}`}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <th className="w-40 px-3 py-2 text-left font-semibold text-gray-900">
                        {item.label}
                      </th>
                      <td className="px-3 py-2 text-left">
                        {item.value ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
