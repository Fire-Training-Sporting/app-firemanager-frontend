import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../provider/api";

const inputCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]";

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ModalCondominio({
  onClose,
  onCreated,
  condominio = null,
}) {

  const isEditMode = !!condominio;

  const [form, setForm] = useState({
    nome: "",
    cep: "",
    logradouro: "",
    numero: "",
    cidade: "",
    bairro: "",
  });

  const [cepError, setCepError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {

    if (!condominio) {
      return;
    }

    setForm({
      nome: condominio.nome || "",
      cep: aplicarMascaraCep(condominio.cep || ""),
      logradouro: condominio.logradouro || "",
      numero: condominio.numero || "",
      cidade: condominio.cidade || "",
      bairro: condominio.bairro || "",
    });

  }, [condominio]);

  const aplicarMascaraCep = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  const validarCep = (valor) => {
    const cep = valor.replace(/\D/g, "");
    return cep.length === 8;
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setSubmitError("");

    if (name === "cep") {

      const cepFormatado = aplicarMascaraCep(value);

      setForm({
        ...form,
        cep: cepFormatado,
      });

      setCepError(
        cepFormatado && !validarCep(cepFormatado)
          ? "Digite um CEP válido."
          : ""
      );

    } else {

      setForm({
        ...form,
        [name]: value,
      });

    }
  };

  const buscarCep = async () => {

    const cepNumerico = form.cep.replace(/\D/g, "");

    if (cepNumerico.length !== 8) {
      setCepError("CEP inválido. Digite 8 números.");
      return;
    }

    try {

      const response = await axios.get(
        `https://viacep.com.br/ws/${cepNumerico}/json/`
      );

      const data = response.data;

      if (data.erro) {

        setCepError("CEP não encontrado.");

        setForm((prev) => ({
          ...prev,
          logradouro: "",
          bairro: "",
          cidade: "",
        }));

        return;
      }

      setCepError("");

      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
      }));

    } catch (error) {

      console.error(error);

      setCepError("Erro ao consultar CEP.");

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      cepError ||
      !form.nome.trim() ||
      !form.cep.trim() ||
      !form.logradouro.trim() ||
      !form.numero.trim() ||
      !form.cidade.trim() ||
      !form.bairro.trim()
    ) {
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      cidade: form.cidade.trim(),
      bairro: form.bairro.trim(),
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      cep: form.cep.replace(/\D/g, ""),
    };

    try {

      setIsSaving(true);

      setSubmitError("");

      if (isEditMode) {

        await api.put(
          `/condominios/${condominio.id}`,
          payload
        );

      } else {

        await api.post(
          "/condominios",
          payload
        );

      }

      if (onCreated) {
        onCreated();
      }

      onClose();

    } catch (error) {

      console.error(
        "Erro ao salvar condomínio:",
        error
      );

      setSubmitError(
        isEditMode
          ? "Não foi possível atualizar o condomínio."
          : "Não foi possível cadastrar condomínio."
      );

    } finally {

      setIsSaving(false);

    }
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">

      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">

        <h2 className="text-lg font-bold text-white">
          {isEditMode
            ? "Editar Condomínio"
            : "Cadastrar Condomínio"}
        </h2>

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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3"
        >

          <Field label="Nome">
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome do condomínio"
              className={inputCls}
            />
          </Field>

          <Field label="CEP">

            <div className="flex gap-2 items-start">

              <div className="flex-1">

                <input
                  type="text"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className={inputCls}
                />

                {cepError && (
                  <p className="text-red-600 text-sm mt-1">
                    {cepError}
                  </p>
                )}

              </div>

              <button
                type="button"
                onClick={buscarCep}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Buscar
              </button>

            </div>

          </Field>

          <Field label="Logradouro">
            <input
              type="text"
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              placeholder="Rua, Avenida..."
              className={inputCls}
            />
          </Field>

          <Field label="Número">
            <input
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              placeholder="Número"
              className={inputCls}
            />
          </Field>

          <Field label="Cidade">
            <input
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              placeholder="Cidade"
              className={inputCls}
            />
          </Field>

          <Field label="Bairro">
            <input
              type="text"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              placeholder="Bairro"
              className={inputCls}
            />
          </Field>

          {submitError && (
            <p className="text-red-600 text-sm">
              {submitError}
            </p>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-3">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-[#F8821E] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F8821E] text-white font-semibold rounded-md shadow-md transition-transform transform hover:scale-105"
            >
              {isSaving
                ? "Salvando..."
                : isEditMode
                  ? "Salvar alterações"
                  : "Cadastrar condomínio"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}