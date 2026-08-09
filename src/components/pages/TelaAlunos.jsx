import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import { AlunosTable } from "../utils/Alunos/AlunosTable";
import ModalAluno from "../utils/Alunos/ModalAlunos";
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

  const [alunosOriginais, setAlunosOriginais] =
    useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [alunoParaExcluir, setAlunoParaExcluir] =
    useState(null);

  const [alunoParaSaldo, setAlunoParaSaldo] =
    useState(null);

  useEffect(() => {
    buscarAlunos();
  }, []);

  const buscarAlunos = async () => {

    try {

      setIsLoading(true);

      const [usuariosResp, servicosResp, saldosResp] =
        await Promise.all([
          api.get("/usuarios"),
          api.get("/servicos").catch(() => ({ data: [] })),
          api.get("/saldos").catch(() => ({ data: [] })),
        ]);

      const usuarios = usuariosResp.data || [];
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

      const alunosFiltrados =
        usuarios
          .filter(
            (u) =>
              u.tipoUsuario?.cargo ===
              "Aluno"
          )
          .map((u) => ({
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

      setAlunosOriginais(
        alunosFiltrados
      );

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

        await buscarAlunos();

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

  const filtrarAlunos = async ({
    field,
    value,
  }) => {

    try {

      setIsLoading(true);

      if (!value.trim()) {

        setAlunos(
          alunosOriginais
        );

        return;
      }

      const filtrados =
        alunosOriginais.filter(
          (aluno) => {

            const fieldValue =
              aluno[field];

            const compareValue =
              value.toLowerCase();

            let fieldString = "";

            if (
              typeof fieldValue ===
                "object" &&
              fieldValue !== null
            ) {

              fieldString =
                fieldValue.nome
                  ? fieldValue.nome.toLowerCase()
                  : "";

            } else if (
              typeof fieldValue ===
              "string"
            ) {

              fieldString =
                fieldValue.toLowerCase();

            } else if (
              typeof fieldValue ===
              "number"
            ) {

              fieldString =
                fieldValue
                  .toString()
                  .toLowerCase();

            } else if (
              fieldValue instanceof Date
            ) {

              fieldString =
                fieldValue
                  .toLocaleDateString(
                    "pt-BR"
                  )
                  .toLowerCase();
            }

            return fieldString.includes(
              compareValue
            );
          }
        );

      setAlunos(filtrados);

    } catch (error) {

      console.error(
        "Erro ao filtrar alunos:",
        error
      );

    } finally {

      setIsLoading(false);

    }
  };

  return (

    <div
      className={
        showModal
          ? "modal-open"
          : ""
      }
    >

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
            onDelete={solicitarExclusao}
            onEdit={handleEdit}
            onAddSaldo={handleAddSaldo}
          />

        </div>

        {showModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

            <ModalAluno
              aluno={alunoEditando}
              onClose={
                handleCloseModal
              }
              onCreated={
                buscarAlunos
              }
            />

          </div>

        )}

        {alunoParaSaldo && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

            <ModalSaldo
              aluno={alunoParaSaldo}
              onClose={handleCloseSaldoModal}
            />

          </div>

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
                    value:
                      alunoParaExcluir.id,
                  },
                  {
                    label: "Nome",
                    value:
                      formatarValor(
                        alunoParaExcluir.nome
                      ),
                  },
                  {
                    label: "Email",
                    value:
                      formatarValor(
                        alunoParaExcluir.email
                      ),
                  },
                  {
                    label: "Telefone",
                    value:
                      formatarValor(
                        alunoParaExcluir.telefone
                      ),
                  },
                  {
                    label: "Endereço",
                    value:
                      formatarValor(
                        alunoParaExcluir.endereco
                      ),
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

    </div>
  );
}