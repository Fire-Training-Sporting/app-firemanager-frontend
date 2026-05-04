import { useState } from "react";
import PageLayout from '../utils/PageLayout';
import TabelaFuncionarios from '../utils/Funcionarios/TabelaFuncionarios';
import ModalCadastroFuncionario from '../utils/Funcionarios/ModalCadastroFuncionario';

export default function TelaFuncionarios() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <PageLayout
        title="Funcionários"
        searchPlaceholder="Pesquisar funcionário"
        onSearch={() => {}}
        onAdd={() => setShowModal(true)}
        addLabel="Cadastrar funcionário"
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <TabelaFuncionarios />
        </div>
      </PageLayout>
      <ModalCadastroFuncionario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}