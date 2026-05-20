import { useState, useEffect } from "react";
import PageLayout from '../utils/PageLayout';
import TabelaFuncionarios from '../utils/Funcionarios/TabelaFuncionarios';
import ModalCadastroFuncionario from '../utils/Funcionarios/ModalCadastroFuncionario';
import ModalEdicaoFuncionario from '../utils/Funcionarios/ModalEdicaoFuncionario';
import api from "../../provider/api";

export default function TelaFuncionarios() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
      console.log('Funcionários carregados:', funcionariosFiltrados);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
    }
  };

  const handleAdd = () => setShowModal(true);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDelete = () => {};

  const handleUpdate = (data) => {
    buscarDados();
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <ModalCadastroFuncionario
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); buscarDados(); }}
          />
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <ModalEdicaoFuncionario
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onUpdate={(data) => { handleUpdate(data); setShowEditModal(false); }}
            employee={selectedEmployee}
          />
        </div>
      )}
    </div>
  );
}
