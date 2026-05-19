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
      console.log("Condomínios carregados:", response.data);
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
        onAdd={handleAdd}
        addLabel="Cadastrar condomínio"
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <CondominiosTable condominios={condominios} />
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <ModalCondominio onClose={() => setShowModal(false)} />
          </div>
        )}
      </PageLayout>
    </div>
  );
}
