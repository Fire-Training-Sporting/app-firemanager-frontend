import { useState } from "react";
import PageLayout from '../utils/PageLayout';
import { CondominiosTable } from '../utils/Condominios/CondominiosTable';
import ModalCondominio from '../utils/Condominios/ModalCondominios';

export default function TelaCondominios() {
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {};
  const handleAdd = () => setShowModal(true);

  return (
    <PageLayout
      title="Condomínios"
      searchPlaceholder="Pesquisar condomínio..."
      onSearch={handleSearch}
      onAdd={showModal ? () => setShowModal(false) : handleAdd}
      addLabel={showModal ? "Voltar" : "Cadastrar condomínio"}
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        {showModal ? (
          <ModalCondominio isOpen={showModal} onClose={() => setShowModal(false)} />
        ) : (
          <CondominiosTable />
        )}
      </div>
    </PageLayout>
  );
}