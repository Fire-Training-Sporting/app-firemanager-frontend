import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import { AlunosTable } from "../utils/Alunos/AlunosTable";
import ModalAluno from "../utils/Alunos/ModalAlunos";
import ConfirmationModal from "../utils/ConfirmationModal";
import api from "../../provider/api";

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

  useEffect(() => {
    buscarAlunos();
  }, []);

  const buscarAlunos = async () => {

    try {

      setIsLoading(true);

      const resp =
        await api.get("/usuarios");

      const usuarios =
        resp.data || [];

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

  const handleCloseModal = () => {

    setShowModal(false);

    setAlunoEditando(null);

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