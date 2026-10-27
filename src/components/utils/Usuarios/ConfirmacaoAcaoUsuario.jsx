import ConfirmationModal from "../ConfirmationModal";
import { ACOES_USUARIO } from "./acoesUsuario";

export default function ConfirmacaoAcaoUsuario({
  acao,
  items = [],
  isLoading = false,
  onCancel,
  onConfirm,
}) {
  const config = acao ? ACOES_USUARIO[acao.tipo] : null;

  return (
    <ConfirmationModal
      isOpen={!!config}
      title={config?.titulo}
      message={config?.mensagem}
      items={items}
      confirmLabel={isLoading ? "Aguarde..." : config?.confirmLabel}
      cancelLabel="Não, cancelar"
      variant={config?.variant}
      confirmDisabled={isLoading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
