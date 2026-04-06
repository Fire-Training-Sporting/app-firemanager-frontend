export default function ServicoModal() {

    return (
        <div className="flex justify-center items-center mt-20">
            <main className="bg-stone-600 w-120 h-50 rounded-2xl px-8 py-6">
                <section>
                    <h1 className="text-white font-bold text-4xl">Cadastrar Serviço</h1>
                </section>

                <section className="text-white mt-4">
                    <p className="font-bold text-xl mb-1">Nome</p>
                    <input type="text" className="bg-white text-black rounded font-bold px-2 py-0.5 w-full" />
                </section>

                <section className="mt-4">
                    <button className="bg-green-500 hover:bg-green-600 transition w-full rounded py-0.5 font-bold text-white ">
                        Cadastrar Serviço
                    </button>
                </section>
            </main>
        </div>
    )
}