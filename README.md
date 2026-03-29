# FireManager Frontend

Front-end da aplicação FireManager, construída com React + Vite.

## 🧩 Estrutura do projeto

- `src/`
  - `main.jsx`: ponto de entrada da aplicação
  - `App.jsx`: componente raiz
  - `components/`: componentes React reutilizáveis
  - `components/pages/`: páginas da aplicação
  - `components/utils/`: utilitários e componentes de suporte (ex: `header, buttons, inputs`)
- `public/`: ativos estáticos (imagens, favicon, etc.)
- `index.html`: template HTML principal
- `package.json`: dependências e scripts
- `vite.config.js`: configuração do Vite

## 🚀 Pré-requisitos

- Node.js 18+ (ou versão compatível com o ecossistema atual)
- npm

## ⚙️ Instalação

1. Clonar repositório

```bash
git clone https://github.com/<seu-usuario>/app-firemanager-frontend.git
cd app-firemanager-frontend
```

2. Instalar dependências

```
npm install
```

## ▶️ Scripts disponíveis

- `npm run dev`: inicia servidor de desenvolvimento (HMR)
- `npm run build`: gera build de produção (`dist/`)
- `npm run preview`: pré-visualiza a build de produção localmente
- `npm run lint`: executa lint (ESLint)

## 🧪 Como executar

```bash
npm run dev
```

Acesse `http://localhost:5173` (ou porta exibida no terminal).

## 🔍 Convenções principais

- Arquivos de componentes em `src/components`
- Páginas em `src/components/pages`
- Estilos global em `src/index.css` e `src/App.css`