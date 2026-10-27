import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import personAddWhiteIcon from "../../assets/person_add_white.png";
import SearchFilter from "../utils/SearchFilter";
import { AlunosTable } from "../utils/Alunos/AlunosTable";
import ModalAluno from "../utils/Alunos/ModalAlunos";
import ModalAlunoDetalhes from "../utils/Alunos/ModalAlunoDetalhes";
import ModalSaldo from "../utils/Alunos/ModalSaldo";
import AlertMessage from "../utils/AlertMessage";
import StatusUsuarioFilter from "../utils/Usuarios/StatusUsuarioFilter";
import ConfirmacaoAcaoUsuario from "../utils/Usuarios/ConfirmacaoAcaoUsuario";
import { ACOES_USUARIO, podeFiltrarStatusUsuario } from "../utils/Usuarios/acoesUsuario";
import api from "../../provider/api";
import { exibirSucesso, getMensagemErro } from "../../utils/helpers";

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
  const [statusAtual, setStatusAtual] = useState("ATIVO");

  const [acaoUsuario, setAcaoUsuario] = useState(null);
  const [executandoAcao, setExecutandoAcao] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const [alunoParaSaldo, setAlunoParaSaldo] =
    useState(null);

  const [alunoDetalhes, setAlunoDetalhes] =
    useState(null);

  useEffect(() => {
    buscarAlunos(0, null);
  }, []);

  const buscarAlunos = async (pagina = paginaAtual, filtro = filtroAtual, status = statusAtual) => {

    try {

      setIsLoading(true);

      const params = new URLSearchParams({
        page: String(pagina),
        size: "10",
        tipoUsuarioCargo: "Aluno",
        status,
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
        await buscarAlunos(ultimaPagina, filtro, status);
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

  const solicitarAcao = (tipo, aluno) => {

    setAcaoUsuario({ tipo, usuario: aluno });

  };

  const cancelarAcao = () => {

    setAcaoUsuario(null);

  };

  const confirmarAcao = async () => {

    if (!acaoUsuario?.usuario?.id) {
      return;
    }

    const config = ACOES_USUARIO[acaoUsuario.tipo];

    try {

      setExecutandoAcao(true);
      setMensagemErro("");

      await config.executar(acaoUsuario.usuario.id);

      exibirSucesso(setMensagemSucesso, setSucessoVisivel)(config.sucesso);

      await buscarAlunos(paginaAtual, filtroAtual);

    } catch (error) {

      console.error(
        `Erro ao ${acaoUsuario.tipo} aluno:`,
        error
      );

      setMensagemErro(
        getMensagemErro(error, `Não foi possível ${acaoUsuario.tipo} o aluno. Tente novamente.`)
      );

    } finally {

      setExecutandoAcao(false);
      setAcaoUsuario(null);

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

  const filtrarPorStatus = (status) => {
    setStatusAtual(status);
    return buscarAlunos(0, filtroAtual, status);
  };

  return (
    <PageLayout
      title="Alunos"
      searchPlaceholder="Pesquisar aluno..."
      onAdd={handleAdd}
      addLabel="Cadastrar aluno"
      addIcon={personAddWhiteIcon}
      customControls={
        <div className="flex w-full flex-wrap items-center gap-3">
          {podeFiltrarStatusUsuario() && (
            <StatusUsuarioFilter
              value={statusAtual}
              onChange={filtrarPorStatus}
              isLoading={isLoading}
            />
          )}
          <div className="w-full min-w-0 lg:w-auto lg:flex-1">
            <SearchFilter
              columns={search_columns}
              onSearch={filtrarAlunos}
              isLoading={isLoading}
            />
          </div>
        </div>
      }
    >
      <AlertMessage
        variant="success"
        message={sucessoVisivel ? mensagemSucesso : ""}
      />

      <AlertMessage variant="error" message={mensagemErro} />

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
          onArquivar={() => {
            handleCloseDetalhesModal();
            solicitarAcao("arquivar", alunoDetalhes);
          }}
          onDesarquivar={() => {
            handleCloseDetalhesModal();
            solicitarAcao("desarquivar", alunoDetalhes);
          }}
          onExcluir={() => {
            handleCloseDetalhesModal();
            solicitarAcao("excluir", alunoDetalhes);
          }}
          onAddSaldo={() => {
            setAlunoDetalhes(null);
            handleAddSaldo(alunoDetalhes);
          }}
        />
      )}

      <ConfirmacaoAcaoUsuario
        acao={acaoUsuario}
        isLoading={executandoAcao}
        items={
          acaoUsuario?.usuario
            ? [
                {
                  label: "ID",
                  value: acaoUsuario.usuario.id,
                },
                {
                  label: "Nome",
                  value: formatarValor(acaoUsuario.usuario.nome),
                },
                {
                  label: "Email",
                  value: formatarValor(acaoUsuario.usuario.email),
                },
                {
                  label: "Telefone",
                  value: formatarValor(acaoUsuario.usuario.telefone),
                },
                {
                  label: "Endereço",
                  value: formatarValor(acaoUsuario.usuario.endereco),
                },
              ]
            : []
        }
        onCancel={cancelarAcao}
        onConfirm={confirmarAcao}
      />

      </PageLayout>
  );
}