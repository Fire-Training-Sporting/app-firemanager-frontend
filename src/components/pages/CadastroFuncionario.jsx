import React, { useEffect, useState } from "react";
import InputComponent from "../utils/InputComponent";

function CadastroFuncionario() {

  const [credenciais, setCredenciais] = useState({
    tipoUsuario: "",
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    condominio: ""
  })
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState([]);
  const [isAluno, setIsAluno] = useState(false);
  const [condominioState, setCondominioState] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarTipoUsuarios() {
    try {
      const resposta = await fetch("http://localhost:8080/api/tipo-usuarios");

      if (!resposta.ok) {
        throw new Error("Erro na requisição");
      }

      const dados = await resposta.json();

      setTipoUsuario(dados);
    } catch (erro) {
      console.error("Erro ao buscar tipos:", erro);
    }
  }

  async function carregarCondominios() {
    const resposta = await fetch("http://localhost:8080/api/condominios");
    const dados = await resposta.json();
    setCondominioState(dados);
  }

  useEffect(() => {
    carregarTipoUsuarios();
    carregarCondominios();
  }, []);

  function atualizarNome(evento) {
    setCredenciais({
      ...credenciais,
      nome: evento.target.value
    });
    if (erro === "Nome é obrigatório") setErro("");
  }

  function atualizarEmail(evento) {
    setCredenciais({
      ...credenciais,
      email: evento.target.value
    });
    if (erro === "E-Mail é obrigatório") setErro("");
  }

  function atualizarTelefone(evento) {
    setCredenciais({
      ...credenciais,
      telefone: evento.target.value
    });
    setErro("");
    if (erro === "Telefone é obrigatório") setErro("");
  }

  function atualizarSenha(evento) {
    setCredenciais({
      ...credenciais,
      senha: evento.target.value
    });
    setErro("");
    if (erro === "Senha é obrigatório") setErro("");
  }

  function atualizarConfirmarSenha(evento) {
    setConfirmarSenha(evento.target.value);
    if (erro === "Confirmar é obrigatório") setErro("");
  }

  function atualizarTipoUsuario(evento) {
    setCredenciais({
      ...credenciais,
      tipoUsuario: Number(evento.target.value)
    });

    if (evento.target.value == 4) {
      setIsAluno(true);
      carregarCondominios();
    } else {
      setIsAluno(false);
    }

    if (erro === "Tipo de Usuário é obrigatório") setErro("");
  }

  function atualizarCondominio(evento) {
    setCredenciais({
      ...credenciais,
      condominio: Number(evento.target.value)
    })
  }

  function resetFormulario() {
    setCredenciais({
      tipoUsuario: "",
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      condominio: ""
    });

    setConfirmarSenha("");
    setIsAluno(false);
  }

  function validarCredenciais() {
    if (!credenciais.nome) { setErro("Nome é obrigatório"); return false; }
    if (!credenciais.email) { setErro("E-Mail é obrigatório"); return false; }
    if (!credenciais.telefone) { setErro("Telefone é obrigatório"); return false; }
    if (!credenciais.senha) { setErro("Senha é obrigatório"); return false; }
    if (!confirmarSenha) { setErro("Confirmar é obrigatório"); return false; }
    if (credenciais.senha !== confirmarSenha) { setErro("Senhas não são iguais"); return false; }
    if (!credenciais.tipoUsuario) { setErro("Tipo de Usuário é obrigatório"); return false; }

    return true;
  }

  async function cadastrarUsuario(evento) {
    evento.preventDefault();
    const validacao = validarCredenciais();

    if (!validacao) return console.error("Credenciais incorretas.")

    try {
      const resposta = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciais)
      });

      if (!resposta.ok) {
        const erroBackend = await resposta.json();

        console.log("STATUS:", resposta.status);
        console.log("ERRO DO BACKEND:", erroBackend);

        throw new Error("Erro na requisição");
      }

      await resposta.json();

      setErro("");
      setSucesso("Cadastro realizado com sucesso");

      resetFormulario()

      setTimeout(() => {
        setSucesso("");
      }, 10000);

    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
    }
  }

  return (
    <>
      {/* <Header /> */}
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto relative">
        <button className="absolute top-2 right-2 text-red-500 font-bold">X</button>

        <h2 className="text-white text-xl font-bold mb-4">Cadastrar Usuário</h2>

        <form onSubmit={cadastrarUsuario}>
          <InputComponent
            label="Nome"
            value={credenciais.nome}
            onChange={atualizarNome}
          />
          <InputComponent
            label="Email"
            type="email"
            value={credenciais.email}
            onChange={atualizarEmail}
          />
          <InputComponent
            label="Telefone"
            type="tel"
            value={credenciais.telefone}
            onChange={atualizarTelefone}
          />
          <InputComponent
            label="Senha"
            type="password"
            value={credenciais.senha}
            onChange={atualizarSenha}
          />
          <InputComponent
            label="Confirmar Senha"
            type="password"
            value={confirmarSenha}
            onChange={atualizarConfirmarSenha}
          />
          <label className="block mt-4 text-xl font-semibold">
            Tipo de Usuário
          </label>
          <select
            value={credenciais.tipoUsuario}
            onChange={atualizarTipoUsuario}
            className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
          >
            <option value="">Selecione</option>

            {tipoUsuario.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.cargo}
              </option>
            ))}
          </select>

          {isAluno && (
            <>
              <label className="block mt-4 text-xl font-semibold">
                Condomínio
              </label>

              <select
                className="mt-1 w-full rounded-xl border border-black bg-white px-4 py-3 text-black"
                onChange={atualizarCondominio}
              >
                <option value="">Selecione</option>

                {condominioState.map((condominio) => (
                  <option key={condominio.id} value={condominio.id}>
                    {condominio.nome}
                  </option>
                ))}
              </select>
            </>
          )}

          {erro && (
            <p className="text-red-500 text-sm mt-3 flex justify-center font-bold">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="text-green-500 text-sm mt-3 flex justify-center font-bold">
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
          >
            Cadastrar Usuário
          </button>
        </form>
      </div>
    </>
  );
}


export default CadastroFuncionario;
