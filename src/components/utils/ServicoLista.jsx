export default function ServicoLista() {

    const servicos = [
        { id: 1, nome: "Tênis" },
        { id: 2, nome: "Beach Tennis" },
        { id: 3, nome: "Personal Trainer" },
    ];

    return (
        <div className="mx-24">
            <h1 className="font-extrabold text-3xl pl-4 mt-8 mb-5">
                Serviços
            </h1>

            <main className="p-3 m-3 flex-col bg-stone-600 rounded-2xl">
                <section className="flex justify-between pt-1.5 px-3">
                    <div className="flex gap-2">
                        <p className="text-white font-bold text-2xl">Filtrar:</p>
                        <div className="bg-white rounded-xl py-1 px-4">
                            <p className="font-bold text-lg">Todos</p>
                        </div>
                    </div>

                    <div>
                        <button className="bg-blue-500 hover:bg-blue-600 transition text-blue-100 font-bold rounded py-1.5 px-5 text-xl">
                            + Cadastrar Serviço
                        </button>
                    </div>
                </section>

                <section className="flex justify-around mt-4 gap-4 px-2">
                    <div className="bg-stone-800 py-2 flex-1 justify-center flex text-white font-bold text-xl rounded">Serviço</div>
                    <div className="bg-stone-800 py-2 flex-1 justify-center flex text-white font-bold text-xl rounded">Ação</div>
                    <div className="bg-stone-800 py-2 flex-1 justify-center flex text-white font-bold text-xl rounded">Descontinuar</div>
                </section>

                <section className="flex flex-col justify-around mt-3">
                    {servicos.map((servico) => (
                        <div key={servico.id} className="flex justify-around gap-4 m-2">

                            <div className="bg-orange-400 flex-1 h-10 flex justify-center items-center text-white font-bold text-xl rounded">
                                {servico.nome}
                            </div>

                            <div className="bg-orange-400 flex-1 flex justify-center items-center text-white font-bold text-xl rounded">
                                <button className="bg-green-500 hover:bg-green-600 transition w-full h-full rounded">
                                    Editar
                                </button>
                            </div>

                            <div className="bg-orange-400 flex-1 flex justify-center items-center text-white font-bold text-xl rounded">
                                <button className="bg-red-500 hover:bg-red-600 transition w-full h-full rounded">
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}