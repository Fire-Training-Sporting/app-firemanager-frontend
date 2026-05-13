import { useEffect, useState } from "react";
import PageLayout from "../utils/PageLayout";
import ServicoLista from "../utils/Servicos/ServicoLista";
import ServicoModal from "../utils/Servicos/ServicoModal";
import api from "../../provider/api";

export default function TelaServicos() {
  const [showModal, setShowModal] = useState(false);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const response = await api.get("/servicos");
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const adicionarDados = () => setShowModal(true);

  const editarDados = () => setShowModal(true);

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Serviços"
        searchPlaceholder="Pesquisar serviço..."
        onSearch={showModal ? () => {} : buscarDados}
        onAdd={showModal ? () => setShowModal(false) : adicionarDados}
        addLabel={showModal ? "Voltar" : "Cadastrar serviço"}
        innerClassName="w-full max-w-[760px] mx-auto"
        controlsClassName="justify-between"
        contentClassName="w-full"
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden w-full">
          {showModal ? (
            <ServicoModal
              onClose={() => setShowModal(false)}
              onSave={(data) => console.log("Serviço cadastrado:", data)}
            />
          ) : (
            <ServicoLista servicos={servicos} />
          )}
        </div>
      </PageLayout>
    </div>
  );
}