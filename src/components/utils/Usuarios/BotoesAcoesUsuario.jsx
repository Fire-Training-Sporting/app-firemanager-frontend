import deleteRedIcon from "../../../assets/delete_red.png";
import { modalButton, modalIcon } from "../Buttons/modalButtonStyles";
import { podeArquivarUsuario, podeExcluirUsuario } from "./acoesUsuario";

function IconeArquivo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={modalIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  );
}

/**
 * Botões de arquivar/desarquivar/excluir exibidos nos modais de detalhes,
 * respeitando as permissões do usuário logado sobre o usuário exibido.
 */
export default function BotoesAcoesUsuario({ usuario, onArquivar, onDesarquivar, onExcluir }) {
  const podeArquivar = podeArquivarUsuario(usuario);
  const podeExcluir = podeExcluirUsuario(usuario);

  return (
    <>
      {podeExcluir && (
        <button
          type="button"
          onClick={() => onExcluir?.()}
          className={`${modalButton("secondary", { icon: true })} text-red-600`}
        >
          <img src={deleteRedIcon} alt="" className={modalIcon} />
          Excluir
        </button>
      )}

      {podeArquivar && !usuario.arquivado && (
        <button
          type="button"
          onClick={() => onArquivar?.()}
          className={modalButton("danger", { icon: true })}
        >
          <IconeArquivo />
          Arquivar
        </button>
      )}

      {podeArquivar && usuario.arquivado && (
        <button
          type="button"
          onClick={() => onDesarquivar?.()}
          className={modalButton("success", { icon: true })}
        >
          <IconeArquivo />
          Desarquivar
        </button>
      )}
    </>
  );
}
