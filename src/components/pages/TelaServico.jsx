import { useEffect, useState } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import ServicoLista from "../utils/Servicos/ServicoLista";
import api from "../../provider/api";

const search_columns = [
  { label: "ID", value: "id" },
  { label: "Serviço", value: "nome" },
];

export default function TelaServicos() {
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

  const toggleStatus = async (servico) => {
    try {
      const novoStatus = !servico.ativo;

      await api.patch(`/servicos/${servico.id}`, {
        nome: servico.nome,
        ativo: novoStatus ? 1 : 0,
      });

      const listaAtualizada = servicos.map((item) =>
        item.id === servico.id
          ? { ...item, ativo: novoStatus }
          : item
      );

      setServicos(listaAtualizada);
      setServicosOriginais(listaAtualizada);

    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

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

        if (
          typeof fieldValue === "object" &&
          fieldValue !== null
        ) {
          fieldString = fieldValue.nome
            ? fieldValue.nome.toLowerCase()
            : "";

        } else if (typeof fieldValue === "string") {
          fieldString = fieldValue.toLowerCase();

        } else if (typeof fieldValue === "number") {
          fieldString = fieldValue
            .toString()
            .toLowerCase();

        } else if (fieldValue instanceof Date) {
          fieldString = fieldValue
            .toLocaleDateString("pt-BR")
            .toLowerCase();
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
    <PageLayout
      title="Serviços"
      innerClassName="w-full max-w-[760px] mx-auto"
      controlsClassName="justify-between"
      contentClassName="w-full"
      
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden w-full">
        <ServicoLista
          servicos={servicos}
          onToggleStatus={toggleStatus}
        />
      </div>
    </PageLayout>
  );
}