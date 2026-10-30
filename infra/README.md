# Infraestrutura do Frontend

Esta pasta contém os arquivos de configuração para deploy do frontend em containers Docker.

## Arquivos

- **Dockerfile**: Configuração de build do container Docker (multi-stage build com Node.js e Nginx)
- **nginx.conf**: Configuração do Nginx para servir a aplicação React como SPA

## Como funciona

### Dockerfile
1. **Stage 1 (Build)**: Usa Node.js para instalar dependências e buildar o React com Vite
2. **Stage 2 (Serve)**: Usa Nginx Alpine para servir os arquivos estáticos otimizados

### nginx.conf
- Configura o Nginx para SPA (Single Page Application)
- Redireciona todas as rotas para `index.html` (suporte ao React Router)
- Serve arquivos estáticos eficientemente

## Variáveis de ambiente

O Dockerfile aceita o argumento `VITE_API_URL` durante o build:

```bash
docker build --build-arg VITE_API_URL=http://backend:8080 -t firemanager-frontend .
```

No docker-compose do repositório `infra-firemanager`, essa variável é passada automaticamente.

## Build local

Para testar o build localmente:

```bash
# Da raiz do projeto
docker build -f infra/Dockerfile -t firemanager-frontend .

# Rodar o container
docker run -p 3000:80 firemanager-frontend
```

## Deploy

O build é orquestrado pelo docker-compose no repositório `infra-firemanager`.

Veja: `../infra-firemanager/docker-compose.yml`
