# Task Manager API - ZettaLab Challenge

API REST para gerenciamento de tarefas (to-do list) com autenticacao JWT e persistencia em banco relacional (SQLite).

## 🚀 Quick Start (para iniciantes)

**Quer testar rapidamente sem usar terminal?**

1. Clone o projeto e rode `npm install`
2. Rode `npm run dev`
3. Abra o arquivo `docs/crud.html` no seu navegador
4. Clique em "Cadastrar" para criar um usuario
5. Clique em "Login" para autenticar
6. Agora pode criar tarefas e subtasks!

**Observacao:** O arquivo HTML é uma interface visual que faz as requisicoes para a API automaticamente.

---

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

O arquivo `.env` deve conter:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=1d
DB_STORAGE=./database.sqlite
```

**Explicacao:**
- `PORT`: porta onde o servidor vai rodar (default 3000)
- `JWT_SECRET`: chave secreta para gerar tokens JWT (use uma string aleatoria longa)
- `JWT_EXPIRES_IN`: tempo de expiracao do token (1d = 1 dia)
- `DB_STORAGE`: caminho do arquivo do banco SQLite (gerado automaticamente)

## 📖 Como usar a API (fluxo completo)

**Passo a passo para fazer sua primeira requisicao:**

1. **Registre um usuario** (POST /users)
2. **Faca login** (POST /sessions) → Guarde o `token` retornado
3. **Use o token** nas proximas requisicoes no header `Authorization: Bearer SEU_TOKEN`
4. **Crie tarefas, subtasks, etc.**

**Dica:** Se preferir interface visual, use o arquivo `docs/crud.html` (mais facil!).

---

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

## Interface CRUD HTML (recomendado para iniciantes)

**Por que usar o HTML em vez de curl?**
- ✅ Mais facil: clique em botoes em vez de digitar comandos
- ✅ Visual: veja todas as tarefas e subtasks na tela
- ✅ Token gerenciado automaticamente
- ✅ Erros mostrados de forma clara

**Como usar:**

Arquivo: `docs/crud.html`

1. Inicie a API (`npm run dev`)
2. Abra `docs/crud.html` no navegador (Chrome, Firefox, Edge)
3. Preencha nome, email e senha → Clique em **Cadastrar**
4. Use o mesmo email e senha → Clique em **Login**
5. Agora o token esta ativo! Crie tarefas, subtasks, etc.

**Features da UI:**
- 🎯 Formulario para criar tarefas
- ✅ Checkboxes para marcar subtasks como completas
- 🔧 Painel de depuracao (Ver usuario logado, Ver todos os dados, Resetar BD)
- 🔍 Filtro por status (PENDING/COMPLETED)
- 📋 Lista visual de todas as tarefas com suas subtasks

**Troubleshooting HTML:**
- Se aparecer "401 Unauthorized": Faca login novamente
- Se aparecer "ECONNREFUSED": A API nao esta rodando (rode `npm run dev`)
- Se a porta estiver ocupada: Mude para 3001 no campo "API Base URL"

## 🔧 Troubleshooting

### Porta 3000 ja esta em uso

**Solucao 1:** Mate o processo que esta usando a porta:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero_do_pid> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Solucao 2:** Use outra porta no `.env`:
```env
PORT=3001
```

### Token invalido ou expirado

- Faca login novamente para gerar um novo token
- Tokens expiram em 1 dia (configuravel em `JWT_EXPIRES_IN`)

### Erro "User already exists"

- Esse email ja foi cadastrado
- Use outro email OU use o debug endpoint `POST /debug/reset` para limpar o banco

### Banco de dados corrompido

1. Delete o arquivo `database.sqlite`
2. Reinicie a API (`npm run dev`)
3. As tabelas serao recriadas automaticamente

**OU** use o endpoint de debug:
```bash
curl -X POST http://localhost:3000/debug/reset
```

### Testes falhando

```bash
# Rode com logs detalhados
npm test -- --verbose
```

---

## Observacoes

- O SQLite gera o arquivo `database.sqlite` na raiz do projeto.
- As tabelas sao criadas automaticamente no primeiro start.
- Debug tools sao desabilitadas automaticamente em producao.
- O arquivo `database.sqlite` **nao** deve ser commitado (ja esta no `.gitignore`).