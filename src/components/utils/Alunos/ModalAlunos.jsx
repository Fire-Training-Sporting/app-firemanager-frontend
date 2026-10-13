import React, { useState, useEffect } from "react";
import api from "../../../provider/api";
import AlertMessage from "../AlertMessage";
import closeWhiteIcon from "../../../assets/close_white.png";
import { modalBackButton, modalButton, modalCloseButton, modalIcon, modalIconWhite } from "../Buttons/modalButtonStyles";
import doneGreenIcon from "../../../assets/done_green.png";
import personAddWhiteIcon from "../../../assets/person_add_white.png";

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

export default function ModalAluno({
  aluno = null,
  onClose,
  onCreated,
  onBack,
}) {
  const isEditMode = !!aluno;

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    condominio: "",
  });

  const [emailError, setEmailError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [condominios, setCondominios] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .get("/condominios")
      .then((res) => setCondominios(res.data))
      .catch((err) =>
        console.error("Erro ao carregar condomínios:", err)
      );
  }, []);

  const validarEmail = (valor) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

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

  useEffect(() => {
    if (!aluno) {
      setForm({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
        condominio: "",
      });

      return;
    }

    setForm({
      nome: aluno.nome || "",
      email: aluno.email || "",
      telefone: aplicarMascaraTelefone(aluno.telefone || ""),
      senha: "",
      condominio: String(
        aluno.condominio?.id || aluno.condominio || ""
      ),
    });

    setConfirmarSenha("");
  }, [aluno]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubmitError("");

    if (name === "telefone") {
      const telFormatado = aplicarMascaraTelefone(value);

      setForm({
        ...form,
        telefone: telFormatado,
      });

      setTelefoneError(
        telFormatado && !validarTelefone(telFormatado)
          ? "Digite um telefone válido."
          : ""
      );

    } else if (name === "email") {
      setForm({
        ...form,
        email: value,
      });

      setEmailError(
        value && !validarEmail(value)
          ? "Digite um e-mail válido."
          : ""
      );

    } else if (name === "senha") {
      setForm({
        ...form,
        senha: value,
      });

      setSenhaError(
        value && value.length < 6
          ? "A senha deve ter no mínimo 6 caracteres."
          : ""
      );

    } else if (name === "confirmarSenha") {
      setConfirmarSenha(value);

    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      emailError ||
      telefoneError ||
      senhaError ||
      !form.nome.trim() ||
      !form.email.trim() ||
      !form.telefone.trim() ||
      (!isEditMode && !form.senha.trim()) ||
      !form.condominio
    ) {
      setSubmitError("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    if (form.senha.trim()) {
      if (!confirmarSenha.trim()) {
        setSubmitError("Confirme a senha.");
        return;
      }

      if (form.senha !== confirmarSenha) {
        setSubmitError("As senhas não conferem.");
        return;
      }
    }

    const payload = {
      tipoUsuario: 4,
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone.replace(/\D/g, ""),
      condominio: Number(form.condominio),
    };

    if (form.senha.trim()) {
      payload.senha = form.senha;
    }

    try {
      setIsSaving(true);
      setSubmitError("");

      if (isEditMode) {
        await api.put(`/usuarios/${aluno.id}`, payload);
      } else {
        await api.post("/usuarios", payload);
      }

      if (onCreated) {
        onCreated();
      }

      onClose();

    } catch (error) {
      console.error(
        isEditMode
          ? "Erro ao atualizar aluno:"
          : "Erro ao cadastrar aluno:",
        error
      );

      const mensagemBackend =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "";

      setSubmitError(
        mensagemBackend ||
          (isEditMode
            ? "Não foi possível atualizar o aluno."
            : "Não foi possível cadastrar o aluno. Tente novamente.")
      );

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">

      {/* Cabeçalho */}
      <div className="bg-linear-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={modalBackButton}
            >
              ←
            </button>
          )}
          <h2 className="text-lg font-bold text-white">
            {isEditMode ? "Editar Aluno" : "Cadastrar Aluno"}
          </h2>
        </div>

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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3"
        >

          <Field label="Nome">
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome completo"
              className={inputCls}
            />
          </Field>

          <Field label="Email">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              className={inputCls}
            />

            {emailError && (
              <p className="text-red-600 text-sm mt-1">
                {emailError}
              </p>
            )}
          </Field>

          <Field label="Telefone">
            <input
              name="telefone"
              type="tel"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className={inputCls}
            />

            {telefoneError && (
              <p className="text-red-600 text-sm mt-1">
                {telefoneError}
              </p>
            )}
          </Field>

          <Field label="Senha">
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              placeholder={
                isEditMode
                  ? "Deixe vazio para manter a senha atual"
                  : "Mínimo 6 caracteres"
              }
              className={inputCls}
            />

            {senhaError && (
              <p className="text-red-600 text-sm mt-1">
                {senhaError}
              </p>
            )}
          </Field>

          <Field label="Confirmar Senha">
            <input
              name="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={handleChange}
              placeholder="Repita a senha"
              className={inputCls}
            />
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
                <option
                  key={cond.id}
                  value={cond.id}
                >
                  {cond.nome}
                </option>
              ))}
            </select>
          </Field>

          <AlertMessage variant="error" message={submitError} />

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-3">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className={modalButton("danger", { icon: true })}
            >
              <img src={closeWhiteIcon} alt="" className={modalIcon} />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={modalButton("success", { icon: true })}
            >
              {isEditMode ? (
                <img src={doneGreenIcon} alt="" className={modalIconWhite} />
              ) : (
                <img src={personAddWhiteIcon} alt="" className={modalIcon} />
              )}
              {isSaving
                ? (isEditMode ? "Salvando..." : "Cadastrando...")
                : (isEditMode ? "Salvar alterações" : "Cadastrar aluno")}
            </button>

          </div>
        </form>
      </div>
    </div>
    </div>
  );
}