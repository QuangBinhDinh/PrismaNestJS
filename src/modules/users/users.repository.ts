import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { User, Prisma } from "@prisma/client";
import { DEFAULT_QUERY_LIMIT } from "@common/constants/pagination.constants";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination?: {
    limit: number;
    offset: number;
  }): Promise<User[]> {
    const limit = pagination?.limit ?? DEFAULT_QUERY_LIMIT;
    const offset = pagination?.offset ?? 0;

    return this.prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: BigInt(id) },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id: BigInt(id) },
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
      await this.prisma.user.delete({
        where: { id: BigInt(id) },
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

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
