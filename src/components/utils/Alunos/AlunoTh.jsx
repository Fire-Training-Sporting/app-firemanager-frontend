export default function AlunosTh({ children, className = "", ...props }) {
  return (
    <th
      className={`px-4 py-3 font-semibold text-gray-800 text-md bg-gray-200 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}
