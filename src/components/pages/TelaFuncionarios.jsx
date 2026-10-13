import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import TabelaFuncionarios from "../utils/Funcionarios/TabelaFuncionarios";
import ModalCadastroFuncionario from "../utils/Funcionarios/ModalCadastroFuncionario";
import ModalFuncionarioDetalhes from "../utils/Funcionarios/ModalFuncionarioDetalhes";
import ConfirmationModal from "../utils/ConfirmationModal";
import AlertMessage from "../utils/AlertMessage";
import api from "../../provider/api";
import { formatarValor, exibirSucesso } from "../../utils/helpers";

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
  const [tipoUsuarioCargos, setTipoUsuarioCargos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [filtroAtual, setFiltroAtual] = useState(null);

  const [selectedEmployee,
    setSelectedEmployee] = useState(null);

  const [funcionarioParaExcluir,
    setFuncionarioParaExcluir] = useState(null);

  const [funcionarioDetalhes, setFuncionarioDetalhes] = useState(null);

  const [sucessoCadastro,
    setSucessoCadastro] = useState("");

  const [sucessoVisivel,
    setSucessoVisivel] = useState(false);

  const [isLoading,
    setIsLoading] = useState(false);

  useEffect(() => {
    async function carregarCargosEBuscarFuncionarios() {
      try {
        const response = await api.get("/tipo-usuarios");
        const cargos = (response.data || [])
          .map((tipo) => String(tipo.cargo || "").trim())
          .filter((cargo) => cargo && cargo.toLowerCase() !== "aluno" && cargo.toLowerCase() !== "root");

        setTipoUsuarioCargos(cargos);
        await buscarDados(0, null, cargos);
      } catch (error) {
        console.error("Erro ao carregar tipos de funcionário:", error);
      }
    }

    carregarCargosEBuscarFuncionarios();
  }, []);

  async function buscarDados(pagina = paginaAtual, filtro = filtroAtual, cargos = tipoUsuarioCargos) {

    try {

      setIsLoading(true);

      if (cargos.length === 0) {
        setFuncionarios([]);
        setPaginaAtual(0);
        setTotalPaginas(0);
        setTotalFuncionarios(0);
        return;
      }

      const params = new URLSearchParams({ page: String(pagina), size: "10" });
      cargos.forEach((cargo) => params.append("tipoUsuarioCargo", cargo));

      if (filtro?.value) {
        params.set("campo", filtro.field);
        params.set("busca", filtro.value);
      }

      const response = await api.get("/usuarios", { params });
      const paginaResponse = response.data;
      const totalPaginasResposta = Number(paginaResponse?.totalPages) || 0;
      const ultimaPagina = Math.max(0, totalPaginasResposta - 1);

      if (pagina > ultimaPagina) {
        await buscarDados(ultimaPagina, filtro, cargos);
        return;
      }

      setFuncionarios(paginaResponse?.content || []);
      setPaginaAtual(Number(paginaResponse?.page) || 0);
      setTotalPaginas(totalPaginasResposta);
      setTotalFuncionarios(Number(paginaResponse?.totalElements) || 0);
    } catch (err) {

      console.error(
        "Erro ao carregar funcionários:",
        err
      );

    } finally {

      setIsLoading(false);

    }
  }

  function filtrarFuncionarios({ field, value }) {
    const filtro = value.trim() ? { field, value: value.trim() } : null;
    setFiltroAtual(filtro);
    return buscarDados(0, filtro);
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

  function handleDetalhes(funcionario) {
    setFuncionarioDetalhes(funcionario);
  }

  function handleCloseDetalhesModal() {
    setFuncionarioDetalhes(null);
  }

  function onBackFromEdit() {
    const funcionarioAtual = selectedEmployee;
    setSelectedEmployee(null);
    setIsModalOpen(false);
    setFuncionarioDetalhes(funcionarioAtual);
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

      await buscarDados(paginaAtual, filtroAtual);

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

  function handleSuccess(acao = "created") {
    const exibirSucessoLocal = exibirSucesso(setSucessoCadastro, setSucessoVisivel);

    setIsModalOpen(false);
    exibirSucessoLocal(
      acao === "updated"
        ? "Funcionário atualizado com sucesso"
        : "Funcionário cadastrado com sucesso"
    );
    buscarDados(0, filtroAtual);
    setSelectedEmployee(null);
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
            onDetails={handleDetalhes}
            currentPage={paginaAtual}
            totalPages={totalPaginas}
            totalItems={totalFuncionarios}
            isLoading={isLoading}
            onPageChange={(pagina) => buscarDados(pagina)}
          />

        </div>

      </PageLayout>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <ModalCadastroFuncionario
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleSuccess}
            usuario={selectedEmployee}
            onBack={selectedEmployee ? onBackFromEdit : undefined}
          />
        </div>
      )}

      {funcionarioDetalhes && (
        <ModalFuncionarioDetalhes
          funcionario={funcionarioDetalhes}
          onClose={handleCloseDetalhesModal}
          onEdit={() => {
            handleCloseDetalhesModal();
            handleEdit(funcionarioDetalhes);
          }}
          onDelete={() => {
            handleCloseDetalhesModal();
            solicitarExclusao(funcionarioDetalhes);
          }}
        />
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