import { useRef, useState } from "react";
import closeWhiteIcon from "../../../assets/close_white.png";
import { modalButton, modalCloseButton, modalIcon, modalIconWhite } from "../Buttons/modalButtonStyles";
import doneGreenIcon from "../../../assets/done_green.png";
import useModalKeyboard from "../../../hooks/useModalKeyboard";

export default function ServicoModal({ onClose, onSave }) {
  const confirmButtonRef = useRef(null);
  useModalKeyboard({ onClose, confirmButtonRef });

  const [form, setForm] = useState({
    nome: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ nome: "" });
    onClose();
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">
      {/* Cabeçalho */}
      <div className="bg-[#F8821E] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
        <h2 className="text-lg font-bold text-white">Cadastrar Serviço</h2>
        <button
          type="button"
          onClick={onClose}
          className={modalCloseButton}
          aria-label="Fechar"
        >
          <img src={closeWhiteIcon} alt="" className="h-5 w-5" />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="px-5 py-4">
        <form onSubmit={handleSave} className="flex flex-col space-y-3">
          <div>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome do serviço"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className={modalButton("danger", { icon: true })}
            >
              <img src={closeWhiteIcon} alt="" className={modalIcon} />
              Cancelar
            </button>
            <button
              type="submit"
              ref={confirmButtonRef}
              className={modalButton("success", { icon: true })}
            >
              <img src={doneGreenIcon} alt="" className={modalIconWhite} />
              Cadastrar serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}