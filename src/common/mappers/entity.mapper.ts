import { Employee, Department, User } from "@prisma/client";
import { GetEmployeeResponse } from "@modules/employees/dto/response/get-employee.response";
import { GetDepartmentResponse } from "@modules/departments/dto/response/get-department.response";
import { GetUserResponse } from "@modules/users/dto/response/get-user.response";

export class EntityMapper {
  /**
   * Generic mapper function that maps entity to response DTO
   * Automatically converts all Date properties to ISO string
   * Excludes sensitive fields like passwordHash
   * @param entity - Source entity object
   */
  public static toResponse<TEntity, TResponse>(
    entity: TEntity,
    excludeFields: string[] = [],
  ): TResponse {
    const result = { ...entity } as any;

    // Remove excluded fields
    for (const field of excludeFields) {
      delete result[field];
    }

    // Automatically convert all Date fields to ISO strings
    for (const key in result) {
      const value = result[key];

      if (value instanceof Date) {
        result[key] = value.toISOString();
      }
      // Handle BigInt conversion to number
      if (typeof value === "bigint") {
        result[key] = Number(value);
      }
    }

    return result as TResponse;
  }

  // Convenience methods using the generic function
  public static toEmployeeResponse(employee: Employee): GetEmployeeResponse {
    return EntityMapper.toResponse<Employee, GetEmployeeResponse>(employee);
  }

  public static toDepartmentResponse(
    department: Department,
  ): GetDepartmentResponse {
    return EntityMapper.toResponse<Department, GetDepartmentResponse>(
      department,
    );
  }

  public static toUserResponse(user: User): GetUserResponse {
    return EntityMapper.toResponse<User, GetUserResponse>(user, [
      "passwordHash",
    ]);
  }
}
