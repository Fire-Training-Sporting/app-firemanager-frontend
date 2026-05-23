import { useEffect, useState } from "react";
import PageLayout from '../utils/PageLayout';
import SearchFilter from '../utils/SearchFilter';
import { CondominiosTable } from '../utils/Condominios/CondominiosTable';
import ModalCondominio from '../utils/Condominios/ModalCondominios';
import api from "../../provider/api";

const search_columns = [
  { label: "ID", value: "id" },
  { label: "Nome", value: "nome" },
  { label: "CEP", value: "cep" },
  { label: "Rua", value: "rua" },
  { label: "Número", value: "numero" },
  { label: "Cidade", value: "cidade" },
  { label: "Bairro", value: "bairro" },
];

export default function TelaCondominios() {
  const [showModal, setShowModal] = useState(false);
  const [condominios, setCondominios] = useState([]);
  const [condominiosOriginais, setCondominiosOriginais] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/condominios");
      setCondominios(response.data);
      setCondominiosOriginais(response.data);
      console.log("Condomínios carregados:", response.data);
    } catch (error) {
      console.error("Erro ao buscar condomínios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarCondominios = async ({ field, value }) => {
    try {
      setIsLoading(true);

      if (!value.trim()) {
        setCondominios(condominiosOriginais);
        return;
      }

      const filtrados = condominiosOriginais.filter((condominio) => {
        const fieldValue = condominio[field];
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

      setCondominios(filtrados);
    } catch (error) {
      console.error("Erro ao filtrar condomínios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => setShowModal(true);

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Condomínios"
        searchPlaceholder="Pesquisar condomínio..."
        onAdd={handleAdd}
        addLabel="Cadastrar condomínio"
        customControls={
          <SearchFilter
            columns={search_columns}
            onSearch={filtrarCondominios}
            isLoading={isLoading}
          />
        }
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <CondominiosTable condominios={condominios} />
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <ModalCondominio onClose={() => setShowModal(false)} onCreated={buscarDados} />
          </div>
        )}
      </PageLayout>
    </div>
  );
}
