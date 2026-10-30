import { STATUS_USUARIO_OPCOES } from "./acoesUsuario";

export default function StatusUsuarioFilter({ value, onChange, isLoading = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      aria-label="Filtrar por status"
      className="h-10 w-full min-w-0 border border-gray-300 rounded-md px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 lg:w-auto"
    >
      {STATUS_USUARIO_OPCOES.map((opcao) => (
        <option key={opcao.value} value={opcao.value}>
          {opcao.label}
        </option>
      ))}
    </select>
  );
}
