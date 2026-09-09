export default function CondominiosTh({ children, className = "", ...props }) {
  return (
    <th
      className={`px-4 py-3 font-semibold text-gray-800 text-sm bg-gray-200 text-left align-middle ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}
