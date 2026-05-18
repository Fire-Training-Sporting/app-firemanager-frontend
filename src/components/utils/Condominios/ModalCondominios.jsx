import React, { useState } from "react";

export default function ModalCondominio({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    cep: "",
    logradouro: "",
    numero: "",
    cidade: "",
    bairro: "",
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
          setForm({ ...form, logradouro: "", bairro: "", cidade: "" });
        } else {
          setCepError("");
          setForm({
            ...form,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
          });
        }
      } catch (error) {
        setCepError("Erro ao consultar CEP.");
      }
    } else {
      setCepError("CEP inválido. Digite 8 números.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cepError) return;
    console.log("Condomínio cadastrado:", form);
    onClose();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cadastrar Condomínio</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        {/* Campo CEP + botão */}
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="text"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              placeholder="CEP"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {cepError && <p className="text-red-600 text-sm mt-1">{cepError}</p>}
          </div>
          <button
            type="button"
            onClick={buscarCep}
            className="px-3 py-2 bg-blue-600 text-white roundxed-md hover:bg-blue-700 transition"
          >
            Buscar CEP
          </button>
        </div>

        <input
          type="text"
          name="logradouro"
          value={form.logradouro}
          onChange={handleChange}
          placeholder="Logradouro"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="text"
          name="numero"
          value={form.numero}
          onChange={handleChange}
          placeholder="Número"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="text"
          name="cidade"
          value={form.cidade}
          onChange={handleChange}
          placeholder="Cidade"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="text"
          name="bairro"
          value={form.bairro}
          onChange={handleChange}
          placeholder="Bairro"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}