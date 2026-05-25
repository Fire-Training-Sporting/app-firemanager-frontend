import { useEffect, useState } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import ServicoLista from "../utils/Servicos/ServicoLista";
import ServicoModal from "../utils/Servicos/ServicoModal";
import api from "../../provider/api";

const search_columns = [
  { label: "ID", value: "id" },
  { label: "Serviço", value: "nome" },
];

export default function TelaServicos() {
  const [showModal, setShowModal] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [servicosOriginais, setServicosOriginais] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/servicos");
      setServicos(response.data);
      setServicosOriginais(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarDados = () => setShowModal(true);

  const editarDados = () => setShowModal(true);

  const filtrarServicos = async ({ field, value }) => {
    try {
      setIsLoading(true);

      if (!value.trim()) {
        setServicos(servicosOriginais);
        return;
      }

      const filtrados = servicosOriginais.filter((servico) => {
        const fieldValue = servico[field];
        const compareValue = value.toLowerCase();

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

      setServicos(filtrados);
    } catch (error) {
      console.error("Erro ao filtrar serviços:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Serviços"
        searchPlaceholder="Pesquisar serviço..."
        onAdd={adicionarDados}
        addLabel="Cadastrar serviço"
        innerClassName="w-full max-w-[760px] mx-auto"
        controlsClassName="justify-between"
        contentClassName="w-full"
        customControls={
          <SearchFilter
            columns={search_columns}
            onSearch={filtrarServicos}
            isLoading={isLoading}
          />
        }
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden w-full">
          <ServicoLista servicos={servicos} />
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <ServicoModal
              onClose={() => setShowModal(false)}
              onSave={(data) => {
                console.log("Serviço cadastrado:", data);
                setShowModal(false);
                buscarDados();
              }}
            />
          </div>
        )}
      </PageLayout>
    </div>
  );
}