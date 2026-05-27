import { useState, useEffect } from "react";
import api from "../../../provider/api";

export default function ModalScheduling({ agendamento = null, onClose, onCreated }) {
  const isEditMode = !!agendamento;

  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [local, setLocal] = useState("");
  const [alunosSelecionados, setAlunosSelecionados] = useState([
    { alunoId: "" }
  ]);
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
  const podeAdicionarFuncionario = funcionarios.length < 3;

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
      setAlunosSelecionados([
        { alunoId: "" }
      ]);
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
    setAlunosSelecionados([
      { alunoId: String(agendamento.aluno || "") }
    ]);
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
      alunos: alunosSelecionados
        .map(a => a.alunoId)
        .filter(Boolean)
        .map(Number),
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

  const addAluno = () => {
    setAlunosSelecionados([...alunosSelecionados, { alunoId: "" }]);
  };

  const updateAluno = (index, value) => {
    const updated = [...alunosSelecionados];
    updated[index].alunoId = value;
    setAlunosSelecionados(updated);
  };

  const removeAluno = (index) => {
    setAlunosSelecionados(alunosSelecionados.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="bg-linear-to-r from-[#F8821E] to-[#EA580C] px-4 py-2 flex items-center justify-between shrink-0 shadow-md rounded-t-2xl">
          <h2 className="text-white text-base font-bold">
            {isEditMode ? "Editar Agendamento" : "Novo Agendamento"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-red-200 transition rounded-full px-2 py-1 bg-black/20"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="overflow-y-auto px-4 py-3">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >

            {/* DATA */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#F8821E]"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {/* HORÁRIOS */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Início
                </label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Fim
                </label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
            </div>

            {/* CONDOMÍNIO */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Condomínio
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              >
                <option value="">Selecione</option>
                {condominiosOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* SERVIÇO */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Serviço
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                value={servico}
                onChange={(e) => setServico(e.target.value)}
              >
                <option value="">Selecione</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* ALUNOS */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alunos
              </label>

              {alunosSelecionados.map((a, index) => (
                <div key={index} className="flex gap-2 mb-1 items-center">
                  <select
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                    value={a.alunoId}
                    onChange={(e) => updateAluno(index, e.target.value)}
                  >
                    <option value="">Aluno</option>
                    {alunos.map((al) => (
                      <option key={al.id} value={al.id}>
                        {al.nome}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeAluno(index)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addAluno}
                className="mt-1 px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                + Adicionar aluno
              </button>
            </div>

            {/* FUNCIONÁRIOS */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Funcionários
              </label>

              {funcionarios.map((f, index) => (
                <div key={index} className="flex gap-2 mb-1 items-center">
                  <select
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                    value={f.funcionarioId}
                    onChange={(e) =>
                      updateFuncionario(index, "funcionarioId", e.target.value)
                    }
                  >
                    <option value="">Funcionário</option>
                    {funcionariosOptions.map((fn) => (
                      <option key={fn.id} value={fn.id}>
                        {fn.nome}
                      </option>
                    ))}
                  </select>

                  <select
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                    value={f.funcao}
                    onChange={(e) =>
                      updateFuncionario(index, "funcao", e.target.value)
                    }
                  >
                    {funcoes.map((fn) => (
                      <option key={fn} value={fn}>
                        {fn}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeFuncionario(index)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {podeAdicionarFuncionario && (
                <button
                  type="button"
                  onClick={addFuncionario}
                  className="mt-1 px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  + Adicionar funcionário
                </button>
              )}
            </div>

            {/* OBSERVAÇÃO */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Observação
              </label>

              <textarea
                className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-black focus:ring-2 focus:ring-[#F8821E]"
                rows="2"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            {/* BOTÕES */}
            <div className="md:col-span-2 flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-linear-to-r from-[#F8821E] to-[#EA580C] text-white text-sm font-semibold rounded-md shadow-md hover:scale-105 transition disabled:opacity-50"
              >
                {loading
                  ? "Processando..."
                  : isEditMode
                    ? "Salvar alterações"
                    : "Criar agendamento"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
