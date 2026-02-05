# Task Manager API - ZettaLab Challenge

API REST para gerenciamento de tarefas (to-do list) com autenticacao JWT e persistencia em banco relacional (SQLite).

## Requisitos

- Node.js 18+
- npm

## Instalacao

1) Instale dependencias:

```bash
npm install
```

2) Crie o arquivo `.env`:

```bash
cp .env.example .env
```

No PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3) Inicie a aplicacao:

```bash
npm run dev
```

O servidor inicia em `http://localhost:3000`.

## Testes

### Testes automatizados (Jest)

```bash
npm test
```

### Testes QA (end-to-end)

```bash
npm run test:qa
```

Este script executa automaticamente todos os fluxos da API.

## Docker (opcional)

```bash
docker-compose up --build
```

A API ficara disponivel em `http://localhost:3000`.

## Variaveis de ambiente

- `PORT`: porta do servidor (default 3000)
- `JWT_SECRET`: segredo do JWT
- `JWT_EXPIRES_IN`: tempo de expiracao do token (default 1d)
- `DB_STORAGE`: caminho do arquivo SQLite (default `./database.sqlite`)

## Endpoints

### Criar usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@email.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","password":"123456"}'
```

### Criar tarefa

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Estudar","description":"Revisar Node.js","status":"PENDING"}'
```

### Listar tarefas

```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Filtrar por status

```bash
curl -X GET "http://localhost:3000/tasks?status=COMPLETED" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Health check

```bash
curl -X GET http://localhost:3000/health
```

### Atualizar tarefa

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"status":"COMPLETED"}'
```

### Excluir tarefa

```bash
curl -X DELETE http://localhost:3000/tasks/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Perfil do usuario

```bash
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Novas Features v2.0.0

### Subtasks (Tarefas aninhadas)

Crie subtasks dentro de uma tarefa principal:

```bash
curl -X POST http://localhost:3000/tasks/1/subtasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Subtarefa 1","position":1}'
```

**Listar subtasks:**

```bash
curl -X GET http://localhost:3000/tasks/1/subtasks \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Marcar subtask como completa:**

```bash
curl -X PATCH http://localhost:3000/subtasks/1/toggle \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Tags (Classificacao com relacionamento N:N)

Crie tags reutilizaveis:

```bash
curl -X POST http://localhost:3000/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name":"Urgente"}'
```

**Associar tag a uma tarefa:**

```bash
curl -X POST http://localhost:3000/tasks/1/tags/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Remover tag de uma tarefa:**

```bash
curl -X DELETE http://localhost:3000/tasks/1/tags/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Debug Tools (Desenvolvimento)

Quando `NODE_ENV=development`, os seguintes endpoints ficam disponiveis:

### Ver todos os dados

```bash
curl -X GET http://localhost:3000/debug/data
```

Retorna: usuarios, tarefas e subtasks.

### Resetar banco de dados

```bash
curl -X POST http://localhost:3000/debug/reset
```

**Resultado:**
- Deleta todas as tabelas
- Recria o schema do zero
- Cria usuario de teste: `admin@local.test` / `123456`

> **Aviso:** Estas rotas NAO estao disponiveis em producao.

## Documentacao Swagger

Apos iniciar a aplicacao, acesse:

```
http://localhost:3000/api-docs
```

## Banco de dados

- Script SQL: `database_schema.sql`
- Modelo ER: `docs/er-diagram.md`
- Visualizacao HTML: `docs/database-schema.html`

**Tabelas:**
- `users` - Usuarios com autenticacao
- `tasks` - Tarefas principais
- `subtasks` - Tarefas aninhadas (1:N com tasks)
- `tags` - Tags reutilizaveis
- `task_tags` - Relacionamento N:N (tasks <-> tags)

## Interface CRUD HTML

Arquivo: `docs/crud.html`

1) Inicie a API (`npm run dev`).
2) Abra o arquivo `docs/crud.html` no navegador.
3) Cadastre um usuario e faca login para gerar o token.
4) Com o token ativo, crie tarefas e subtasks, liste, atualize e exclua.

**Features da UI:**
- Formulario para criar subtasks
- Checkboxes para marcar subtasks como completas
- Painel de depuracao (botoes: Ver usuario, Ver dados, Resetar BD)
- Filtro por status de tarefas

Observacao: as rotas de tarefas exigem token JWT. Sem login, a UI mostra erro 401.

## Observacoes

- O SQLite gera o arquivo `database.sqlite` na raiz do projeto.
- As tabelas sao criadas automaticamente no primeiro start.
- Debug tools sao desabilitadas automaticamente em producao.