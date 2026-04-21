export default function ServicoLista() {
  const servicos = [
    { id: 1, nome: "Tênis" },
    { id: 2, nome: "Beach Tennis" },
    { id: 3, nome: "Personal Trainer" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-3 bg-gray-100 text-gray-700 font-semibold text-center">
        <div className="py-2">Serviço</div>
        <div className="py-2">Ação</div>
        <div className="py-2">Descontinuar</div>
      </div>

      <div>
        {servicos.map((servico) => (
          <div
            key={servico.id}
            className="grid grid-cols-3 text-center items-center"
          >
            <div className="py-3 font-medium text-gray-800">
              {servico.nome}
            </div>

            <div className="py-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md transition">
                Editar
              </button>
            </div>

            <div className="py-2">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}