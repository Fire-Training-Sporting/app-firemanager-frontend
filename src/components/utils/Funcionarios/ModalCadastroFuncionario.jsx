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

export default function ModalCadastroFuncionario({ isOpen, onClose, onSuccess, usuario }) {
  const [credenciais, setCredenciais] = useState({
    tipoUsuario: usuario?.tipoUsuario?.id || "",
    nome: usuario?.nome || "",
    email: usuario?.email || "",
    telefone: usuario?.telefone || "",
    senha: "",
    condominio: usuario?.condominio?.id || "",
  });

  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [isAluno, setIsAluno] = useState(usuario?.tipoUsuario?.id === 4);
  const [condominios, setCondominios] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  // Trava o scroll do fundo da página quando o modal abre
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Carrega os dados das APIs e preenche/resgata o formulário ao abrir ou mudar de usuário
  useEffect(() => {
    if (isOpen) {
      setTiposUsuario([
        { id: 2, cargo: "Administracao" },
        { id: 3, cargo: "Quadra" },
      ])
    }
  }, [isOpen, usuario]);

  function atualizarCampo(campo, valor) {
    setCredenciais((prev) => ({ ...prev, [campo]: valor }));
    setErro("");
  }

  function atualizarTipoUsuario(evento) {
    const valor = Number(evento.target.value);
    setCredenciais((prev) => ({ ...prev, tipoUsuario: valor || "" }));
    setIsAluno(valor === 4);
    setErro("");
  }

  function atualizarCondominio(evento) {
    const valor = evento.target.value ? Number(evento.target.value) : "";
    setCredenciais((prev) => ({ ...prev, condominio: valor }));
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
  }

  function validarCredenciais() {
    if (!credenciais.nome.trim()) { setErro("Nome é obrigatorio"); return false; }
    if (!credenciais.email.trim()) { setErro("E-mail é obrigatorio"); return false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credenciais.email)) return setErro("E-mail inválido"), false;
    if (!credenciais.telefone.trim()) return setErro("Telefone é obrigatório"), false;

    if (!emailRegex.test(credenciais.email)) { setErro("E-mail inválido"); return false; }
    if (!credenciais.telefone.trim()) { setErro("Telefone é obrigatório"); return false; }
    const tel = credenciais.telefone.replace(/\D/g, "");
    if (tel.length !== 11) { setErro("Telefone deve ter 11 dígitos (DDD + número)"); return false; }
    if (!credenciais.senha) { setErro("Senha é obrigatória"); return false; }
    if (credenciais.senha.length < 6) { setErro("Senha deve ter no mínimo 6 caracteres"); return false; }
    if (!confirmarSenha) { setErro("Confirmação de senha é obrigatória"); return false; }
    if (credenciais.senha !== confirmarSenha) { setErro("Senhas não são iguais"); return false; }
    if (!credenciais.tipoUsuario) { setErro("Tipo de Usuário é obrigatório"); return false; }
    if (isAluno && !credenciais.condominio) { setErro("Condomínio é obrigatório para alunos"); return false; }
    return true;
  }

  async function salvarUsuario(evento) {
    evento.preventDefault();
    // executar validações locais antes de enviar
    if (!validarCredenciais()) return;

    try {
      await api.post("/usuarios", credenciais);
      if (onSuccess) onSuccess();
      resetFormulario();
    } catch (e) {
      console.error("Erro:", e);
      setErro(
        isEditMode ? "Erro ao atualizar usuário." : "Erro ao cadastrar usuário."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">Cadastrar Funcionário</h2>
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
          <form onSubmit={salvarUsuario} className="flex flex-col space-y-3">
            <Field label="Nome">
              <input
                type="text"
                value={credenciais.nome}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
                placeholder="Nome e sobrenome"
                className={inputCls}
              />
            </Field>

            <Field label="E-mail">
              <input
                type="email"
                value={credenciais.email}
                onChange={(e) => atualizarCampo("email", e.target.value)}
                placeholder="exemplo@email.com"
                className={inputCls}
              />
            </Field>

            <Field label="Telefone">
              <input
                type="tel"
                value={credenciais.telefone}
                onChange={(e) => atualizarCampo("telefone", e.target.value)}
                placeholder="(11) 9 9999-9999"
                className={inputCls}
              />
            </Field>

            <Field label="Senha">
              <input
                type="password"
                value={credenciais.senha}
                onChange={(e) => atualizarCampo("senha", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={inputCls}
              />
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
                <option value="">Selecione</option>
                {tiposUsuario.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
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
                  <option value="">Selecione</option>
                  {condominios.map((cond) => (
                    <option key={cond.id} value={cond.id}>
                      {cond.nome}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {erro && (
              <p className="text-red-600 text-sm text-center font-medium">{erro}</p>
            )}
            {sucesso && (
              <p className="text-green-600 text-sm text-center font-medium">{sucesso}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-gradient-to-r from-[#F8821E] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F8821E] text-white font-semibold py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processando..." : "Cadastrar Funcionário"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}