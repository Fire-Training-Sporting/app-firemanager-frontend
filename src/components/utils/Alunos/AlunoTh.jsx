export default function AlunosTh({ children, className = "", ...props }) {
  return (
    <th
      className={`px-4 py-3 font-semibold text-gray-700 text-md bg-[#F3F4F8] ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}
