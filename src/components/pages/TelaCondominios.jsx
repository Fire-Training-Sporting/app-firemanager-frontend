import { useEffect, useState } from "react";
import PageLayout from "../utils/PageLayout";
import SearchFilter from "../utils/SearchFilter";
import { CondominiosTable } from "../utils/Condominios/CondominiosTable";
import ModalCondominio from "../utils/Condominios/ModalCondominios";
import ConfirmationModal from "../utils/ConfirmationModal";
import AlertMessage from "../utils/AlertMessage";
import api from "../../provider/api";

const search_columns = [
  { label: "ID", value: "id" },
  { label: "Nome", value: "nome" },
  { label: "CEP", value: "cep" },
  { label: "Logradouro", value: "logradouro" },
  { label: "Número", value: "numero" },
  { label: "Cidade", value: "cidade" },
  { label: "Bairro", value: "bairro" },
];

const normalizarCampoBusca = (valor) => {
  if (valor == null) return "";

  if (typeof valor === "object") {
    return valor.nome ?? "";
  }

  return String(valor);
};

const obterValorBusca = (condominio, field) => {
  if (field === "logradouro") {
    return normalizarCampoBusca(condominio.logradouro ?? condominio.rua ?? "");
  }

  return normalizarCampoBusca(condominio[field]);
};

export default function TelaCondominios() {

  const [showModal, setShowModal] = useState(false);

  const [condominios, setCondominios] = useState([]);

  const [condominiosOriginais, setCondominiosOriginais] =
    useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedCondominio, setSelectedCondominio] =
    useState(null);

  const [condominioParaExcluir, setCondominioParaExcluir] =
    useState(null);

  const [sucessoCondominio, setSucessoCondominio] = useState("");

  const [sucessoVisivel, setSucessoVisivel] = useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {

    try {

      setIsLoading(true);

      const response =
        await api.get("/condominios");

      setCondominios(response.data || []);

      setCondominiosOriginais(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Erro ao buscar condomínios:",
        error
      );

    } finally {

      setIsLoading(false);

    }
  };

  const filtrarCondominios = ({
    field,
    value,
  }) => {

    try {

      setIsLoading(true);

      const termoBusca = value.trim().toLowerCase();

      if (!termoBusca) {

        setCondominios(condominiosOriginais);
        return;
      }

      const filtrados = condominiosOriginais.filter((condominio) => {
        const campoBusca = obterValorBusca(condominio, field).toLowerCase();
        return campoBusca.includes(termoBusca);
      });

      setCondominios(filtrados);

    } catch (error) {

      console.error(
        "Erro ao filtrar condomínios:",
        error
      );

    } finally {

      setIsLoading(false);

    }
  };

  const handleAdd = () => {

    setSelectedCondominio(null);

    setShowModal(true);

  };

  const handleEdit = (condominio) => {

    setSelectedCondominio(condominio);

    setShowModal(true);

  };

  const handleCloseModal = () => {

    setShowModal(false);

    setSelectedCondominio(null);


  const exibirSucesso = (mensagem) => {
    setSucessoCondominio(mensagem);
    setSucessoVisivel(true);

    window.clearTimeout(exibirSucesso.timeoutId);
    exibirSucesso.timeoutId = window.setTimeout(() => {
      setSucessoCondominio("");
      setSucessoVisivel(false);
    }, 7000);
  };

  const handleCondominioSalvo = (acao = "created") => {
    exibirSucesso(
      acao === "updated"
        ? "Condomínio atualizado com sucesso"
        : "Condomínio cadastrado com sucesso"
    );
    buscarDados();
  };
  };

  const solicitarExclusao = (condominio) => {

    setCondominioParaExcluir(condominio);

  };

  const cancelarExclusao = () => {

    setCondominioParaExcluir(null);

  };

  const confirmarExclusao = async () => {

    if (!condominioParaExcluir?.id) {
      return;
    }

    try {

      await api.delete(
        `/condominios/${condominioParaExcluir.id}`
      );

      setCondominioParaExcluir(null);

      await buscarDados();

    } catch (error) {

      console.error(
        "Erro ao excluir condomínio:",
        error
      );

      window.alert(
        "Não foi possível excluir o condomínio. Tente novamente."
      );
    }
  };

  const formatarValor = (valor) => {

    if (
      valor &&
      typeof valor === "object"
    ) {

      return valor.nome ?? "-";
    }

    return valor ?? "-";
  };

  return (

    <div
      className={
        showModal
          ? "modal-open"
          : ""
      }
    >

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

        <AlertMessage
          variant="success"
          message={sucessoVisivel ? sucessoCondominio : ""}
        />

        <div className="bg-white rounded-lg shadow-md border overflow-hidden">

          <CondominiosTable
            condominios={condominios}
            onEdit={handleEdit}
            onDelete={solicitarExclusao}
          />

        </div>

      </PageLayout>

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

          <ModalCondominio
            onClose={handleCloseModal}
            onCreated={handleCondominioSalvo}
            condominio={selectedCondominio}
          />

        </div>

      )}

      <ConfirmationModal
        isOpen={!!condominioParaExcluir}
        title="Confirmar exclusão"
        message="Deseja realmente excluir este condomínio?"
        items={
          condominioParaExcluir
            ? [
                {
                  label: "ID",
                  value: condominioParaExcluir.id,
                },
                {
                  label: "Nome",
                  value: formatarValor(
                    condominioParaExcluir.nome
                  ),
                },
                {
                  label: "CEP",
                  value: formatarValor(
                    condominioParaExcluir.cep
                  ),
                },
                {
                  label: "Logradouro",
                  value: formatarValor(
                    condominioParaExcluir.logradouro ?? condominioParaExcluir.rua
                  ),
                },
                {
                  label: "Número",
                  value: formatarValor(
                    condominioParaExcluir.numero
                  ),
                },
                {
                  label: "Cidade",
                  value: formatarValor(
                    condominioParaExcluir.cidade
                  ),
                },
                {
                  label: "Bairro",
                  value: formatarValor(
                    condominioParaExcluir.bairro
                  ),
                },
              ]
            : []
        }
        confirmLabel="Sim, excluir"
        cancelLabel="Não, cancelar"
        onCancel={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />

    </div>
  );
}