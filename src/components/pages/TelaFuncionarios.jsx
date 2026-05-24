import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import SearchFilter from '../utils/SearchFilter';
import TabelaFuncionarios from '../utils/Funcionarios/TabelaFuncionarios';
import ModalCadastroFuncionario from '../utils/Funcionarios/ModalCadastroFuncionario'; // Modal unificado
import ConfirmationModal from '../utils/ConfirmationModal';
import api from "../../provider/api";

const search_columns = [
  { label: "ID", value: "id" },
  { label: "Nome", value: "nome" },
  { label: "Email", value: "email" },
  { label: "Telefone", value: "telefone" },
  { label: "Tipo", value: "perfil" },
];

export default function TelaFuncionarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionariosOriginais, setFuncionariosOriginais] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState(null);
  const [sucessoCadastro, setSucessoCadastro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      setIsLoading(true);
      const resp = await api.get('/usuarios');
      const usuarios = resp.data || [];
      const funcionariosFiltrados = usuarios.filter((usuario) => {
        const cargo = (usuario.tipoUsuario?.cargo || '').toString().trim().toLowerCase();
        return cargo !== 'aluno' && cargo !== 'root' && cargo !== '';
      });

      setFuncionarios(funcionariosFiltrados);
      setFuncionariosOriginais(funcionariosFiltrados);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarFuncionarios = async ({ field, value }) => {
    try {
      setIsLoading(true);

      if (!value.trim()) {
        setFuncionarios(funcionariosOriginais);
        return;
      }

      const filtrados = funcionariosOriginais.filter((funcionario) => {
        const fieldValue = funcionario[field];
        let compareValue = value.toLowerCase();

        let fieldString = "";

        if (typeof fieldValue === "object" && fieldValue !== null) {
          fieldString = fieldValue.nome ? fieldValue.nome.toLowerCase() : "";
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
      console.error("Erro ao filtrar funcionários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSucessoCadastro("Funcionário cadastrado com sucesso!");
    buscarDados();

    window.clearTimeout(handleSuccess.timeoutId);
    handleSuccess.timeoutId = window.setTimeout(() => {
      setSucessoCadastro("");
    }, 7000);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setFuncionarioParaExcluir(null);
  };

  const solicitarExclusao = (employee) => {
    setFuncionarioParaExcluir(employee);
  };

  const confirmarExclusao = async () => {
    if (!funcionarioParaExcluir?.id) {
      return;
    }

    try {
      await api.delete(`/usuarios/${funcionarioParaExcluir.id}`);
      setFuncionarioParaExcluir(null);
      await buscarDados();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      window.alert('Não foi possível excluir o funcionário. Tente novamente.');
    }
  };

  const cancelarExclusao = () => {
    setFuncionarioParaExcluir(null);
  };

  const formatarValor = (valor) => {
    if (valor && typeof valor === 'object') {
      return valor.nome ?? '-';
    }

    return valor ?? '-';
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

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
        {sucessoCadastro && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {sucessoCadastro}
          </div>
        )}
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
        items={funcionarioParaExcluir ? [
          { label: "ID", value: funcionarioParaExcluir.id },
          { label: "Nome", value: formatarValor(funcionarioParaExcluir.nome) },
          { label: "Email", value: formatarValor(funcionarioParaExcluir.email) },
          { label: "Telefone", value: formatarValor(funcionarioParaExcluir.telefone) },
          { label: "Tipo", value: formatarValor(funcionarioParaExcluir.tipoUsuario?.cargo || funcionarioParaExcluir.perfil) },
        ] : []}
        confirmLabel="Sim, excluir"
        cancelLabel="Não, cancelar"
        onCancel={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />
    </div>
  );

}