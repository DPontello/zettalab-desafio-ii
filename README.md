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

## Documentacao Swagger

Apos iniciar a aplicacao, acesse:

```
http://localhost:3000/api-docs
```

## Banco de dados

- Script SQL: `database_schema.sql`
- Modelo ER: `docs/er-diagram.md`

## Observacoes

- O SQLite gera o arquivo `database.sqlite` na raiz do projeto.
- As tabelas sao criadas automaticamente no primeiro start.
