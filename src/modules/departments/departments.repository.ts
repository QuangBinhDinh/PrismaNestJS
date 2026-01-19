import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { Department, Prisma } from "@prisma/client";
import { DEFAULT_QUERY_LIMIT } from "@common/constants/pagination.constants";

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination?: {
    limit: number;
    offset: number;
  }): Promise<Department[]> {
    const limit = pagination?.limit ?? DEFAULT_QUERY_LIMIT;
    const offset = pagination?.offset ?? 0;

    return this.prisma.department.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }

  async count(): Promise<number> {
    return this.prisma.department.count();
  }

  async findOne(id: number): Promise<Department | null> {
    return this.prisma.department.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return this.prisma.department.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.DepartmentUpdateInput,
  ): Promise<Department | null> {
    try {
      return await this.prisma.department.update({
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
      await this.prisma.department.delete({
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
    condition: Prisma.DepartmentWhereInput,
    pagination?: { limit: number; offset: number },
  ): Promise<Department[]> {
    const limit = pagination?.limit ?? DEFAULT_QUERY_LIMIT;
    const offset = pagination?.offset ?? 0;

    return this.prisma.department.findMany({
      where: condition,
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }

  // Transaction methods
  async txUpdateOneByCondition(
    tx: Prisma.TransactionClient,
    condition: Prisma.DepartmentWhereInput,
    data: Prisma.DepartmentUpdateInput,
  ): Promise<Department | null> {
    try {
      // Find the first matching record
      const record = await tx.department.findFirst({
        where: condition,
      });

      if (!record) {
        return null;
      }

      return await tx.department.update({
        where: { id: record.id },
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
}
