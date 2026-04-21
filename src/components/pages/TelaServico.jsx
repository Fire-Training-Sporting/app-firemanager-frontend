import { useState } from "react";
import PageLayout from "../utils/PageLayout";
import ServicoLista from "../utils/Servicos/ServicoLista";
import ServicoModal from "../utils/Servicos/ServicoModal";

export default function TelaServicos() {
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {};
  const handleAdd = () => setShowModal(true);

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Serviços"
        searchPlaceholder="Pesquisar serviço..."
        onSearch={showModal ? () => {} : handleSearch} // desativa pesquisa quando modal aberto
        onAdd={showModal ? () => setShowModal(false) : handleAdd}
        addLabel={showModal ? "Voltar" : "Cadastrar serviço"}
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {showModal ? (
            <ServicoModal
              onClose={() => setShowModal(false)}
              onSave={(data) => console.log("Serviço cadastrado:", data)}
            />
          ) : (
            <ServicoLista />
          )}
        </div>
      </PageLayout>
    </div>
  );
}