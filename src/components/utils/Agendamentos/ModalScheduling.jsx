import { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalScheduling({ agendamento = null, onClose, onCreated }) {
  const isEditMode = !!agendamento;

  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [local, setLocal] = useState("");
  const [aluno, setAluno] = useState("");
  const [servico, setServico] = useState("");
  const [funcionarios, setFuncionarios] = useState([
    { funcionarioId: "", funcao: "Professor" },
    { funcionarioId: "", funcao: "Rebatedor" },
    { funcionarioId: "", funcao: "Auxiliar" },
  ]);
  const [observacao, setObservacao] = useState("");
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

  const getId = (item) => item?.id ?? item?.codigo ?? item?.value ?? "";
  const getNome = (item) => item?.nome ?? item?.descricao ?? item?.razaoSocial ?? item?.titulo ?? "";

  const condominiosOptions = condominios.map((condominio) => ({
    id: String(getId(condominio)),
    nome: getNome(condominio),
  }));

  const alunos = usuarios
    .filter((usuario) => (usuario.tipoUsuario?.cargo || "").toString().trim().toLowerCase() === "aluno")
    .map((usuario) => ({ id: String(getId(usuario)), nome: getNome(usuario) }));

  const funcoes = ["Professor", "Rebatedor", "Auxiliar"];

  const funcionariosOptions = usuarios
    .filter((usuario) => {
      const cargo = (usuario.tipoUsuario?.cargo || "").toString().trim().toLowerCase();
      return cargo === "professor";
    })
    .map((usuario) => ({ id: String(getId(usuario)), nome: getNome(usuario) }));

  const servicos = listaServicos.map((item) => ({
    id: String(getId(item)),
    nome: getNome(item),
  }));

  useEffect(() => {
    if (!agendamento) {
      setData("");
      setHoraInicio("");
      setHoraFim("");
      setLocal("");
      setAluno("");
      setServico("");
      setFuncionarios([
        { funcionarioId: "", funcao: "Professor" },
        { funcionarioId: "", funcao: "Rebatedor" },
        { funcionarioId: "", funcao: "Auxiliar" },
      ]);
      setObservacao("");
      setErroHorario("");
      return;
    }

    setData(agendamento.data || "");
    setHoraInicio(agendamento.horaInicio || "");
    setHoraFim(agendamento.horaFim || "");
    setLocal(String(agendamento.condominio || ""));
    setAluno(String(agendamento.aluno || ""));
    setServico(String(agendamento.servico || ""));
    setFuncionarios([
      { funcionarioId: String(agendamento.professor || ""), funcao: "Professor" },
      { funcionarioId: String(agendamento.rebatedor || ""), funcao: "Rebatedor" },
      { funcionarioId: String(agendamento.auxiliar || ""), funcao: "Auxiliar" },
    ]);
    setObservacao(agendamento.observacao || "");
    setErroHorario("");
  }, [agendamento]);

  const addFuncionario = () => {
    if (funcionarios.length < 3) {
      setFuncionarios([...funcionarios, { funcionarioId: "", funcao: "" }]);
    }
  };

  const updateFuncionario = (index, field, value) => {
    const updated = [...funcionarios];
    updated[index][field] = value;
    setFuncionarios(updated);
  };

  const removeFuncionario = (index) => {
    setFuncionarios(funcionarios.filter((_, i) => i !== index));
  };

  const formatarHoraPayload = (hora) => (hora ? `${hora.slice(0, 5)}:00` : null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!horaInicio || !horaFim) {
      setErroHorario("Informe os horários de início e término.");
      return;
    }

    if (horaFim <= horaInicio) {
      setErroHorario("A hora de término deve ser maior que a hora de início.");
      return;
    }

    setErroHorario("");

    const funcionarioProfessor = funcionarios.find((item) => item.funcao === "Professor" && item.funcionarioId);
    const funcionarioRebatedor = funcionarios.find((item) => item.funcao === "Rebatedor" && item.funcionarioId);
    const funcionarioAuxiliar = funcionarios.find((item) => item.funcao === "Auxiliar" && item.funcionarioId);

    const agendamentoData = {
      aluno: aluno ? Number(aluno) : null,
      professor: funcionarioProfessor?.funcionarioId ? Number(funcionarioProfessor.funcionarioId) : null,
      auxiliar: funcionarioAuxiliar?.funcionarioId ? Number(funcionarioAuxiliar.funcionarioId) : null,
      rebatedor: funcionarioRebatedor?.funcionarioId ? Number(funcionarioRebatedor.funcionarioId) : null,
      servico: servico ? Number(servico) : null,
      condominio: local ? Number(local) : null,
      data,
      horaInicio: formatarHoraPayload(horaInicio),
      horaFim: formatarHoraPayload(horaFim),
      observacao,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        api.patch(`/agendamentos/${agendamento.id}`, agendamentoData);
        if (onCreated) {
          onCreated();
        }
      } else {
        api.post("/agendamentos", agendamentoData);
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
                  <option key={condominio.id} value={condominio.id}>
                    {condominio.nome}
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
                  disabled={isEditMode}
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map((alunoItem) => (
                    <option key={alunoItem.id ?? alunoItem.nome} value={alunoItem.id}>{alunoItem.nome}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Serviço</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  disabled={isEditMode}
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((servicoItem) => (
                    <option key={servicoItem.id ?? servicoItem.nome} value={servicoItem.id}>{servicoItem.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Funcionários</label>
              {funcionarios.map((f, index) => (
                <div key={index} className="flex gap-2 mb-1.5 items-center">
                  {/* Select de professores */}
                  <select
                    className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                    value={f.funcionarioId}
                    onChange={(e) => updateFuncionario(index, "funcionarioId", e.target.value)}
                  >
                    <option value="">Selecione o funcionário</option>
                    {funcionariosOptions.map((funcionario) => (
                      <option key={funcionario.id} value={String(funcionario.id)}>{funcionario.nome}</option>
                    ))}
                  </select>

                  <select
                    className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                    value={f.funcao}
                    onChange={(e) => updateFuncionario(index, "funcao", e.target.value)}
                  >
                    <option value="">Selecione a função</option>
                    {funcoes.map((funcao) => (
                      <option key={funcao} value={funcao}>{funcao}</option>
                    ))}
                  </select>

                  {/* Botão de exclusão */}
                  <button
                    type="button"
                    onClick={() => removeFuncionario(index)}
                    className="flex-none px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                  >
                    ✕
                  </button>
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
