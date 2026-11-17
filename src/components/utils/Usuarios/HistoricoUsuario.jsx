import { formatarDataHora } from "../../../utils/helpers";

export default function HistoricoUsuario({ usuario }) {
  if (!usuario) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-1 text-xs text-gray-600">
      <p>
        Cadastrado em{" "}
        <span className="font-semibold text-gray-800">{formatarDataHora(usuario.criadoEm)}</span>
        {" "}por{" "}
        <span className="font-semibold text-gray-800">{usuario.criadoPorNome || "Sistema"}</span>
      </p>

      {!usuario.arquivado && usuario.desarquivadoEm && (
        <p>
          Desarquivado em{" "}
          <span className="font-semibold text-gray-800">{formatarDataHora(usuario.desarquivadoEm)}</span>
          {" "}por{" "}
          <span className="font-semibold text-gray-800">{usuario.desarquivadoPorNome || "-"}</span>
        </p>
      )}

      {usuario.arquivado && (
        <p>
          Arquivado em{" "}
          <span className="font-semibold text-gray-800">{formatarDataHora(usuario.arquivadoEm)}</span>
          {" "}por{" "}
          <span className="font-semibold text-gray-800">{usuario.arquivadoPorNome || "-"}</span>
        </p>
      )}
    </div>
  );
}
