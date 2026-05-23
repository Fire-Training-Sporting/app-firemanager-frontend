import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import TabelaFuncionarios from '../utils/Funcionarios/TabelaFuncionarios';
import ModalCadastroFuncionario from '../utils/Funcionarios/ModalCadastroFuncionario'; // Modal unificado
import api from "../../provider/api";

export default function TelaFuncionarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const resp = await api.get('/usuarios');
      const usuarios = resp.data || [];
      const funcionariosFiltrados = usuarios.filter((usuario) => {
        const cargo = (usuario.tipoUsuario?.cargo || '').toString().trim().toLowerCase();
        return cargo !== 'aluno' && cargo !== 'root' && cargo !== '';
      });

      setFuncionarios(funcionariosFiltrados);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
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
        onSearch={() => {}}
        onAdd={handleAdd}
        addLabel="Cadastrar funcionário"
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <TabelaFuncionarios
            funcionarios={funcionarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </PageLayout>

      <ModalCadastroFuncionario
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreated={buscarDados} 
        usuario={selectedEmployee} 
      />
    </div>
  );
}