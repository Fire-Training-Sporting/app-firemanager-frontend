import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import TabelaFuncionarios from "../utils/Funcionarios/TabelaFuncionarios";
import ModalCadastroFuncionario from "../utils/Funcionarios/ModalCadastroFuncionario";
import ConfirmationModal from "../utils/ConfirmationModal";
import AlertMessage from "../utils/AlertMessage";
import api from "../../provider/api";

const search_columns = [
  { label: "ID", value: "id" },
  { label: "Nome", value: "nome" },
  { label: "Email", value: "email" },
  { label: "Telefone", value: "telefone" },
  { label: "Tipo", value: "tipoUsuario.cargo" },
];

export default function TelaFuncionarios() {

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [funcionarios, setFuncionarios] =
    useState([]);

  const [funcionariosOriginais,
    setFuncionariosOriginais] = useState([]);

  const [selectedEmployee,
    setSelectedEmployee] = useState(null);

  const [funcionarioParaExcluir,
    setFuncionarioParaExcluir] = useState(null);

  const [sucessoCadastro,
    setSucessoCadastro] = useState("");

  const [sucessoVisivel,
    setSucessoVisivel] = useState(false);

  const [isLoading,
    setIsLoading] = useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {

    try {

      setIsLoading(true);

      const resp = await api.get("/usuarios");

      const usuarios = resp.data || [];

      const funcionariosFiltrados =
        usuarios.filter((usuario) => {

          const cargo =
            (usuario.tipoUsuario?.cargo || "")
              .toString()
              .trim()
              .toLowerCase();

          return (
            cargo !== "aluno" &&
            cargo !== "root" &&
            cargo !== ""
          );
        });

      setFuncionarios(funcionariosFiltrados);
      setFuncionariosOriginais(funcionariosFiltrados);
    } catch (err) {

      console.error(
        "Erro ao carregar funcionários:",
        err
      );

    } finally {

      setIsLoading(false);

    }
  }

  async function filtrarFuncionarios({
    field,
    value,
  }) {

    try {

      setIsLoading(true);

      if (!value.trim()) {
        setFuncionarios(funcionariosOriginais);
        return;
      }

      function getFieldValue(obj, path) {
        if (!path) return undefined;
        const parts = path.split(".");
        let cur = obj;
        for (const p of parts) {
          if (cur == null) return undefined;
          cur = cur[p];
        }
        return cur;
      }

      const filtrados =
        funcionariosOriginais.filter((funcionario) => {
          const fieldValue = getFieldValue(funcionario, field);

          const compareValue = value.toLowerCase().trim();

          let fieldString = "";

          if (typeof fieldValue === "object" && fieldValue !== null) {
            if (fieldValue.nome) {
              fieldString = String(fieldValue.nome).toLowerCase();
            } else if (fieldValue.cargo) {
              fieldString = String(fieldValue.cargo).toLowerCase();
            } else if (fieldValue.perfil) {
              fieldString = String(fieldValue.perfil).toLowerCase();
            } else {
              fieldString = Object.values(fieldValue)
                .filter((v) => v != null)
                .join(" ")
                .toLowerCase();
            }
          } else if (typeof fieldValue === "string") {
            fieldString = fieldValue.toLowerCase();
          } else if (typeof fieldValue === "number") {
            fieldString = fieldValue.toString().toLowerCase();
          } else if (fieldValue instanceof Date) {
            fieldString = fieldValue.toLocaleDateString("pt-BR").toLowerCase();
          }

          return fieldString.includes(compareValue);
        });

      setFuncionarios(filtrados);

    } catch (error) {

      console.error(
        "Erro ao filtrar funcionários:",
        error
      );

    } finally {

      setIsLoading(false);

    }
  }

  function handleAdd() {

    setSelectedEmployee(null);

    setIsModalOpen(true);
  }

  async function handleEdit(employee) {

    try {

      const response = await api.get(
        `/usuarios/${employee.id}`
      );

      setSelectedEmployee(response.data);

      setIsModalOpen(true);

    } catch (error) {

      console.error(
        "Erro ao carregar funcionário:",
        error
      );

      window.alert(
        "Não foi possível carregar os dados do funcionário."
      );
    }
  }

  function handleModalClose() {

    setIsModalOpen(false);

    setSelectedEmployee(null);
  }

  function solicitarExclusao(employee) {

    setFuncionarioParaExcluir(employee);
  }

  function cancelarExclusao() {

    setFuncionarioParaExcluir(null);
  }

  async function confirmarExclusao() {

    if (!funcionarioParaExcluir?.id) {
      return;
    }

    try {

      await api.delete(
        `/usuarios/${funcionarioParaExcluir.id}`
      );

      setFuncionarioParaExcluir(null);

      await buscarDados();

    } catch (error) {

      console.error(
        "Erro ao excluir funcionário:",
        error
      );

      window.alert(
        "Não foi possível excluir o funcionário."
      );
    }
  }

  function formatarValor(valor) {

    if (
      valor &&
      typeof valor === "object"
    ) {

      return valor.nome ?? "-";
    }

    return valor ?? "-";
  }

  function handleSuccess(acao = "created") {

    setIsModalOpen(false);

    setSucessoCadastro(
      acao === "updated"
        ? "Funcionário atualizado com sucesso"
        : "Funcionário cadastrado com sucesso"
    );

    setSucessoVisivel(true);

    buscarDados();

    setSelectedEmployee(null);

    window.clearTimeout(
      handleSuccess.timeoutId
    );

    handleSuccess.timeoutId =
      window.setTimeout(() => {

        setSucessoCadastro("");
        setSucessoVisivel(false);

      }, 7000);
  }

  return (
    <div>

      <PageLayout
        title="Funcionários"
        searchPlaceholder="Pesquisar funcionário"
        onAdd={handleAdd}
        addLabel="Cadastrar funcionário"
        customControls={
          <SearchFilter
            columns={search_columns}
            onSearch={filtrarFuncionarios}
            isLoading={isLoading}
          />
        }
      >

        <AlertMessage
          variant="success"
          message={sucessoVisivel ? sucessoCadastro : ""}
        />

        <div className="bg-white rounded-lg shadow-md border overflow-hidden">

          <TabelaFuncionarios
            funcionarios={funcionarios}
            onEdit={handleEdit}
            onDelete={solicitarExclusao}
          />

        </div>

      </PageLayout>

      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">

          <ModalCadastroFuncionario
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleSuccess}
            usuario={selectedEmployee}
          />

        </div>
      )}

      <ConfirmationModal
        isOpen={!!funcionarioParaExcluir}
        title="Confirmar exclusão"
        message="Deseja realmente excluir este funcionário?"
        items={
          funcionarioParaExcluir
            ? [
                {
                  label: "ID",
                  value:
                    funcionarioParaExcluir.id,
                },
                {
                  label: "Nome",
                  value: formatarValor(
                    funcionarioParaExcluir.nome
                  ),
                },
                {
                  label: "Email",
                  value: formatarValor(
                    funcionarioParaExcluir.email
                  ),
                },
                {
                  label: "Telefone",
                  value: formatarValor(
                    funcionarioParaExcluir.telefone
                  ),
                },
                {
                  label: "Tipo",
                  value: formatarValor(
                    funcionarioParaExcluir
                      .tipoUsuario?.cargo ||
                    funcionarioParaExcluir.perfil
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

    </div>
  );
}