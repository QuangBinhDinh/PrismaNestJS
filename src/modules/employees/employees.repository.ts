import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { Employee, Prisma } from "@prisma/client";
import { getEmployeeByEmpNo, searchEmployeesByName } from "@prisma/client/sql";
import { DEFAULT_QUERY_LIMIT } from "@common/constants/pagination.constants";

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination?: {
    limit: number;
    offset: number;
  }): Promise<Employee[]> {
    const limit = pagination?.limit ?? DEFAULT_QUERY_LIMIT;
    const offset = pagination?.offset ?? 0;

    return this.prisma.employee.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }

  async count(): Promise<number> {
    return this.prisma.employee.count();
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.EmployeeUpdateInput,
  ): Promise<Employee | null> {
    try {
      return await this.prisma.employee.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  async remove(id: number): Promise<number> {
    try {
      await this.prisma.employee.delete({
        where: { id },
      });
      return 1;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return 0;
      }
      throw error;
    }
  }

  async findByCondition(
    condition: Prisma.EmployeeWhereInput,
    pagination?: { limit: number; offset: number },
  ): Promise<Employee[]> {
    const limit = pagination?.limit ?? DEFAULT_QUERY_LIMIT;
    const offset = pagination?.offset ?? 0;

    return this.prisma.employee.findMany({
      where: condition,
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }

  // Transaction methods
  async txUpdate(
    tx: Prisma.TransactionClient,
    id: number,
    data: Prisma.EmployeeUpdateInput,
  ): Promise<Employee | null> {
    try {
      return await tx.employee.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  // TypedSQL method - uses raw SQL with full type safety
  async findWithEmpNo(empNo: number) {
    const result = await this.prisma.$queryRawTyped(getEmployeeByEmpNo(empNo));
    return result[0] ?? null;
  }

  // TypedSQL method - search employees by first name or last name using LIKE
  async searchByName(searchTerm: string) {
    return this.prisma.$queryRawTyped(
      searchEmployeesByName(searchTerm, searchTerm),
    );
  }
}
