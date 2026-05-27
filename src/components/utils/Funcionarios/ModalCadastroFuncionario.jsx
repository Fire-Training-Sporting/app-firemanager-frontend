import { useState, useEffect } from "react";
import api from "../../../provider/api";

const inputCls =
  "mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]";

const selectCls =
  "mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]";

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

export default function ModalCadastroFuncionario({
  isOpen,
  onClose,
  onSuccess,
  usuario = null,
}) {

  const isEditMode = !!usuario;

  const [credenciais, setCredenciais] = useState({
    tipoUsuario: "",
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    condominio: "",
  });

  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [tiposUsuario, setTiposUsuario] = useState([]);

  const [isAluno, setIsAluno] = useState(false);

  const [condominios, setCondominios] = useState([]);

  const [erro, setErro] = useState("");

  const [sucesso, setSucesso] = useState("");

  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");

  const [telefoneError, setTelefoneError] = useState("");

  const [senhaError, setSenhaError] = useState("");

  // trava scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // carregar dados
  useEffect(() => {
    async function carregarDados() {
      try {

        const response = await api.get("/condominios");

        setCondominios(response.data || []);

        setTiposUsuario([
          { id: 2, cargo: "Administracao" },
          { id: 3, cargo: "Quadra" },
          { id: 4, cargo: "Aluno" },
        ]);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    if (isOpen) {
      carregarDados();
    }

  }, [isOpen]);

  // preencher edição
  useEffect(() => {

    if (!usuario) {
      resetFormulario();
      return;
    }

    const tipoId =
      usuario.tipoUsuario?.id ||
      usuario.tipoUsuario ||
      "";

    const condominioId =
      usuario.condominio?.id ||
      usuario.condominio ||
      "";

    setCredenciais({
      tipoUsuario: tipoId,
      nome: usuario.nome || "",
      email: usuario.email || "",
      telefone: usuario.telefone || "",
      senha: "",
      condominio: condominioId,
    });

    setIsAluno(Number(tipoId) === 4);

  }, [usuario]);

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

  function atualizarCampo(campo, valor) {

    setErro("");

    if (campo === "telefone") {

      const telefoneFormatado =
        aplicarMascaraTelefone(valor);

      setCredenciais((prev) => ({
        ...prev,
        telefone: telefoneFormatado,
      }));

      setTelefoneError(
        telefoneFormatado &&
          !validarTelefone(telefoneFormatado)
          ? "Digite um telefone válido."
          : ""
      );

      return;
    }

    if (campo === "email") {

      setCredenciais((prev) => ({
        ...prev,
        email: valor,
      }));

      setEmailError(
        valor && !validarEmail(valor)
          ? "Digite um e-mail válido."
          : ""
      );

      return;
    }

    if (campo === "senha") {

      setCredenciais((prev) => ({
        ...prev,
        senha: valor,
      }));

      setSenhaError(
        valor && valor.length < 6
          ? "A senha deve ter no mínimo 6 caracteres."
          : ""
      );

      return;
    }

    setCredenciais((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function atualizarTipoUsuario(evento) {

    const valor = Number(evento.target.value);

    setCredenciais((prev) => ({
      ...prev,
      tipoUsuario: valor || "",
    }));

    setIsAluno(valor === 4);

    setErro("");
  }

  function atualizarCondominio(evento) {

    const valor = evento.target.value
      ? Number(evento.target.value)
      : "";

    setCredenciais((prev) => ({
      ...prev,
      condominio: valor,
    }));
  }

  function resetFormulario() {

    setCredenciais({
      tipoUsuario: "",
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      condominio: "",
    });

    setConfirmarSenha("");

    setIsAluno(false);

    setErro("");

    setSucesso("");

    setEmailError("");

    setTelefoneError("");

    setSenhaError("");
  }

  function validarCredenciais() {

    if (
      emailError ||
      telefoneError ||
      senhaError
    ) {
      return false;
    }

    if (!credenciais.nome.trim()) {
      setErro("Nome é obrigatório");
      return false;
    }

    if (!credenciais.email.trim()) {
      setErro("E-mail é obrigatório");
      return false;
    }

    if (!validarEmail(credenciais.email)) {
      setErro("E-mail inválido");
      return false;
    }

    if (!credenciais.telefone.trim()) {
      setErro("Telefone é obrigatório");
      return false;
    }

    if (!validarTelefone(credenciais.telefone)) {
      setErro("Telefone inválido");
      return false;
    }

    if (!isEditMode && !credenciais.senha) {
      setErro("Senha é obrigatória");
      return false;
    }

    if (credenciais.senha) {

      if (credenciais.senha.length < 6) {
        setErro("Senha deve ter no mínimo 6 caracteres");
        return false;
      }

      if (!confirmarSenha) {
        setErro("Confirme a senha");
        return false;
      }

      if (credenciais.senha !== confirmarSenha) {
        setErro("Senhas não são iguais");
        return false;
      }
    }

    if (!credenciais.tipoUsuario) {
      setErro("Tipo de usuário é obrigatório");
      return false;
    }

    if (isAluno && !credenciais.condominio) {
      setErro("Condomínio é obrigatório");
      return false;
    }

    return true;
  }

  async function salvarUsuario(evento) {

    evento.preventDefault();

    if (!validarCredenciais()) {
      return;
    }

    try {

      setLoading(true);

      setErro("");

      const payload = {
        tipoUsuario: Number(credenciais.tipoUsuario),
        nome: credenciais.nome.trim(),
        email: credenciais.email.trim(),
        telefone: credenciais.telefone.replace(/\D/g, ""),
      };

      if (credenciais.condominio) {
        payload.condominio =
          Number(credenciais.condominio);
      }

      // senha opcional edição
      if (credenciais.senha.trim()) {
        payload.senha = credenciais.senha;
      }

      if (isEditMode) {

        await api.put(
          `/usuarios/${usuario.id}`,
          payload
        );

      } else {

        await api.post(
          "/usuarios",
          payload
        );
      }

      if (onSuccess) {
        onSuccess();
      }

      resetFormulario();

      onClose();

    } catch (e) {

      console.error("Erro:", e);

      setErro(
        isEditMode
          ? "Erro ao atualizar usuário."
          : "Erro ao cadastrar usuário."
      );

    } finally {

      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">

        <div className="bg-gradient-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">

          <h2 className="text-lg font-bold text-white">
            {isEditMode
              ? "Editar Funcionário"
              : "Cadastrar Funcionário"}
          </h2>

          <button
            type="button"
            onClick={() => {
              resetFormulario();
              onClose();
            }}
            className="text-white hover:text-red-200 transition rounded-full p-1 bg-black/20"
          >
            ✕
          </button>

        </div>

        {/* Conteúdo */}
        <div className="px-5 py-4">

          <form
            onSubmit={salvarUsuario}
            className="flex flex-col space-y-3"
          >

            <Field label="Nome">
              <input
                type="text"
                value={credenciais.nome}
                onChange={(e) =>
                  atualizarCampo("nome", e.target.value)
                }
                placeholder="Nome e sobrenome"
                className={inputCls}
              />
            </Field>

            <Field label="E-mail">
              <input
                type="email"
                value={credenciais.email}
                onChange={(e) =>
                  atualizarCampo("email", e.target.value)
                }
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
                type="tel"
                value={credenciais.telefone}
                onChange={(e) =>
                  atualizarCampo(
                    "telefone",
                    e.target.value
                  )
                }
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
                type="password"
                value={credenciais.senha}
                onChange={(e) =>
                  atualizarCampo("senha", e.target.value)
                }
                placeholder={
                  isEditMode
                    ? "Deixe vazio para manter"
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
                type="password"
                value={confirmarSenha}
                onChange={(e) => {
                  setConfirmarSenha(e.target.value);
                  setErro("");
                }}
                placeholder="Repita a senha"
                className={inputCls}
              />
            </Field>

            <Field label="Tipo de Usuário">

              <select
                value={credenciais.tipoUsuario}
                onChange={atualizarTipoUsuario}
                className={selectCls}
              >

                <option value="">
                  Selecione
                </option>

                {tiposUsuario.map((tipo) => (
                  <option
                    key={tipo.id}
                    value={tipo.id}
                  >
                    {tipo.cargo}
                  </option>
                ))}
              </select>

            </Field>

            {isAluno && (
              <Field label="Condomínio">

                <select
                  value={credenciais.condominio}
                  onChange={atualizarCondominio}
                  className={selectCls}
                >

                  <option value="">
                    Selecione
                  </option>

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
            )}

            {erro && (
              <p className="text-red-600 text-sm text-center font-medium">
                {erro}
              </p>
            )}

            {sucesso && (
              <p className="text-green-600 text-sm text-center font-medium">
                {sucesso}
              </p>
            )}

            {/* Botões */}
            <div className="flex justify-end gap-2 mt-3">

              <button
                type="button"
                onClick={() => {
                  resetFormulario();
                  onClose();
                }}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-[#F8821E] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F8821E] text-white font-semibold rounded-md shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {loading
                  ? "Processando..."
                  : isEditMode
                    ? "Salvar alterações"
                    : "Cadastrar Funcionário"}

              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}