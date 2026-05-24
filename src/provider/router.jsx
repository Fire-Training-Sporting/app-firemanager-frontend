import { createBrowserRouter } from "react-router-dom";
import { TelaLogin } from "../components/pages/TelaLogin";
import TelaAgendamentos from "../components/pages/TelaAgendamentos";
import TelaAlunos from "../components/pages/TelaAlunos";
import TelaCondominios from "../components/pages/TelaCondominios";
import { TelaDashboard } from "../components/pages/TelaDashboard";
import TelaFuncionarios from "../components/pages/TelaFuncionarios";
import TelaServico from "../components/pages/TelaServico";
import { TelaPagamentos } from "../components/pages/TelaPagamentos";
import Tela404 from "../components/pages/Tela404";
import AuthGuard from "./AuthGuard";

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