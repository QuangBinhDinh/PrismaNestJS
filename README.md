# NestJS Prisma Template

A NestJS template project using Prisma ORM with MySQL database.

## Features

- **NestJS** - A progressive Node.js framework
- **Prisma ORM** - Next-generation Node.js and TypeScript ORM
- **MySQL** - Database with Docker support
- **JWT Authentication** - Secure API endpoints
- **Swagger/OpenAPI** - API documentation
- **Class Validator** - Request validation
- **Repository Pattern** - Clean architecture

## Project Structure

```
src/
├── common/           # Shared utilities, DTOs, exceptions
├── constants/        # Application constants
├── database/         # Database module (Prisma service)
├── events/           # Event listeners
├── modules/          # Feature modules
│   ├── auth/         # Authentication
│   ├── departments/  # Departments CRUD
│   ├── employees/    # Employees CRUD
│   └── users/        # Users CRUD
└── utils/            # Utility functions
prisma/
├── schema.prisma     # Prisma schema
└── seed/             # Database seeders
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### 3. Start Database

```bash
npm run dock
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run Migrations

```bash
npm run db:migrate
```

### 6. Seed Database

```bash
npm run db:seed
```

### 7. Start Application

```bash
npm run start
```

## Available Scripts

| Command                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `npm run start`           | Start development server with hot reload            |
| `npm run start:debug`     | Start with debug mode                               |
| `npm run start:prod`      | Start production server                             |
| `npm run build`           | Build for production                                |
| `npm run lint`            | Run ESLint                                          |
| `npm run format`          | Format code with Prettier                           |
| `npm run db:generate`     | Generate Prisma client                              |
| `npm run db:migrate`      | Run database migrations                             |
| `npm run db:migrate:prod` | Deploy migrations (production)                      |
| `npm run db:push`         | Push schema to database                             |
| `npm run db:reset`        | Reset database (drop all tables, re-run migrations) |
| `npm run db:seed`         | Run all seeders                                     |
| `npm run db:seed:emp`     | Seed employees and departments                      |
| `npm run db:seed:users`   | Seed users                                          |
| `npm run db:studio`       | Open Prisma Studio                                  |
| `npm run dock`            | Start Docker containers                             |
| `npm run setup`           | Full setup (reset + seed)                           |
| `npm run kill`            | Kill process on port 3000                           |

## API Documentation

Once the application is running, visit:

- Swagger UI: http://localhost:3000/api

## API Endpoints

### Auth

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (protected)

### Employees

- `GET /employees` - List all employees (with pagination)
- `GET /employees/:id` - Get employee by ID
- `GET /employees/find-gender` - Find employees by gender
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `PUT /employees/transaction/:empNo` - Update with transaction
- `DELETE /employees/:id` - Delete employee

### Departments

- `GET /departments` - List all departments
- `GET /departments/:id` - Get department by ID
- `POST /departments` - Create new department
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

### Users

- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Tables

- **employees** - Employee information
- **departments** - Department information
- **users** - User accounts for authentication

## License

ISC
