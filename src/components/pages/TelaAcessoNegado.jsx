import { useNavigate } from "react-router-dom";

const getHomeRoute = () => {
    const cargo = String(sessionStorage.getItem("cargo") ?? "").trim().toLowerCase();

    switch (cargo) {
        case "root":
            return "/dashboard";
        case "administracao":
        case "professor":
        case "aluno":
            return "/agendamentos";
        default:
            return "/";
    }
};

export default function TelaAcessoNegado() {
    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate(getHomeRoute(), { replace: true });
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5 py-10 font-[Montserrat,sans-serif] text-[#1f1f1f]">
            <section className="w-full max-w-lg rounded-2xl bg-white px-7 py-9 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-8 md:px-10 md:py-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ec7200]">
                    Acesso negado
                </p>

                <h2 className="mt-4 text-3xl font-extrabold text-[#242525] md:text-4xl">
                    Você não tem permissão para acessar esta página
                </h2>

                <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-[#5f5f5f]">
                    Seu perfil atual não permite visualizar este recurso. Solicite acesso ao administrador ou retorne à página inicial.
                </p>

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={handleVoltar}
                        className="inline-flex items-center justify-center rounded-xl bg-[#ec7200] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d96600]"
                    >
                        Voltar para o início
                    </button>
                </div>
            </section>
        </main>
    );
}
