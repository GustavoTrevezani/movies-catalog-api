# 🎬 Gestão de Filmes

Projeto desenvolvido como teste técnico, com o objetivo de criar uma aplicação completa (frontend + backend) para gerenciamento e consulta de filmes utilizando API externa (OMDb).

🔗 Deploy: Ainda não funcionando na Vercel e Railway!

## 🚀 Como rodar o projeto

### 📦 Pré-requisitos

- Node.js (>= 18)
- npm ou yarn
- Banco de dados (PostgreSQL via Prisma)

---

### 🔧 Clonar o repositório

```bash
git clone https://github.com/GustavoTrevezani/Teste-Vaga-MicroKids---Gestao-Filmes.git
cd Teste-Vaga-MicroKids---Gestao-Filmes
```

---

# Prisma precisa ser gerado:

```
npm install
npx prisma generate
npx prisma migrate dev
```

# configurar variáveis de ambiente (.env)

## backend/.env

```
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.bcgvxyuyciysjpjyzgfz:[SuaSenha]@aws-1-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.bcgvxyuyciysjpjyzgfz:[SuaSenha]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="Sua_Senha_secreta_aqui"
OMDB_API_KEY="84268f6d"
```

## frontend/.env

```
NEXT_PUBLIC_API_URL="http://localhost:3000"

JWT_SECRET="Sua_Senha_secreta_aqui"

OMDB_API_KEY="84268f6d"
```

## Servidor rotas url

1. backend http://localhost:3001
2. frontend http://localhost:3000

# Como rodar o FrontEnd e BackEnd juntos na Raiz do projeto

1. npm run dev

# Como rodar o backend

**Dentro do terminal raiz/backend rode estes comandos**

1. cd backend
2. npm run build
3. npm run start

# Como rodar o frontend

**Dentro do terminal raiz/frontend rode estes comandos**

1. cd backend
2. npm run dev

# 🛠 Tecnologias utilizadas

## Backend

- Node.js
- TypeScript
- Prisma ORM
- Banco de dados relacional PostgreSQL
- Integração com API externa (OMDb)

## Frontend

- TypeScript
- HTML/CSS
- Angular
- Consumo de API REST

## 🔐 Autenticação, Autorização e Validação

A aplicação utiliza boas práticas de segurança com autenticação via JWT, controle de permissões baseado em roles e validação de dados com DTOs.

---

### 🔑 Autenticação com JWT

A autenticação é feita utilizando JSON Web Tokens (JWT).  
Rotas protegidas utilizam o `JwtAuthGuard`, que valida o token enviado no header da requisição.

Exemplo de uso:

```http
Authorization: Bearer <token>
```

Se o token for válido, os dados do usuário são injetados na requisição (request.user).
Caso contrário, a requisição é bloqueada com erro 401 Unauthorized.

## 🛡️ Controle de acesso com Roles (RBAC)

O projeto implementa controle de acesso baseado em papéis (roles), permitindo restringir rotas conforme o nível de permissão do usuário.

Foi criado um decorator personalizado:

**@Roles("admin")**

E um guard (RolesGuard) que verifica se o usuário autenticado possui a role necessária para acessar a rota.

**Exemplo de uso:**

```
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Get()
findAll() {}
```

Se o usuário não possuir a permissão necessária, a API retorna **401 Unauthorized.**

## 📦 Validação de dados com DTO

A aplicação utiliza DTOs (Data Transfer Objects) para validar os dados de entrada nas requisições.

**Exemplo:**

```
export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}

```

Os DTOs garantem:

- Tipagem forte
- Validação automática
- Segurança contra dados inválidos
- Padronização das entradas da API

# 🎯 Funcionalidades

- Buscar filmes via API OMDb
- Listar filmes
- Armazenar filmes no banco de dados
- Gerenciar catálogo de filmes

# 🧠 Decisões tomadas

## 1. Separação Frontend e Backend

**Optei por separar em duas aplicações distintas para:**

- Melhor organização do código
- Escalabilidade futura
- Possibilidade de deploy independente

## 2. Uso do Prisma

**Escolhi o Prisma por:**

- Facilidade de modelagem do banco
- Tipagem forte com TypeScript
- Produtividade no desenvolvimento

## 3. Integração com OMDb API

**Utilizei a API OMDb para:**

- Garantir o requisito do teste técnico
- Evitar necessidade de base de dados própria de filmes
- Obter dados ricos (poster, descrição, ano, etc)
- Simular cenário real de consumo de API externa

## 4. TypeScript em todo o projeto

**Decisão para:**

- Melhor manutenção
- Redução de erros
- Código mais previsível

## 5. Anulgar no frontend

**Escolhido por:**

- Requisito técnico
- Build rápido
- Simplicidade
- Setup leve

## 📌 Observações

O projeto foi desenvolvido com foco em simplicidade e clareza
Estrutura pensada para fácil evolução.

# 👨‍💻 Autor

# **Gustavo Trevezani Frasson**

```

```
