import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import api from "../../provider/api";

const saldoServicesOrder = ["Tênis", "Beach Tennis", "Funcional"];

function getUsuarioLogado() {
  const usuarioString = sessionStorage.getItem("usuario");

  if (!usuarioString) {
    return null;
  }

  try {
    return JSON.parse(usuarioString);
  } catch {
    return null;
  }
}

function formatarValor(valor) {
  if (valor == null || valor === "") {
    return "-";
  }

  if (typeof valor === "object") {
    return valor.nome ?? valor.descricao ?? valor.razaoSocial ?? "-";
  }

  return String(valor);
}

export default function TelaPerfil() {
  const usuario = getUsuarioLogado();
  const cargo = sessionStorage.getItem("cargo");
  const usuarioId = sessionStorage.getItem("userId") ?? usuario?.id ?? usuario?.userId;
  
  const [saldosPorServico, setSaldosPorServico] = useState({
    "Tênis": 0,
    "Beach Tennis": 0,
    "Funcional": 0,
  });
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [isLoadingSaldos, setIsLoadingSaldos] = useState(false);
  const isAluno = cargo?.toLowerCase() === "aluno";

  useEffect(() => {
    if (isAluno && usuarioId) {
      buscarSaldosAluno();
    }
  }, [isAluno, usuarioId]);

  const buscarSaldosAluno = async () => {
    try {
      setIsLoadingSaldos(true);
      
      const [servicosResp, saldosResp] = await Promise.all([
        api.get("/servicos").catch(() => ({ data: [] })),
        api.get("/saldos").catch(() => ({ data: [] })),
      ]);

      const servicos = servicosResp.data || [];
      const saldos = saldosResp.data || [];

      const servicosPorId = servicos.reduce((mapa, servico) => {
        mapa[String(servico.id)] = servico.nome;
        return mapa;
      }, {});

      const getSaldoAlunoId = (saldo) =>
        String(
          saldo.aluno?.id ??
          saldo.fk_usuario?.id ??
          saldo.fk_usuario ??
          saldo.usuario?.id ??
          saldo.usuario ??
          saldo.aluno ??
          ""
        );

      const getSaldoServicoId = (saldo) =>
        String(
          saldo.servico?.id ??
          saldo.fk_servico?.id ??
          saldo.fk_servico ??
          saldo.servico_id ??
          saldo.servico ??
          ""
        );

      const saldoCalculado = saldos.reduce((mapa, saldo) => {
        const alunoId = getSaldoAlunoId(saldo);
        const servicoId = getSaldoServicoId(saldo);
        
        // Filtrar apenas saldos do usuário logado
        if (String(alunoId) !== String(usuarioId)) {
          return mapa;
        }

        const servicoNome =
          saldo.servico?.nome ??
          saldo.fk_servico?.nome ??
          servicosPorId[servicoId] ??
          "";

        if (!servicoNome) {
          return mapa;
        }

        if (!mapa[servicoNome]) {
          mapa[servicoNome] = 0;
        }

        if (saldoServicesOrder.includes(servicoNome)) {
          mapa[servicoNome] = (mapa[servicoNome] || 0) + Number(saldo.quantidade || 0);
        }

        return mapa;
      }, {});

      const saldosFormatados = {
        "Tênis": saldoCalculado["Tênis"] || 0,
        "Beach Tennis": saldoCalculado["Beach Tennis"] || 0,
        "Funcional": saldoCalculado["Funcional"] || 0,
      };

      const total = saldoServicesOrder.reduce(
        (total, servico) => total + (saldosFormatados[servico] || 0),
        0
      );

      setSaldosPorServico(saldosFormatados);
      setSaldoTotal(total);
    } catch (err) {
      console.error("Erro ao buscar saldos do aluno:", err);
    } finally {
      setIsLoadingSaldos(false);
    }
  };

  return (
    <PageLayout title="Perfil" showSearch={false} showAddButton={false}>
      <div className="flex justify-center px-4 py-6">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-1 h-7 bg-[#F8821E] rounded-full"></span>
                Informações Pessoais
              </h2>
              
              <div className="flex flex-col gap-3">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Nome</p>
                  <p className="text-base font-medium text-gray-800">{formatarValor(usuario?.nome)}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Email</p>
                  <p className="text-base font-medium text-gray-800">{formatarValor(usuario?.email)}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Tipo de Perfil</p>
                  <p className="text-base font-medium text-gray-800">{formatarValor(usuario?.cargo ?? sessionStorage.getItem("cargo"))}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-1">ID</p>
                  <p className="text-base font-medium text-gray-800">{formatarValor(usuario?.id ?? usuario?.userId)}</p>
                </div>
              </div>
            </div>

            {/* Saldo de Aulas (apenas para alunos) */}
            {isAluno && (
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="w-1 h-7 bg-[#F8821E] rounded-full"></span>
                  Saldo de Aulas
                </h2>
                
                {isLoadingSaldos ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F8821E]"></div>
                    <p className="text-sm text-gray-600 mt-3">Carregando saldos...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-3">
                      {saldoServicesOrder.map((servico) => (
                        <div key={servico} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-shadow">
                          <p className="text-xs font-bold uppercase text-orange-700 mb-1">{servico}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-base font-bold text-orange-800">
                              {saldosPorServico[servico] || 0}
                            </p>
                            <p className="text-xs text-orange-600">aulas disponíveis</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-[#F8821E] to-[#EA580C] rounded-xl p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase uppercase opacity-90">Saldo Total</p>
                          <p className="text-base font-bold mt-1">{saldoTotal} aulas disponíveis</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
