import PageLayout from "../utils/PageLayout";

function getUsuarioLogado() {
  const usuarioString = sessionStorage.getItem("usuario");

  if (!usuarioString) {
    return null;
  }

  try {
    return JSON.parse(usuarioString);
  } catch {
    return null;
  }
}

function formatarValor(valor) {
  if (valor == null || valor === "") {
    return "-";
  }

  if (typeof valor === "object") {
    return valor.nome ?? valor.descricao ?? valor.razaoSocial ?? "-";
  }

  return String(valor);
}

export default function TelaPerfil() {
  const usuario = getUsuarioLogado();

  return (
    <PageLayout title="Perfil" showSearch={false} showAddButton={false}>
      <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-3xl w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Dados do usuario</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">ID</p>
            <p className="text-base font-medium text-gray-800 mt-1">{formatarValor(usuario?.id ?? usuario?.userId)}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Nome</p>
            <p className="text-base font-medium text-gray-800 mt-1">{formatarValor(usuario?.nome)}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Email</p>
            <p className="text-base font-medium text-gray-800 mt-1">{formatarValor(usuario?.email)}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Cargo</p>
            <p className="text-base font-medium text-gray-800 mt-1">{formatarValor(usuario?.cargo ?? sessionStorage.getItem("cargo"))}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Telefone</p>
            <p className="text-base font-medium text-gray-800 mt-1">{formatarValor(usuario?.telefone)}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Condominio</p>
            <p className="text-base font-medium text-gray-800 mt-1">{formatarValor(usuario?.condominio)}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
