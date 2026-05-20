import React, { useState } from "react";

const inputCls =
  "mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]";

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
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [cepError, setCepError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");

  const validarEmail = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  const validarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    return numeros.length >= 10 && numeros.length <= 11;
  };
  const aplicarMascaraCep = (valor) =>
    valor.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
  const aplicarMascaraTelefone = (valor) =>
    valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cep") {
      setForm({ ...form, cep: aplicarMascaraCep(value) });
    } else if (name === "telefone") {
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

  const buscarCep = async () => {
    const cepNumerico = form.cep.replace(/\D/g, "");
    if (cepNumerico.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
        const data = await response.json();
        if (data.erro) {
          setCepError("CEP não encontrado.");
          setForm({ ...form, rua: "", bairro: "", cidade: "", estado: "" });
        } else {
          setCepError("");
          setForm({
            ...form,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          });
        }
      } catch {
        setCepError("Erro ao consultar CEP.");
      }
    } else {
      setCepError("CEP inválido. Digite 8 números.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cepError || emailError || telefoneError) return;
    console.log("Aluno cadastrado:", form);
    onClose();
  };

  return (
    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome">
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" className={inputCls} />
          </Field>

          <Field label="Email">
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="exemplo@email.com" className={inputCls} />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </Field>

          {/* Telefone e CEP alinhados */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Field label="Telefone">
                <input name="telefone" type="tel" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" className={inputCls} />
                {telefoneError && <p className="text-red-600 text-sm mt-1">{telefoneError}</p>}
              </Field>
            </div>

            <div className="flex-1">
              <Field label="CEP">
                <div className="flex gap-2 items-center"> {/* 👈 troquei items-start por items-center */}
                  <input
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className={`${inputCls} w-40`} // campo mais estreito
                  />
                  <button
                    type="button"
                    onClick={buscarCep}
                    className="min-w-[120px] px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center" // 👈 py-3 igual ao input
                  >
                    Buscar CEP
                  </button>
                </div>
                {cepError && <p className="text-red-600 text-sm mt-1">{cepError}</p>}
              </Field>
            </div>
          </div>

          <Field label="Rua">
            <input name="rua" value={form.rua} onChange={handleChange} placeholder="Rua" className={inputCls} />
          </Field>
          <Field label="Número">
            <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className={inputCls} />
          </Field>
          <Field label="Complemento">
            <input name="complemento" value={form.complemento} onChange={handleChange} placeholder="Complemento" className={inputCls} />
          </Field>
          <Field label="Bairro">
            <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className={inputCls} />
          </Field>
          <Field label="Cidade">
            <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className={inputCls} />
          </Field>
          <Field label="Estado">
            <input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className={inputCls} />
          </Field>

          {/* Botões */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-3">
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