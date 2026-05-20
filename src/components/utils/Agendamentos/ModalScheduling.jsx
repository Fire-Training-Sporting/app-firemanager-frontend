import { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalScheduling({ agendamento = null, onClose, onCreated }) {
  const isEditMode = !!agendamento;
  
  const [data, setData] = useState(agendamento?.data || "");
  const [horaInicio, setHoraInicio] = useState(agendamento?.horaInicio?.slice(0, 5) || "");
  const [horaFim, setHoraFim] = useState(agendamento?.horaFim?.slice(0, 5) || "");
  const [local, setLocal] = useState(agendamento?.condominio?.nome || agendamento?.condominio || "");
  const [aluno, setAluno] = useState(agendamento?.aluno?.nome || agendamento?.aluno || "");
  const [servico, setServico] = useState(agendamento?.servico?.titulo || agendamento?.servico || "");
  const [funcionarios, setFuncionarios] = useState(agendamento?.funcionarios || [{ nome: "", funcao: "" }]);
  const [observacao, setObservacao] = useState(agendamento?.observacao || "");
  const [condominios, setCondominios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);
  const [erroHorario, setErroHorario] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [condominiosResponse, usuariosResponse, servicosResponse] = await Promise.all([
          api.get("/condominios"),
          api.get("/usuarios"),
          api.get("/servicos"),
        ]);

        setCondominios(condominiosResponse.data || []);
        setUsuarios(usuariosResponse.data || []);
        setListaServicos(servicosResponse.data || []);

      } catch (err) {
        console.error("Erro ao buscar dados para o agendamento:", err);
      }
    };

    buscarDados();
  }, []);

  const obterNome = (item) =>
    item?.nome ?? item?.descricao ?? item?.razaoSocial ?? item?.titulo ?? String(item ?? "");

  const obterId = (item) => item?.id ?? item?.codigo ?? obterNome(item);
  const cargosQuadra = ["professor"];
  const funcoes = ["Professor", "Rebatedor", "Auxiliar"];

  const condominiosOptions = condominios;

  const alunos = usuarios
    .filter((usuario) => usuario.tipoUsuario?.cargo === "Aluno")
    .map((usuario) => ({
      id: obterId(usuario),
      nome: obterNome(usuario),
    }));

  const funcionariosOptions = usuarios
    .filter((usuario) => {
      const cargo = (usuario.tipoUsuario?.cargo || "").toString().trim().toLowerCase();
      return cargosQuadra.includes(cargo);
    })
    .map((usuario) => ({
      id: obterId(usuario),
      nome: obterNome(usuario),
    }));

  const servicos = listaServicos.map((item) => ({
    id: obterId(item),
    nome: obterNome(item),
  }));

  const encontrarIdPorNome = (lista, nomeSelecionado) =>
    lista.find((item) => item.nome === nomeSelecionado)?.id ?? null;

  const encontrarFuncionarioPorFuncao = (funcao) =>
    funcionarios.find((item) => item.funcao === funcao && item.nome);

  const formatarHora = (hora) => (hora ? `${hora}:00` : null);

  const addFuncionario = () => {
    if (funcionarios.length < 3) {
      setFuncionarios([...funcionarios, { nome: "", funcao: "" }]);
    }
  };

  const updateFuncionario = (index, field, value) => {
    const updated = [...funcionarios];
    updated[index][field] = value;
    setFuncionarios(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de horários
    if (!horaInicio || !horaFim) {
      setErroHorario("Informe os horários de início e término.");
      return;
    }
    if (horaFim <= horaInicio) {
      setErroHorario("A hora de término deve ser maior que a hora de início.");
      return;
    }
    setErroHorario("");

    const funcionarioProfessor = encontrarFuncionarioPorFuncao("Professor");
    const funcionarioRebatedor = encontrarFuncionarioPorFuncao("Rebatedor");
    const funcionarioAuxiliar = encontrarFuncionarioPorFuncao("Auxiliar");

    const agendamentoData = {
      aluno: encontrarIdPorNome(alunos, aluno),
      professor: encontrarIdPorNome(funcionariosOptions, funcionarioProfessor?.nome),
      auxiliar: encontrarIdPorNome(funcionariosOptions, funcionarioAuxiliar?.nome),
      rebatedor: encontrarIdPorNome(funcionariosOptions, funcionarioRebatedor?.nome),
      servico: encontrarIdPorNome(servicos, servico),
      condominio: encontrarIdPorNome(condominiosOptions, local),
      data,
      horaInicio: formatarHora(horaInicio),
      horaFim: formatarHora(horaFim),
      observacao,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        // Modo EDIÇÃO - PATCH
        await api.patch(`/agendamentos/${agendamento.id}`, agendamentoData);
        if (onCreated) {
          onCreated();
        }
      } else {
        // Modo CRIAÇÃO - POST
        await api.post("/agendamentos", agendamentoData);
        if (onCreated) {
          onCreated();
        }
      }
      onClose();
    } catch (err) {
      console.error(isEditMode ? "Erro ao atualizar agendamento:" : "Erro ao criar agendamento:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col transform transition-all duration-300">

        {/* Cabeçalho */}
        <div className="bg-linear-to-r from-[#F8821E] to-[#EA580C] px-5 py-3 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">
            {isEditMode ? "Editar Agendamento" : "Novo Agendamento"}
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
          <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hora início</label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hora término</label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
            </div>
            {erroHorario && <p className="text-red-600 text-sm">{erroHorario}</p>}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Condomínio</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              >
                <option value="">Selecione um condomínio</option>
                {condominiosOptions.map((condominio) => (
                  <option key={obterId(condominio)} value={obterNome(condominio)}>
                    {obterNome(condominio)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Aluno</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                  value={aluno}
                  onChange={(e) => setAluno(e.target.value)}
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map((alunoItem) => (
                    <option key={alunoItem.id ?? alunoItem.nome} value={alunoItem.nome}>{alunoItem.nome}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Serviço</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((servicoItem) => (
                    <option key={servicoItem.id ?? servicoItem.nome} value={servicoItem.nome}>{servicoItem.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Funcionários</label>
              {funcionarios.map((f, index) => (
                <div key={index} className="flex gap-2 mb-1.5">
                  <select
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                    value={f.nome}
                    onChange={(e) => updateFuncionario(index, "nome", e.target.value)}
                  >
                    <option value="">Selecione o funcionário</option>
                    {funcionariosOptions.map((funcionario) => (
                      <option key={funcionario.id} value={funcionario.nome}>{funcionario.nome}</option>
                    ))}
                  </select>

                  <select
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                    value={f.funcao}
                    onChange={(e) => updateFuncionario(index, "funcao", e.target.value)}
                  >
                    <option value="">Selecione a função</option>
                    {funcoes.map((funcao) => (
                      <option key={funcao} value={funcao}>{funcao}</option>
                    ))}
                  </select>
                </div>
              ))}

              <button
                type="button"
                onClick={addFuncionario}
                disabled={funcionarios.length >= 3}
                className={`px-3 py-1.5 text-sm rounded-md transition ${funcionarios.length >= 3
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
              >
                + Adicionar funcionário
              </button>

              {funcionarios.length >= 3 && (
                <p className="text-xs text-gray-500 mt-1">Máximo de 3 funcionários.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Observação</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                rows="2"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-linear-to-r from-[#F8821E] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F8821E] text-white text-sm font-semibold rounded-md shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processando..." : (isEditMode ? "Salvar alterações" : "Criar agendamento")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
