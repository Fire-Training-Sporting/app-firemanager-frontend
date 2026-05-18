import React, { useState } from "react";

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

  // Função para aplicar máscara no CEP
  const aplicarMascaraCep = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  // Função para aplicar máscara no telefone
  const aplicarMascaraTelefone = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cep") {
      setForm({ ...form, cep: aplicarMascaraCep(value) });
    } else if (name === "telefone") {
      setForm({ ...form, telefone: aplicarMascaraTelefone(value) });
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
    if (cepError) return;
    console.log("Aluno cadastrado:", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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

            <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />

            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />

            <input type="tel" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />

            {/* CEP + botão */}
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  placeholder="CEP"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                />
                {cepError && <p className="text-red-600 text-sm mt-1">{cepError}</p>}
              </div>
              <button
                type="button"
                onClick={buscarCep}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Buscar CEP
              </button>
            </div>

            <input type="text" name="rua" value={form.rua} onChange={handleChange} placeholder="Rua" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />
            <input type="text" name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />
            <input type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Complemento" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />
            <input type="text" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />
            <input type="text" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />
            <input type="text" name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]" />

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
    </div>
  );
}
