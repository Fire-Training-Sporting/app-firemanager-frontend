import React, { useState, useEffect } from "react";
import api from "../../../provider/api";

const inputCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]";

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function ModalAluno({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    condominio: "",
  });

  const [emailError, setEmailError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [condominios, setCondominios] = useState([]);

  useEffect(() => {
    api.get("/condominios")
      .then((res) => setCondominios(res.data))
      .catch((err) => console.error("Erro ao carregar condomínios:", err));
  }, []);

  const validarEmail = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  const validarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    return numeros.length >= 10 && numeros.length <= 11;
  };

  const aplicarMascaraTelefone = (valor) =>
    valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      const telFormatado = aplicarMascaraTelefone(value);
      setForm({ ...form, telefone: telFormatado });
      setTelefoneError(telFormatado && !validarTelefone(telFormatado) ? "Digite um telefone válido." : "");
    } else if (name === "email") {
      setForm({ ...form, email: value });
      setEmailError(value && !validarEmail(value) ? "Digite um e-mail válido." : "");
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError || telefoneError || !form.condominio) return;
    console.log("Aluno cadastrado:", form);
    onClose();
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
        <h2 className="text-lg font-bold text-white">Cadastrar Aluno</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-red-200 transition rounded-full p-1 bg-black/20"
        >
          ✕
        </button>
      </div>

      {/* Conteúdo */}
      <div className="px-5 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <Field label="Nome">
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" className={inputCls} />
          </Field>

          <Field label="Email">
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="exemplo@email.com" className={inputCls} />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </Field>

          <Field label="Telefone">
            <input name="telefone" type="tel" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" className={inputCls} />
            {telefoneError && <p className="text-red-600 text-sm mt-1">{telefoneError}</p>}
          </Field>

          <Field label="Condomínio">
            <select
              name="condominio"
              value={form.condominio}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">Selecione</option>
              {condominios.map((cond) => (
                <option key={cond.id} value={cond.id}>
                  {cond.nome}
                </option>
              ))}
            </select>
          </Field>

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#F8821E] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F8821E] text-white font-semibold rounded-md shadow-md transition-transform transform hover:scale-105"
            >
              Cadastrar aluno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}