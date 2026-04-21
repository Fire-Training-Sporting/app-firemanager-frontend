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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buscarCep = async () => {
    if (form.cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${form.cep}/json/`);
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
    <div className="relative p-6">
      {/* Botão X para fechar */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cadastrar Aluno</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Campos do formulário */}
        <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="tel" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="w-full border border-gray-300 rounded-md px-3 py-2" />

        {/* CEP + botão */}
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input type="text" name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            {cepError && <p className="text-red-600 text-sm mt-1">{cepError}</p>}
          </div>
          <button type="button" onClick={buscarCep} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Buscar CEP
          </button>
        </div>

        <input type="text" name="rua" value={form.rua} onChange={handleChange} placeholder="Rua" className="w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className="w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Complemento" className="w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className="w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="w-full border border-gray-300 rounded-md px-3 py-2" />

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
