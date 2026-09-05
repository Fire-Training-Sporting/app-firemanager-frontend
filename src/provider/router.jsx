import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const TelaLogin = lazy(() => import("../components/pages/TelaLogin").then((module) => ({ default: module.TelaLogin })));
const TelaAgendamentos = lazy(() => import("../components/pages/TelaAgendamentos"));
const TelaAlunos = lazy(() => import("../components/pages/TelaAlunos"));
const TelaCondominios = lazy(() => import("../components/pages/TelaCondominios"));
const TelaDashboard = lazy(() => import("../components/pages/TelaDashboard").then((module) => ({ default: module.TelaDashboard })));
const TelaFuncionarios = lazy(() => import("../components/pages/TelaFuncionarios"));
const TelaServico = lazy(() => import("../components/pages/TelaServico"));
const TelaPagamentos = lazy(() => import("../components/pages/TelaPagamentos").then((module) => ({ default: module.TelaPagamentos })));
const Tela404 = lazy(() => import("../components/pages/Tela404"));
const AuthGuard = lazy(() => import("./AuthGuard"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <TelaLogin />,
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
                path: "*",
                element: <Tela404 />,
            },
        ],
    },
]);