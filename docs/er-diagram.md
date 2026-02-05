# Modelo de Entidade e Relacionamento

## Diagrama ER

```mermaid
erDiagram
  USERS ||--o{ TASKS : "possui"

  USERS {
    int id PK "Identificador unico"
    string name "Nome completo"
    string email UK "Email unico"
    string password_hash "Senha criptografada (bcrypt)"
    datetime created_at "Data de criacao"
    datetime updated_at "Data de atualizacao"
  }

  TASKS {
    int id PK "Identificador unico"
    string title "Titulo da tarefa"
    string description "Descricao detalhada"
    string status "PENDING ou COMPLETED"
    int user_id FK "Referencia ao usuario"
    datetime created_at "Data de criacao"
    datetime updated_at "Data de atualizacao"
  }
```

## Relacionamentos

- Um USUARIO pode ter zero ou varias TAREFAS (1:N)
- Uma TAREFA pertence a exatamente um USUARIO

## Constraints

### USERS
- `id`: PRIMARY KEY, AUTO_INCREMENT
- `email`: UNIQUE, NOT NULL
- `name`: NOT NULL
- `password_hash`: NOT NULL

### TASKS
- `id`: PRIMARY KEY, AUTO_INCREMENT
- `title`: NOT NULL
- `description`: NOT NULL
- `status`: NOT NULL, DEFAULT 'PENDING', VALUES ('PENDING', 'COMPLETED')
- `user_id`: FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE
