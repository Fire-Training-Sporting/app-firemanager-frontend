import { useEffect, useState } from "react";
import PageLayout from '../utils/PageLayout';
import { CondominiosTable } from '../utils/Condominios/CondominiosTable';
import ModalCondominio from '../utils/Condominios/ModalCondominios';
import api from "../../provider/api";

export default function TelaCondominios() {
  const [showModal, setShowModal] = useState(false);
  const [condominios, setCondominios] = useState([]);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const response = await api.get("/condominios");
      setCondominios(response.data);
    } catch (error) {
      console.error("Erro ao buscar condomínios:", error);
    }
  };

  const handleSearch = () => {};
  const handleAdd = () => setShowModal(true);

  return (
    <div className={showModal ? "modal-open" : ""}>
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
            <CondominiosTable condominios={condominios} />
          )}
        </div>
      </PageLayout>
    </div>
  );
}