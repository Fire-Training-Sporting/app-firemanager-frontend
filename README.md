# FireManager Frontend

Aplicação frontend do FireManager.

## Visão geral

Este projeto concentra as telas de autenticação, dashboard e módulos operacionais como:

- Agendamentos
- Alunos
- Condomínios
- Funcionários
- Serviços

Atualmente o frontend roda de forma independente e consome a API própria.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Chart.js + react-chartjs-2
- ESLint 9

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

Para checar versões instaladas:

    node -v
    npm -v

## Instalação

1. Entre na pasta do projeto.

2. Instale as dependências:

    npm install

## Executando em desenvolvimento

Inicie o servidor local:

    npm run dev

Depois acesse o endereço exibido no terminal (normalmente http://localhost:5173).

## Scripts disponíveis

- npm run dev
  Inicia ambiente de desenvolvimento com hot reload.

- npm run build
  Gera build de produção na pasta dist.

- npm run preview
  Sobe localmente a build de produção para validação.

- npm run lint
  Executa análise estática com ESLint.

## Integração com API

O login usa a base URL definida em src/components/pages/TelaLogin.jsx:

    const API_URL = "http://localhost:8080";

Se a API estiver em outra porta ou host, ajuste esse valor.

## Estrutura de pastas

    src/
      main.jsx                # entrada da aplicação
      App.jsx                 # componente raiz
      assets/                 # imagens e arquivos estáticos importados
      components/
        pages/                # telas principais da aplicação
        utils/                # componentes reutilizáveis e utilitários
          Agendamentos/
          Alunos/
          Buttons/
          Condominios/
          Dashboard/
          Funcionarios/
          Servicos/