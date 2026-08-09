import { useEffect, useState } from "react";
import PageLayout from "../utils/PageLayout";
import ServicoLista from "../utils/Servicos/ServicoLista";
import AlertMessage from "../utils/AlertMessage";
import api from "../../provider/api";

export default function TelaServicos() {
  const [servicos, setServicos] = useState([]);
  const [servicosOriginais, setServicosOriginais] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sucessoServico, setSucessoServico] = useState("");
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const cargo = sessionStorage.getItem("cargo");
  const canToggleStatus = cargo === "root";

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

  const exibirSucesso = (mensagem) => {
    setSucessoServico(mensagem);
    setSucessoVisivel(true);

    window.clearTimeout(exibirSucesso.timeoutId);
    exibirSucesso.timeoutId = window.setTimeout(() => {
      setSucessoServico("");
      setSucessoVisivel(false);
    }, 7000);
  };

  const toggleStatus = async (servico) => {
    if (!canToggleStatus) {
      return;
    }

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
      exibirSucesso("Status do serviço atualizado com sucesso");

    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  return (
    <PageLayout
      title="Serviços"
      innerClassName="w-full max-w-[760px] mx-auto"
      controlsClassName="justify-between"
      contentClassName="w-full"
      showSearch={false}
      showAddButton={false}
    >
      <AlertMessage
        variant="success"
        message={sucessoVisivel ? sucessoServico : ""}
        className="fixed right-4 top-30 z-60 w-[min(420px,calc(100vw-2rem))] shadow-lg"
      />

      <div className="bg-white rounded-lg shadow-md border overflow-hidden w-full">
        <ServicoLista
          servicos={servicos}
          onToggleStatus={toggleStatus}
          canToggleStatus={canToggleStatus}
        />
      </div>
    </PageLayout>
  );
}