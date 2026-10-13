import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import { AlunosTable } from "../utils/Alunos/AlunosTable";
import ModalAluno from "../utils/Alunos/ModalAlunos";
import ModalAlunoDetalhes from "../utils/Alunos/ModalAlunoDetalhes";
import ModalSaldo from "../utils/Alunos/ModalSaldo";
import ConfirmationModal from "../utils/ConfirmationModal";
import api from "../../provider/api";

const saldoServicesOrder = ["Tênis", "Beach Tennis", "Funcional"];

const search_columns = [
  { label: "ID", value: "id" },
  { label: "Nome", value: "nome" },
  { label: "Email", value: "email" },
  { label: "Telefone", value: "telefone" },
  { label: "Endereço", value: "endereco" },
];

export default function TelaAlunos() {

  const [showModal, setShowModal] = useState(false);

  const [alunoEditando, setAlunoEditando] =
    useState(null);

  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [filtroAtual, setFiltroAtual] = useState(null);

  const [alunoParaExcluir, setAlunoParaExcluir] =
    useState(null);

  const [alunoParaSaldo, setAlunoParaSaldo] =
    useState(null);

  const [alunoDetalhes, setAlunoDetalhes] =
    useState(null);

  useEffect(() => {
    buscarAlunos(0, null);
  }, []);

  const buscarAlunos = async (pagina = paginaAtual, filtro = filtroAtual) => {

    try {

      setIsLoading(true);

      const params = new URLSearchParams({
        page: String(pagina),
        size: "10",
        tipoUsuarioCargo: "Aluno",
      });

      if (filtro?.value) {
        params.set("campo", filtro.field);
        params.set("busca", filtro.value);
      }

      const [usuariosResp, servicosResp, saldosResp] =
        await Promise.all([
          api.get("/usuarios", { params }),
          api.get("/servicos").catch(() => ({ data: [] })),
          api.get("/saldos").catch(() => ({ data: [] })),
        ]);

      const paginaResponse = usuariosResp.data;
      const totalPaginasResposta = Number(paginaResponse?.totalPages) || 0;
      const ultimaPagina = Math.max(0, totalPaginasResposta - 1);

      if (pagina > ultimaPagina) {
        await buscarAlunos(ultimaPagina, filtro);
        return;
      }

      const usuarios = paginaResponse?.content || [];
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

      const saldoPorAluno = saldos.reduce((mapa, saldo) => {
        const alunoId = getSaldoAlunoId(saldo);
        const servicoId = getSaldoServicoId(saldo);
        const servicoNome =
          saldo.servico?.nome ??
          saldo.fk_servico?.nome ??
          servicosPorId[servicoId] ??
          "";

        if (!alunoId || !servicoNome) {
          return mapa;
        }

        if (!mapa[alunoId]) {
          mapa[alunoId] = {
            "Tênis": 0,
            "Beach Tennis": 0,
            "Funcional": 0,
          };
        }

        if (saldoServicesOrder.includes(servicoNome)) {
          mapa[alunoId][servicoNome] =
            (mapa[alunoId][servicoNome] || 0) +
            Number(saldo.quantidade || 0);
        }

        return mapa;
      }, {});

      const alunosFiltrados = usuarios.map((u) => ({
            ...u,
            endereco:
              u.endereco ||
              u.condominio?.nome ||
              "",
            saldosPorServico:
              saldoPorAluno[String(u.id)] || {
                "Tênis": 0,
                "Beach Tennis": 0,
                "Funcional": 0,
              },
            saldoTotal: saldoServicesOrder.reduce(
              (total, servico) =>
                total + (saldoPorAluno[String(u.id)]?.[servico] || 0),
              0,
            ),
          }));

      setAlunos(alunosFiltrados);
      setPaginaAtual(Number(paginaResponse?.page) || 0);
      setTotalPaginas(totalPaginasResposta);
      setTotalAlunos(Number(paginaResponse?.totalElements) || 0);

    } catch (err) {

      console.error(
        "Erro ao buscar alunos:",
        err
      );

    } finally {

      setIsLoading(false);

    }
  };

  const handleAdd = () => {

    setAlunoEditando(null);

    setShowModal(true);

  };

  const handleEdit = (aluno) => {

    setAlunoEditando(aluno);

    setShowModal(true);

  };

  const handleAddSaldo = (aluno) => {

    setAlunoParaSaldo(aluno);

  };

  const handleCloseModal = () => {

    setShowModal(false);

    setAlunoEditando(null);

  };

  const handleCloseSaldoModal = () => {

    setAlunoParaSaldo(null);

  };

  const handleDetalhes = (aluno) => {

    setAlunoDetalhes(aluno);

  };

  const handleCloseDetalhesModal = () => {

    setAlunoDetalhes(null);

  };

  const onBackFromSaldo = () => {
    const alunoAtual = alunoParaSaldo;
    setAlunoParaSaldo(null);
    setAlunoDetalhes(alunoAtual);
  };

  const onSaldoCreated = () => {
    const alunoAtual = alunoParaSaldo;
    buscarAlunos(paginaAtual, filtroAtual);
    if (alunoAtual) {
      setAlunoParaSaldo(null);
      setAlunoDetalhes(alunoAtual);
    }
  };

  const onBackFromEdit = () => {
    const alunoAtual = alunoEditando;
    setAlunoEditando(null);
    setShowModal(false);
    setAlunoDetalhes(alunoAtual);
  };

  const onEditCreated = () => {
    const alunoAtual = alunoEditando;
    buscarAlunos(paginaAtual, filtroAtual);
    if (alunoAtual) {
      setAlunoEditando(null);
      setShowModal(false);
      setAlunoDetalhes(alunoAtual);
    }
  };

  const solicitarExclusao = (
    aluno
  ) => {

    setAlunoParaExcluir(aluno);

  };

  const cancelarExclusao = () => {

    setAlunoParaExcluir(null);

  };

  const confirmarExclusao =
    async () => {

      if (!alunoParaExcluir?.id) {
        return;
      }

      try {

        await api.delete(
          `/usuarios/${alunoParaExcluir.id}`
        );

        setAlunoParaExcluir(null);

        await buscarAlunos(paginaAtual, filtroAtual);

      } catch (error) {

        console.error(
          "Erro ao excluir aluno:",
          error
        );

        window.alert(
          "Não foi possível excluir o aluno. Tente novamente."
        );
      }
    };

  const formatarValor = (
    valor
  ) => {

    if (
      valor &&
      typeof valor === "object"
    ) {

      return valor.nome ?? "-";

    }

    return valor ?? "-";
  };

  const filtrarAlunos = ({ field, value }) => {
    const filtro = value.trim() ? { field, value: value.trim() } : null;
    setFiltroAtual(filtro);
    return buscarAlunos(0, filtro);
  };

  return (
    <PageLayout
      title="Alunos"
      searchPlaceholder="Pesquisar aluno..."
      onAdd={handleAdd}
      addLabel="Cadastrar aluno"
      customControls={
        <SearchFilter
          columns={search_columns}
          onSearch={filtrarAlunos}
          isLoading={isLoading}
        />
      }
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <AlunosTable
          alunos={alunos}
          onDetails={handleDetalhes}
          currentPage={paginaAtual}
          totalPages={totalPaginas}
          totalItems={totalAlunos}
          isLoading={isLoading}
          onPageChange={(pagina) => buscarAlunos(pagina)}
        />
      </div>

      {showModal && (
        <ModalAluno
          aluno={alunoEditando}
          onClose={handleCloseModal}
          onCreated={onEditCreated}
          onBack={alunoEditando ? onBackFromEdit : undefined}
        />
      )}

      {alunoParaSaldo && (
        <ModalSaldo
          aluno={alunoParaSaldo}
          onClose={handleCloseSaldoModal}
          onCreated={onSaldoCreated}
          onBack={onBackFromSaldo}
        />
      )}

      {alunoDetalhes && (
        <ModalAlunoDetalhes
          aluno={alunoDetalhes}
          onClose={handleCloseDetalhesModal}
          onEdit={() => {
            handleCloseDetalhesModal();
            handleEdit(alunoDetalhes);
          }}
          onDelete={() => {
            handleCloseDetalhesModal();
            solicitarExclusao(alunoDetalhes);
          }}
          onAddSaldo={() => {
            setAlunoDetalhes(null);
            handleAddSaldo(alunoDetalhes);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={!!alunoParaExcluir}
        title="Confirmar exclusão"
        message="Deseja realmente excluir este aluno?"
        items={
          alunoParaExcluir
            ? [
                {
                  label: "ID",
                  value: alunoParaExcluir.id,
                },
                {
                  label: "Nome",
                  value: formatarValor(alunoParaExcluir.nome),
                },
                {
                  label: "Email",
                  value: formatarValor(alunoParaExcluir.email),
                },
                {
                  label: "Telefone",
                  value: formatarValor(alunoParaExcluir.telefone),
                },
                {
                  label: "Endereço",
                  value: formatarValor(alunoParaExcluir.endereco),
                },
              ]
            : []
        }
        confirmLabel="Sim, excluir"
        cancelLabel="Não, cancelar"
        onCancel={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />

      </PageLayout>
  );
}