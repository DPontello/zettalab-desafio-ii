# Task Manager API - ZettaLab Desafio II

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-blue)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightblue)](https://www.sqlite.org/)
[![Jest](https://img.shields.io/badge/Tests-5%2F5%20passing-brightgreen)](https://jestjs.io/)

> **Documentação Swagger:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

API REST para gerenciamento de tarefas com autenticação JWT, subtarefas aninhadas e sistema de tags.

## O que foi implementado

- Autenticação JWT com bcryptjs
- CRUD completo de tarefas com filtros por status
- Subtarefas (1:N) com checkbox de conclusão
- Tags reutilizáveis (N:N via junction table)
- Interface HTML para testes visuais
- Ferramentas de debug para desenvolvimento
- 5 testes de integração (Jest + Supertest)
- Documentação Swagger completa

---

## Instalação Rápida

```bash
# Clone e instale
git clone https://github.com/DPontello/zettalab-desafio-ii.git
cd zettalab-desafio-ii
npm install

# Configure o .env
PORT=3000
JWT_SECRET=sua_chave_aqui
JWT_EXPIRES_IN=1d
DB_STORAGE=./database.sqlite

# Execute
npm run dev

```

**Acesse:** http://localhost:3000

---

## Inicialização

1. Crie o arquivo `.env` (exemplo acima na instalação).
2. Inicie a API:
  - Desenvolvimento: `npm run dev`
  - Produção: `npm start`
3. Verifique se está no ar:
  - Health check: http://localhost:3000/health
  - Swagger: http://localhost:3000/api-docs

**Observação:** o arquivo `database.sqlite` é criado automaticamente na primeira execução.

---

## Documentação da API

- **Swagger UI:** http://localhost:3000/api-docs
- **Exemplos cURL:** seção [Exemplos curl](README.md#exemplos-curl)
- **Postman (manual):** crie uma coleção, defina `{{baseUrl}} = http://localhost:3000` e adicione o header `Authorization: Bearer SEU_TOKEN` nas rotas protegidas.

---

## Teste sem terminal

1. Execute `npm run dev`
2. Abra `docs/crud.html` no navegador
3. Cadastre e faça login
4. Crie tarefas e subtarefas usando a interface

---

## Estrutura Simplificada

```
src/
├── controllers/     # Lógica de requisições HTTP
├── models/          # Definição das tabelas (Sequelize)
├── services/        # Regras de negócio
├── validators/      # Schemas Yup
└── routes.js        # Definição de rotas + Swagger

tests/
└── integration/     # 5 testes completos
    └── api.test.js

docs/
└── crud.html        # Interface visual para testes
```

---

## Stack

**Backend:** Node.js 18+, Express 4.21, Sequelize 6.37  
**Banco:** SQLite 3  
**Auth:** JWT + bcryptjs  
**Testes:** Jest 29 + Supertest  
**Docs:** Swagger UI  

---

## Endpoints Principais

```bash
POST /users          # Criar conta
POST /sessions       # Login (retorna token)
GET  /health         # Health check
```

### Autenticadas (requer `Authorization: Bearer TOKEN`)
```bash
GET    /me                         # Perfil do usuário
GET    /tasks                      # Listar tarefas
POST   /tasks                      # Criar tarefa
PUT    /tasks/:id                  # Atualizar
DELETE /tasks/:id                  # Deletar

POST   /tasks/:id/subtasks         # Criar subtask
PATCH  /subtasks/:id/toggle        # Marcar completa/incompleta
DELETE /subtasks/:id               # Deletar subtask

GET    /tags                       # Listar tags
POST   /tags                       # Criar tag
POST   /tasks/:id/tags/:tagId      # Associar tag
DELETE /tasks/:id/tags/:tagId      # Remover tag
```

### Debug (apenas development)
```bash
GET  /debug/data     # Ver todos os dados
POST /debug/reset    # Resetar banco + criar admin@local.test/123456
```

---

## Banco de Dados

**5 tabelas com relacionamentos:**

```
users (1) ────< tasks (N)
                  │
                  ├──< subtasks (N)   [1:N]
                  │
                  └──> task_tags <──> tags (N)   [N:N]
```

- **users**: id, name, email, password (hash), timestamps
- **tasks**: id, user_id, title, description, status, timestamps  
- **subtasks**: id, task_id, title, completed, position, timestamps
- **tags**: id, user_id, name, timestamps
- **task_tags**: task_id, tag_id (junction table)

---

## Testes

```bash
npm test
```

**5/5 testes aprovados:**
- ✓ Registro e login de usuários
- ✓ CRUD completo de tarefas
- ✓ Criação e listagem de tags
- ✓ Associação N:N entre tarefas e tags
- ✓ CRUD de subtasks com toggle

---

## Exemplos curl

### 1. Registrar usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@test.com","password":"123456"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"123456"}'

# Resposta: { "user": {...}, "token": "eyJ..." }
# COPIE O TOKEN!
```

### 3. Criar tarefa
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Comprar leite","status":"PENDING"}'
```

### 4. Criar subtask
```bash
curl -X POST http://localhost:3000/tasks/1/subtasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Ir ao mercado","position":1}'
```

### 5. Listar tarefas filtradas
```bash
# Todas
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer SEU_TOKEN"

# Apenas pendentes
curl "http://localhost:3000/tasks?status=PENDING" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## Interface HTML

Abra `docs/crud.html` no navegador após iniciar a API.

**Recursos:**
- Cadastro e login visuais
- Criar/listar/atualizar/deletar tarefas
- Criar subtasks e marcar como completas (checkbox)
- Filtro por status
- Debug panel (ver dados, resetar BD, ver perfil)

**Troubleshooting:**
- Erro 401? Faça login novamente
- ECONNREFUSED? API não está rodando
- Porta ocupada? Mude no campo "API Base URL"

---

## Debug Tools

Quando `NODE_ENV=development` (padrão):

```bash
# Ver todos os dados (usuários sem senhas + tarefas)
curl http://localhost:3000/debug/data

# Resetar banco e criar admin@local.test / 123456
curl -X POST http://localhost:3000/debug/reset
```

**Nota:** Retorna 403 Forbidden em produção.

---

## Variáveis de Ambiente

Crie `.env` na raiz:

```env
PORT=3000
JWT_SECRET=coloque_uma_string_aleatoria_longa_aqui
JWT_EXPIRES_IN=1d
DB_STORAGE=./database.sqlite
```

---

## Comandos

```bash
npm start       # Produção
npm run dev     # Desenvolvimento (nodemon)
npm test        # Rodar testes
```

---

## Troubleshooting

**Porta em uso:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F
```

**Token inválido:** Faça login novamente

**Banco corrompido:** Delete `database.sqlite` e reinicie

---

## Observações

- SQLite gera `database.sqlite` automaticamente
- Arquivo `database.sqlite` está no `.gitignore`
- Relacionamentos usam `ON DELETE CASCADE`
- Subtasks são ordenadas por `position` e `id`
- Debug endpoints desativados em produção

---

**Desenvolvido para o desafio back-end ZettaLab 2025**

