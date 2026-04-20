export default function AgendamentosTh({ children, className = "", ...props }) {
  return (
    <th
      className={`px-4 py-3 font-semibold text-gray-700 text-sm bg-[#F3F4F8] text-left align-middle ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}
