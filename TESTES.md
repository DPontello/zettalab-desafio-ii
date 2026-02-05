# Testes da API

## Testes Automatizados

### Execução dos testes Jest

```bash
npm test
```

**Resultado:**
- 2 testes passaram com sucesso
- Tempo de execução: 1.442s
- Cobertura: autenticação e CRUD completo de tarefas

### Casos testados

1. Registro e login de usuario
   - Criação de usuario com sucesso
   - Geracao de token JWT valido

2. Operacoes de tarefas
   - Criação de tarefa
   - Listagem de tarefas
   - Atualização de status
   - Exclusão de tarefa

## Testes Manuais

### Health Check

**Request:**
```
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "time": "2026-02-05T20:10:53.652Z"
}
```

### Criação de Usuario

**Request:**
```
POST /users
Content-Type: application/json

{
  "name": "Hugo Pontello",
  "email": "hugo@test.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Hugo Pontello",
  "email": "hugo@test.com",
  "createdAt": "2026-02-05T20:11:06.578Z"
}
```

### Login

**Request:**
```
POST /sessions
Content-Type: application/json

{
  "email": "hugo@test.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Hugo Pontello",
    "email": "hugo@test.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Criação de Tarefa

**Request:**
```
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Entregar desafio ZettaLab",
  "description": "Finalizar e testar toda a API",
  "status": "PENDING"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Entregar desafio ZettaLab",
  "description": "Finalizar e testar toda a API",
  "status": "PENDING",
  "userId": 1,
  "createdAt": "2026-02-05T20:11:26.461Z",
  "updatedAt": "2026-02-05T20:11:26.461Z"
}
```

### Listagem de Tarefas

**Request:**
```
GET /tasks
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Entregar desafio ZettaLab",
    "description": "Finalizar e testar toda a API",
    "status": "PENDING",
    "userId": 1,
    "createdAt": "2026-02-05T20:11:26.461Z",
    "updatedAt": "2026-02-05T20:11:26.461Z"
  }
]
```

### Atualização de Tarefa

**Request:**
```
PUT /tasks/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Entregar desafio ZettaLab",
  "description": "Finalizar e testar toda a API",
  "status": "COMPLETED",
  "userId": 1,
  "createdAt": "2026-02-05T20:11:26.461Z",
  "updatedAt": "2026-02-05T20:11:38.636Z"
}
```

### Filtro por Status

**Request:**
```
GET /tasks?status=COMPLETED
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Entregar desafio ZettaLab",
    "status": "COMPLETED",
    ...
  }
]
```

### Exclusão de Tarefa

**Request:**
```
DELETE /tasks/2
Authorization: Bearer {token}
```

**Response:** 204 No Content

### Obter Tarefa Especifica

**Request:**
```
GET /tasks/1
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Entregar desafio ZettaLab",
  "description": "Finalizar e testar toda a API",
  "status": "COMPLETED",
  "userId": 1,
  "createdAt": "2026-02-05T20:11:26.461Z",
  "updatedAt": "2026-02-05T20:11:38.636Z"
}
```

## Testes de Validação

### Campo obrigatorio ausente

**Request:**
```
POST /users
Content-Type: application/json

{
  "name": "Teste",
  "password": "123456"
}
```

**Response (400):**
```json
{
  "error": "Validation fails.",
  "details": [
    "email is a required field"
  ]
}
```

### Requisição sem token

**Request:**
```
GET /tasks
```

**Response (401):**
```json
{
  "error": "Token not provided."
}
```

### Credenciais invalidas

**Request:**
```
POST /sessions
Content-Type: application/json

{
  "email": "hugo@test.com",
  "password": "senhaerrada"
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials."
}
```

### Email duplicado

**Request:**
```
POST /users
Content-Type: application/json

{
  "name": "Hugo 2",
  "email": "hugo@test.com",
  "password": "123456"
}
```

**Response (409):**
```json
{
  "error": "Email already in use."
}
```

## Status dos Testes

Todos os endpoints foram testados e estao funcionando conforme esperado:

- Autenticacao JWT funcionando
- Validacao de entrada funcionando
- CRUD completo de tarefas funcionando
- Filtro por status funcionando
- Protecao de rotas funcionando
- Tratamento de erros funcionando
