import { useState } from "react";
import PageLayout from '../utils/PageLayout';
import FuncionariosTable from '../utils/Funcionarios/FuncionariosTable';
import ModalEmployeeRegistration from '../utils/Funcionarios/ModalEmployeeRegistration';

export default function TelaFuncionarios() {
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {};
  const handleAdd = () => setShowModal(true);

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Funcionários"
        searchPlaceholder="Pesquisar funcionário"
        onSearch={showModal ? () => {} : handleSearch} // desativa pesquisa quando modal aberto
        onAdd={showModal ? () => setShowModal(false) : handleAdd}
        addLabel={showModal ? "Voltar" : "Cadastrar funcionário"}
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {showModal ? (
            <ModalEmployeeRegistration
              onClose={() => setShowModal(false)}
              onSave={(data) => console.log("Funcionário cadastrado:", data)}
            />
          ) : (
            <FuncionariosTable />
          )}
        </div>
      </PageLayout>
    </div>
  );
}