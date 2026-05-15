import { useNavigate } from "react-router-dom";

function Tela404() {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(sessionStorage.getItem("token"));

    const handleGoBack = () => {
        navigate(isLoggedIn ? "/dashboard" : "/");
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5 py-10 font-[Montserrat,sans-serif] text-[#1f1f1f]">
            <section className="w-full max-w-lg rounded-2xl bg-white px-7 py-9 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-8 md:px-10 md:py-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ec7200]">
                    Erro 404
                </p>

                <h2 className="mt-4 text-3xl font-extrabold text-[#242525] md:text-4xl">
                    Página não encontrada
                </h2>

                <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-[#5f5f5f]">
                    O endereço acessado não existe ou foi alterado.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="inline-flex items-center justify-center rounded-xl bg-[#ec7200] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d96600]"
                    >
                        Voltar para o início
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center rounded-xl border border-[#d9d9d9] bg-white px-6 py-3 text-sm font-semibold text-[#242525] transition hover:bg-[#f7f7f7]"
                    >
                        Voltar página anterior
                    </button>
                </div>

                <div className="mt-8 rounded-xl bg-[#fafafa] p-4 text-sm text-[#5f5f5f]">
                    Confira o link ou tente acessar uma página válida do sistema.
                </div>
            </section>
        </main>
    );
}

export default Tela404;