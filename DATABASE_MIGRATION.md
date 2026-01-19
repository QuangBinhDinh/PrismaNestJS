# Database Migration Guide

This project uses **Prisma ORM** with schema-based migrations. The Prisma schema file (`prisma/schema.prisma`) is the **single source of truth** for your database structure.

## 📁 File Structure

```
prisma/
├── schema.prisma       # Prisma schema (single source of truth)
├── migrations/         # Generated migration SQL files (if using migrate)
└── seed/               # Database seeding scripts
    ├── index.ts        # Main seed entry point
    ├── seed-emp.ts     # Employees and departments seed
    └── seed-users.ts   # Users seed
src/
├── database/
│   ├── database.module.ts
│   └── prisma.service.ts
└── modules/
    ├── employees/
    ├── departments/
    └── users/
```

## 🚀 Available Commands

### 1. Generate Prisma Client

```bash
npm run db:generate
```

- Generates TypeScript client from `schema.prisma`
- Run this after modifying the schema
- Creates type-safe database client

### 2. Push Schema to Database (Development)

```bash
npm run db:push
```

- Directly syncs schema to database without creating migration files
- Best for development and rapid prototyping
- Doesn't require shadow database permissions
- **Recommended for Docker development setups**

### 3. Run Migrations (Production)

```bash
npm run db:migrate
```

- Creates migration files and applies them
- Requires shadow database permissions
- Best for production environments
- Version controlled migrations

### 4. Deploy Migrations (Production)

```bash
npm run db:migrate:prod
```

- Applies pending migrations to production database
- Doesn't create new migrations
- Safe for CI/CD pipelines

### 5. Seed Database

```bash
npm run db:seed
```

- Populates database with sample data
- Runs all seed scripts in `prisma/seed/`
- **Note:** Customize seed data in seed files

**Seed specific data:**

```bash
npm run db:seed:emp     # Seed departments and employees
npm run db:seed:users   # Seed users only
```

### 6. Reset Database

```bash
npm run db:reset
```

- ⚠️ **WARNING:** Drops ALL tables
- Re-runs all migrations
- Automatically runs seeders
- Use when you want to start fresh

### 7. Open Prisma Studio

```bash
npm run db:studio
```

- Opens a visual database browser at `http://localhost:5555`
- View and edit data through UI
- No need to write SQL queries

## 🔄 Typical Workflow

### Initial Setup

```bash
# 1. Start database
npm run dock

# 2. Push schema to database
npm run db:push

# 3. Generate Prisma Client
npm run db:generate

# 4. Seed sample data
npm run db:seed
```

### Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# Example: Add a new field to Employee model

# 2. Push changes to database
npm run db:push

# 3. Regenerate Prisma Client
npm run db:generate

# 4. Restart your application
npm run start
```

### Production Workflow (with Migrations)

```bash
# 1. Edit prisma/schema.prisma

# 2. Create migration
npm run db:migrate

# 3. Commit migration files to git
git add prisma/migrations
git commit -m "Add new field to Employee"

# 4. Deploy to production
npm run db:migrate:prod
```

### Reset and Rebuild

```bash
# 1. Reset database (drops all, re-runs migrations, seeds data)
npm run db:reset

# OR do it manually:
# 1. Push schema
npm run db:push

# 2. Seed data
npm run db:seed
```

## 📝 Schema Definition Example

```prisma
// prisma/schema.prisma
model Employee {
  empNo     Int      @id @default(autoincrement()) @map("emp_no")
  birthDate DateTime @map("birth_date") @db.Date
  firstName String   @map("first_name") @db.VarChar(14)
  lastName  String   @map("last_name") @db.VarChar(16)
  gender    Gender
  hireDate  DateTime @map("hire_date") @db.Date
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("employees")
}

enum Gender {
  M
  F
}
```

### Key Prisma Schema Features

- `@id` - Primary key
- `@default(autoincrement())` - Auto-increment
- `@map("column_name")` - Map to specific column name
- `@@map("table_name")` - Map to specific table name
- `@db.VarChar(14)` - Specify database type
- `@db.Date` - Use DATE type instead of DATETIME
- `@default(now())` - Default to current timestamp
- `@updatedAt` - Auto-update on record change
- `enum` - Define enum types

## ⚙️ Configuration

Database connection is configured in `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3307/employees"

# Optional (for backward compatibility)
DB_HOST=localhost
DB_PORT=3307
DB_USER=nhsvlocal
DB_PASSWORD=Nhsv2025
DB_NAME=employees
```

## 🎯 Benefits of Prisma ORM

1. **Type Safety**: Full TypeScript support with auto-generated types
2. **Single Source of Truth**: `schema.prisma` defines your database
3. **Migration Management**: Version-controlled schema changes
4. **Developer Experience**: Prisma Studio for visual database management
5. **Performance**: Optimized queries with connection pooling
6. **Validation**: Schema-level validation and constraints
7. **Relation Handling**: Easy-to-use relation queries

## 🔧 Troubleshooting

### "Environment variable not found: DATABASE_URL"

- Make sure `.env` file exists and contains `DATABASE_URL`
- Check that `.env` is in the root directory

### "Can't reach database server"

- Ensure Docker container is running: `npm run dock`
- Check database credentials in `.env`
- Verify port 3307 is not already in use

### Shadow Database Permission Error

- Use `npm run db:push` instead of `npm run db:migrate`
- This happens when MySQL user lacks CREATE DATABASE privilege
- `db:push` doesn't need shadow database

### Prisma Client Not Generated

```bash
# Manually generate client
npx prisma generate

# Or reinstall
rm -rf node_modules/.prisma
npm run db:generate
```

### Schema Out of Sync

```bash
# Reset and rebuild
npm run db:reset

# Or push changes
npm run db:push
```

## 🆚 Prisma vs Drizzle ORM

| Feature         | Prisma                       | Drizzle                       |
| --------------- | ---------------------------- | ----------------------------- |
| Schema Location | `prisma/schema.prisma`       | `*.schema.ts` files           |
| Query Syntax    | `prisma.employee.findMany()` | `db.select().from(employees)` |
| Type Safety     | Generated types              | Inferred types                |
| Migrations      | `prisma migrate`             | `drizzle-kit generate`        |
| GUI Tool        | Prisma Studio                | Drizzle Studio                |
| Performance     | Excellent                    | Excellent                     |
| Learning Curve  | Easier                       | SQL-like                      |

## 📚 Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
