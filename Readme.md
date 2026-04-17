# 🎬 Gestão de Filmes

Project developed as a technical test, aiming to build a full application (frontend + backend) for managing and querying movies using an external API (OMDb).

## 🔗 Deploy: [Movie catalog here - Access Here!](https://teste-vaga-micro-kids-gestao-filmes.vercel.app)

# Admin test profile

**Email: admin@hotmail.com**

**Password: admin123**

---

**⚠️ Note:**
**The backend is hosted on Render (free tier) and may take a few seconds on the first request due to cold start.**

<p align="center">
  <img src="./assets/demo.gif" width="700"/>
</p>

## 🚀 How to run the project

### 📦 prerequisites

- Node.js (>= 18)
- npm ou yarn
- Database (PostgreSQL with Prisma)

---

### 🔧 Clone the repository

```bash
git clone https://github.com/GustavoTrevezani/movies-catalog-api.git
cd movies-catalog-api
```

---

# Prisma setup

```
npm install
npx prisma generate
npx prisma migrate dev
```

# Configure environment variables (.env)

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

## Server URLs

1. backend http://localhost:3001
2. frontend http://localhost:3000

# Run frontend and backend together (root folder)

1. npm run dev

# Run backend

**Inside the root/backend folder, run:**

1. cd backend
2. npm run build
3. npm run start

# Run frontend

**Inside the root/frontend folder, run:**

1. cd backend
2. npm run dev

# 🛠 Technologies Used

## Backend

- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL (relational database)
- External API integration (OMDb)

## Frontend

- TypeScript
- HTML/CSS
- Angular
- REST API consumption

## 🔐 Authentication, Authorization, and Validation

The application follows security best practices using JWT authentication, role-based access control, and DTO validation.

---

### 🔑 JWT Authentication

Authentication is handled using JSON Web Tokens (JWT).
Protected routes use JwtAuthGuard, which validates the token sent in the request header.

Example:

```http
Authorization: Bearer <token>
```

If the token is valid, user data is injected into the request (request.user).
Otherwise, the request is blocked with a 401 Unauthorized error.

## 🛡️ Role-Based Access Control (RBAC)

The project implements role-based access control, allowing route restrictions based on user permission levels.

A custom decorator was created:

**@Roles("admin")**

And a guard (RolesGuard) checks if the authenticated user has the required role.

**Example:**

```
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Get()
findAll() {}
```

If the user does not have permission, the API returns **401 Unauthorized.**

## 📦 Data Validation with DTOs

The application uses DTOs (Data Transfer Objects) to validate incoming request data.

**Exemple:**

```
export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}

```

DTOs ensure:

- Strong typing
- Automatic validation
- Protection against invalid data
- Standardized API inputs

# 🎯 Features

- Search movies via OMDb API
- List movies
- Store movies in the database
- Manage movie catalog

# 🧠 Technical Decisions

## 1. Frontend and Backend Separation

**I chose to separate into two applications to:**

- Improve code organization
- Enable future scalability
- Allow independent deployment

## 2. Prisma Usage

**Chosen because:**

- Easy database modeling
- Strong typing with TypeScript
- High development productivity

## 3. OMDb API Integration

**Used to:**

- Meet the technical test requirement
- Avoid maintaining a proprietary movie database
- Retrieve rich data (poster, description, year, etc.)
- Simulate a real-world external API consumption scenario

## 4. TypeScript Across the Entire Project

**Decision made for:**

- Better maintainability
- Fewer runtime errors
- More predictable code

## 5. Angular on the Frontend

**Chosen because:**

- Technical requirement
- Fast build
- Simplicity
- Lightweight setup

## 📌 Notes

The project was developed with a focus on simplicity and clarity.
The structure was designed for easy future evolution.

# 👨‍💻 Author

# **Gustavo Trevezani Frasson**
