import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "./AuthGuard";

const TelaLogin = lazy(() => import("../components/pages/TelaLogin").then((module) => ({ default: module.TelaLogin })));
const TelaAgendamentos = lazy(() => import("../components/pages/TelaAgendamentos"));
const TelaAlunos = lazy(() => import("../components/pages/TelaAlunos"));
const TelaCondominios = lazy(() => import("../components/pages/TelaCondominios"));
const TelaDashboard = lazy(() => import("../components/pages/TelaDashboard").then((module) => ({ default: module.TelaDashboard })));
const TelaFuncionarios = lazy(() => import("../components/pages/TelaFuncionarios"));
const TelaPerfil = lazy(() => import("../components/pages/TelaPerfil"));
const TelaServico = lazy(() => import("../components/pages/TelaServico"));
const TelaPagamentos = lazy(() => import("../components/pages/TelaPagamentos").then((module) => ({ default: module.TelaPagamentos })));
const Tela404 = lazy(() => import("../components/pages/Tela404"));
const TelaAcessoNegado = lazy(() => import("../components/pages/TelaAcessoNegado"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <TelaLogin />,
    },
    {
        path: "/recuperar-senha",
        HydrateFallback: () => (
            <main className="flex min-h-screen items-center justify-center bg-[#ec7200] font-[Montserrat,sans-serif] text-white" role="status" aria-live="polite">
                Carregando...
            </main>
        ),
        lazy: async () => ({
            Component: (await import("../components/pages/TelaRecuperarSenha")).default,
        }),
    },
    {
        path: "/reset-password",
        HydrateFallback: () => (
            <main className="flex min-h-screen items-center justify-center bg-[#ec7200] font-[Montserrat,sans-serif] text-white" role="status" aria-live="polite">
                Carregando...
            </main>
        ),
        lazy: async () => ({
            Component: (await import("../components/pages/TelaRedefinirSenha")).default,
        }),
    },
    {
        element: <AuthGuard />,
        children: [
            {
                path: "/dashboard",
                element: <TelaDashboard />,
            },
            {
                path: "/agendamentos",
                element: <TelaAgendamentos />,
            },
            {
                path: "/alunos",
                element: <TelaAlunos />,
            },
            {
                path: "/perfil",
                element: <TelaPerfil />,
            },
            {
                path: "/condominios",
                element: <TelaCondominios />,
            },
            {
                path: "/funcionarios",
                element: <TelaFuncionarios />,
            },
            {
                path: "/servicos",
                element: <TelaServico />,
            },
            {
                path: "/pagamento",
                element: <TelaPagamentos />,
            },
            {
                path: "/acesso-nao-autorizado",
                element: <TelaAcessoNegado />,
            },
            {
                path: "*",
                element: <Tela404 />,
            },
        ],
    },
]);