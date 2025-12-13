# Frontend Template - Next.js

Template para aplicações frontend modernas com:

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- **Infraestrutura**: Docker Compose para desenvolvimento e produção

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose instalados
- Git

### Configuração

1. Clone o repositório:
```bash
git clone <repository-url>
cd fullstack-template
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie os serviços:
```bash
docker compose up -d
```

4. Acesse a aplicação:
- Frontend: http://localhost:10000

## 📁 Estrutura do Projeto

```
.
├── frontend/          # Aplicação Next.js
├── compose.yaml       # Docker Compose
└── .env.example       # Exemplo de variáveis de ambiente
```

## 🛠️ Desenvolvimento

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📦 Produção

### Build da Imagem

```bash
# Frontend
docker build -f frontend/Dockerfile \
  --target runner \
  -t frontend:latest \
  ./frontend
```

## 📚 Documentação

Para mais detalhes, consulte o arquivo `TEMPLATE_PROMPT.md` que contém a documentação completa do template.

## 📝 Licença

Este é um template de código aberto. Sinta-se livre para usar e modificar conforme necessário.

