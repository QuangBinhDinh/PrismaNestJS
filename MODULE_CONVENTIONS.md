# NestJS Module Creation Convention

## 📋 Standard Module Structure

Follow this structure when creating any new module in the project. This convention is based on the **Employees Module** as the reference implementation.

## 🗂️ Folder Structure

```
src/modules/
└── your-module/
    ├── your-module.controller.ts
    ├── your-module.service.ts
    ├── your-module.repository.ts
    ├── your-module.module.ts
    └── dto/
        ├── index.ts
        ├── request/
        │   ├── create-your-module.request.ts
        │   └── update-your-module.request.ts
        └── response/
            └── get-your-module.response.ts
```

**Note:** With Prisma, we don't need separate `*.schema.ts` files in each module. The schema is centralized in `prisma/schema.prisma`.

## 📝 File Naming Conventions

### Module Files

- **Controller**: `{module-name}.controller.ts`
- **Service**: `{module-name}.service.ts`
- **Repository**: `{module-name}.repository.ts`
- **Module**: `{module-name}.module.ts`

### DTO Files

- **Request DTOs**: `dto/request/{action}-{module-name}.request.ts`
  - Example: `create-employee.request.ts`, `update-employee.request.ts`
- **Response DTOs**: `dto/response/get-{module-name}.response.ts`
  - Example: `get-employee.response.ts`
- **Index file**: `dto/index.ts` (exports all DTOs)

### Class Naming

- **Request DTO**: `{Action}{ModuleName}Request`
  - Example: `CreateEmployeeRequest`, `UpdateEmployeeRequest`
- **Response DTO**: `Get{ModuleName}Response`
  - Example: `GetEmployeeResponse`
- **Controller**: `{ModuleName}Controller`
- **Service**: `{ModuleName}Service`
- **Repository**: `{ModuleName}Repository`

## 🔧 Implementation Checklist

### 1. Define Prisma Model (prisma/schema.prisma)

```prisma
model YourModule {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("your_module")
}
```

After defining, run:

```bash
npm run db:push
npm run db:generate
```

### 2. Repository (`your-module.repository.ts`)

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { YourModule, Prisma } from "@prisma/client";
import { NotFoundError } from "@common/exceptions";

@Injectable()
export class YourModuleRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findAll(
    pageSize: number,
    offset: number,
  ): Promise<YourModule[]> {
    return this.prisma.yourModule.findMany({
      take: pageSize,
      skip: offset,
    });
  }

  public async count(): Promise<number> {
    return this.prisma.yourModule.count();
  }

  public async findOne(id: number): Promise<YourModule | null> {
    return this.prisma.yourModule.findUnique({
      where: { id },
    });
  }

  public async create(data: Prisma.YourModuleCreateInput): Promise<YourModule> {
    return this.prisma.yourModule.create({ data });
  }

  public async update(
    id: number,
    data: Prisma.YourModuleUpdateInput,
  ): Promise<YourModule> {
    try {
      return await this.prisma.yourModule.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundError(`YourModule with ID ${id}`);
      }
      throw error;
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.prisma.yourModule.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundError(`YourModule with ID ${id}`);
      }
      throw error;
    }
  }

  public async findByCondition(
    condition: Prisma.YourModuleWhereInput,
  ): Promise<YourModule[]> {
    return this.prisma.yourModule.findMany({
      where: condition,
    });
  }

  // Transaction example
  public async txUpdate(
    id: number,
    data: Prisma.YourModuleUpdateInput,
  ): Promise<YourModule> {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.yourModule.findUnique({ where: { id } });
      if (!item) {
        throw new NotFoundError(`YourModule with ID ${id}`);
      }
      return tx.yourModule.update({ where: { id }, data });
    });
  }
}
```

### 3. Request DTOs (`dto/request/`)

**create-your-module.request.ts**:

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateYourModuleRequest {
  @ApiProperty({ example: "Example Name" })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
```

**update-your-module.request.ts**:

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateYourModuleRequest {
  @ApiProperty({ example: "Updated Name", required: false })
  @IsString()
  @IsOptional()
  public name?: string;
}
```

### 4. Response DTO (`dto/response/get-your-module.response.ts`)

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class GetYourModuleResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;
}
```

### 5. DTO Index (`dto/index.ts`)

```typescript
export * from "./request/create-your-module.request";
export * from "./request/update-your-module.request";
export * from "./response/get-your-module.response";
```

### 6. Service (`your-module.service.ts`)

```typescript
import { Injectable } from "@nestjs/common";
import { YourModuleRepository } from "./your-module.repository";
import { CreateYourModuleRequest, UpdateYourModuleRequest } from "./dto";
import { YourModule } from "@prisma/client";
import { NotFoundError, handleServiceError } from "@common/exceptions";
import { PaginationMetadata } from "@common/services/pagination-metadata.service";
import { DEFAULT_PAGE_SIZE } from "@common/constants/pagination.constants";

@Injectable()
export class YourModuleService {
  public constructor(
    private readonly repository: YourModuleRepository,
    private readonly paginationMetadata: PaginationMetadata,
  ) {}

  public async findAll(
    pageId?: number,
    pageSize?: number,
  ): Promise<YourModule[]> {
    if (pageId !== undefined && pageSize !== undefined) {
      const offset = (pageId - 1) * pageSize;
      const [items, totalCount] = await Promise.all([
        this.repository.findAll(pageSize, offset),
        this.repository.count(),
      ]);
      this.paginationMetadata.setTotalCount(totalCount);
      return items;
    }
    return this.repository.findAll(DEFAULT_PAGE_SIZE, 0);
  }

  public async findOne(id: number): Promise<YourModule> {
    const item = await this.repository.findOne(id);
    if (!item) {
      throw new NotFoundError(`YourModule with ID ${id}`);
    }
    return item;
  }

  public async create(request: CreateYourModuleRequest): Promise<YourModule> {
    try {
      return await this.repository.create(request);
    } catch (e) {
      handleServiceError(e, "Failed to create your module");
    }
  }

  public async update(
    id: number,
    request: UpdateYourModuleRequest,
  ): Promise<YourModule> {
    try {
      return await this.repository.update(id, request);
    } catch (e) {
      handleServiceError(e, "Failed to update your module");
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.repository.remove(id);
    } catch (e) {
      handleServiceError(e, "Failed to remove your module");
    }
  }
}
```

### 7. Controller (`your-module.controller.ts`)

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { YourModuleService } from "./your-module.service";
import {
  CreateYourModuleRequest,
  UpdateYourModuleRequest,
  GetYourModuleResponse,
} from "./dto";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { PaginationQueryDto } from "@common/dto/pagination-query.dto";
import { ApiResponseDto } from "@common/dto/paginated-response.dto";
import { EntityMapper } from "@common/mappers/entity.mapper";
import { Public } from "@modules/auth/decorators/public.decorator";

@ApiTags("YourModule")
@Controller("your-module")
@UseInterceptors(ResponseInterceptor)
@Public() // All endpoints are public by default
export class YourModuleController {
  public constructor(private readonly service: YourModuleService) {}

  @Get()
  @ApiOperation({ summary: "Get all items" })
  @ApiResponse({
    status: 200,
    description: "List of items",
    type: ApiResponseDto,
  })
  public async findAll(@Query() query: PaginationQueryDto) {
    const items = await this.service.findAll(query.pageId, query.pageSize);
    return items.map(EntityMapper.toYourModuleResponse);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get item by ID" })
  @ApiResponse({ status: 200, description: "Item details" })
  public async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GetYourModuleResponse> {
    const item = await this.service.findOne(id);
    return EntityMapper.toYourModuleResponse(item);
  }

  @Post()
  @ApiOperation({ summary: "Create new item" })
  @ApiResponse({ status: 201, description: "Item created successfully" })
  public async create(
    @Body() request: CreateYourModuleRequest,
  ): Promise<GetYourModuleResponse> {
    const item = await this.service.create(request);
    return EntityMapper.toYourModuleResponse(item);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update item" })
  @ApiResponse({ status: 200, description: "Item updated successfully" })
  public async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() request: UpdateYourModuleRequest,
  ): Promise<GetYourModuleResponse> {
    const item = await this.service.update(id, request);
    return EntityMapper.toYourModuleResponse(item);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete item" })
  @ApiResponse({ status: 204, description: "Item deleted successfully" })
  public async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
```

### 8. Module (`your-module.module.ts`)

```typescript
import { Module } from "@nestjs/common";
import { YourModuleController } from "./your-module.controller";
import { YourModuleService } from "./your-module.service";
import { YourModuleRepository } from "./your-module.repository";
import { PaginationMetadata } from "@common/services/pagination-metadata.service";

@Module({
  controllers: [YourModuleController],
  providers: [YourModuleService, YourModuleRepository, PaginationMetadata],
  exports: [YourModuleService, YourModuleRepository],
})
export class YourModuleModule {}
```

### 9. Add EntityMapper Method (`src/common/mappers/entity.mapper.ts`)

```typescript
public static toYourModuleResponse(item: YourModule): GetYourModuleResponse {
  return {
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
```

### 10. Register Module in App (`src/modules/app.module.ts`)

```typescript
import { YourModuleModule } from "@modules/your-module/your-module.module";

@Module({
  imports: [
    // ... other modules
    YourModuleModule,
  ],
})
export class AppModule {}
```

## ✅ Key Principles

1. **DTO Organization**: Always separate request and response DTOs into subfolders
2. **Naming**: Use clear, descriptive names following the convention
3. **Access Modifiers**: All methods are `public` by default
4. **Public Endpoints**: Use `@Public()` decorator at controller level
5. **Validation**: Use class-validator decorators on request DTOs
6. **Swagger**: Use `@ApiProperty()` on all DTO properties
7. **Error Handling**: Use common error utilities (`NotFoundError`, `handleServiceError`)
8. **Pagination**: Support pagination with `PaginationQueryDto`
9. **Interceptors**: Use `ResponseInterceptor` for consistent response format
10. **Mapper**: Use `EntityMapper` to convert entities to response DTOs
11. **Prisma Types**: Use generated Prisma types (`YourModule`, `Prisma.YourModuleCreateInput`, etc.)
12. **Transaction Support**: Use `prisma.$transaction()` for atomic operations

## 🎯 Prisma-Specific Guidelines

### Using Prisma Types

```typescript
import { YourModule, Prisma } from "@prisma/client";

// For create operations
data: Prisma.YourModuleCreateInput;

// For update operations
data: Prisma.YourModuleUpdateInput;

// For where conditions
where: Prisma.YourModuleWhereInput;
```

### Error Handling

```typescript
// Prisma error code P2025 = Record not found
if (error.code === "P2025") {
  throw new NotFoundError(`YourModule with ID ${id}`);
}
```

### Transactions

```typescript
return this.prisma.$transaction(async (tx) => {
  // All operations here are atomic
  const item = await tx.yourModule.findUnique({ where: { id } });
  return tx.yourModule.update({ where: { id }, data });
});
```

## 📚 Reference Module

Always refer to the **Employees Module** as the gold standard for implementation:

- `/src/modules/employees/`

---

**Last Updated:** January 19, 2026  
**Convention Based On:** Employees Module Structure with Prisma ORM
