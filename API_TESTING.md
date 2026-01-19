# API Testing Guide

This NestJS application uses **Prisma ORM** with MySQL and runs on `http://localhost:3000`

## Quick Start

```bash
# 1. Start database
npm run dock

# 2. Push schema to database
npm run db:push

# 3. Generate Prisma Client
npm run db:generate

# 4. Seed database
npm run db:seed

# 5. Start server
npm run start
```

## Testing the Endpoints

### Authentication

#### Register a new user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123",
    "fullName": "Test User"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123"
  }'
```

Response:

```json
{
  "status": 200,
  "message": "",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "System Administrator"
    }
  }
}
```

**Note:** Copy the `accessToken` for authenticated requests below.

### Employees API (Protected)

All employee endpoints require JWT authentication:

```bash
# Set your token
TOKEN="your-jwt-token-here"
```

#### Get all employees (with pagination)

```bash
curl http://localhost:3000/employees?pageId=1&pageSize=5 \
  -H "Authorization: Bearer $TOKEN"
```

#### Find employees by gender

```bash
curl http://localhost:3000/employees/find-gender?gender=M \
  -H "Authorization: Bearer $TOKEN"
```

#### Get a specific employee

```bash
curl http://localhost:3000/employees/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Create a new employee

```bash
curl -X POST http://localhost:3000/employees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1990-01-01",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "M",
    "hireDate": "2024-01-01"
  }'
```

#### Update an employee

```bash
curl -X PUT http://localhost:3000/employees/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

#### Update employee with transaction

```bash
curl -X PUT http://localhost:3000/employees/transaction/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

#### Delete an employee

```bash
curl -X DELETE http://localhost:3000/employees/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Departments API (Protected)

#### Get all departments (with pagination)

```bash
curl http://localhost:3000/departments?pageId=1&pageSize=5 \
  -H "Authorization: Bearer $TOKEN"
```

#### Get a specific department

```bash
curl http://localhost:3000/departments/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Create a new department

```bash
curl -X POST http://localhost:3000/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deptNo": "d010",
    "deptName": "Engineering"
  }'
```

#### Update a department

```bash
curl -X PUT http://localhost:3000/departments/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deptName": "Research & Development"
  }'
```

#### Delete a department

```bash
curl -X DELETE http://localhost:3000/departments/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Users API (Protected)

#### Get all users (with pagination)

```bash
curl http://localhost:3000/users?pageId=1&pageSize=5 \
  -H "Authorization: Bearer $TOKEN"
```

#### Get a specific user

```bash
curl http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Create a new user

```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "Password@123",
    "email": "newuser@example.com",
    "fullName": "New User",
    "phone": "+1234567890"
  }'
```

#### Update a user

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "phone": "+9876543210"
  }'
```

#### Delete a user

```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Sample Responses

### GET /employees?pageId=1&pageSize=3

```json
{
  "status": 200,
  "message": "",
  "data": [
    {
      "empNo": 10001,
      "birthDate": "1953-09-02T00:00:00.000Z",
      "firstName": "Georgi",
      "lastName": "Facello",
      "gender": "M",
      "hireDate": "1986-06-26T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    },
    {
      "empNo": 10002,
      "birthDate": "1964-06-02T00:00:00.000Z",
      "firstName": "Bezalel",
      "lastName": "Simmel",
      "gender": "F",
      "hireDate": "1985-11-21T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    },
    {
      "empNo": 10003,
      "birthDate": "1959-12-03T00:00:00.000Z",
      "firstName": "Parto",
      "lastName": "Bamford",
      "gender": "M",
      "hireDate": "1986-08-28T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    }
  ],
  "meta": {
    "pageId": 1,
    "pageSize": 3,
    "totalCount": 10,
    "hasNext": true
  }
}
```

### GET /departments?pageId=1&pageSize=3

```json
{
  "status": 200,
  "message": "",
  "data": [
    {
      "deptNo": "d001",
      "deptName": "Marketing",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    },
    {
      "deptNo": "d002",
      "deptName": "Finance",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    },
    {
      "deptNo": "d003",
      "deptName": "Human Resources",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    }
  ],
  "meta": {
    "pageId": 1,
    "pageSize": 3,
    "totalCount": 9,
    "hasNext": true
  }
}
```

## Swagger Documentation

Visit http://localhost:3000/api for interactive API documentation.

## Database Commands (Prisma)

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (no migration files)
npm run db:push

# Run migrations (requires shadow DB permissions)
npm run db:migrate

# Reset database and reseed
npm run db:reset

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database
npm run db:seed
npm run db:seed:emp     # Seed only employees
npm run db:seed:users   # Seed only users
```

## Seeded Data

**Users:**

- admin / Admin@123
- johndoe / John@123
- janedoe / Jane@123
  (and 7 more users)

**Departments:**

- d001 through d009

**Employees:**

- 10001 through 10010
