import { Injectable } from "@nestjs/common";
import { Department } from "@prisma/client";
import { DepartmentsRepository } from "@modules/departments/departments.repository";
import {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@modules/departments/dto";
import { NotFoundError, handleServiceError } from "@common/exceptions";
import { PaginationMetadata } from "@common/services/pagination-metadata.service";

@Injectable()
export class DepartmentsService {
  public constructor(
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly paginationMetadata: PaginationMetadata,
  ) {}

  public async findAll(
    pageId?: number,
    pageSize?: number,
  ): Promise<Department[]> {
    // If pagination params are provided
    let pagination: { limit: number; offset: number } | undefined = undefined;
    if (pageId !== undefined && pageSize !== undefined) {
      const totalCount = await this.departmentsRepository.count();
      pagination = {
        limit: pageSize,
        offset: (pageId - 1) * pageSize,
      };
      this.paginationMetadata.setTotalCount(totalCount);
    }

    // Default behavior without pagination
    return this.departmentsRepository.findAll(pagination);
  }

  public async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne(id);

    if (!department) {
      throw new NotFoundError(`Department with ID ${id}`);
    }

    return department;
  }

  public async create(request: CreateDepartmentRequest): Promise<Department> {
    try {
      const departmentData = {
        deptNo: request.deptNo,
        deptName: request.deptName,
      };

      const createdRow =
        await this.departmentsRepository.create(departmentData);
      return createdRow;
    } catch (e) {
      handleServiceError(e, "Failed to create department");
    }
  }

  public async update(
    id: number,
    request: UpdateDepartmentRequest,
  ): Promise<Department> {
    try {
      const updatedRow = await this.departmentsRepository.update(id, request);
      if (!updatedRow) {
        throw new NotFoundError(`Department with ID ${id}`);
      }
      return updatedRow;
    } catch (e) {
      handleServiceError(e, "Failed to update department");
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      const affectedRows = await this.departmentsRepository.remove(id);
      if (affectedRows === 0) {
        throw new NotFoundError(`Department with ID ${id}`);
      }
    } catch (e) {
      handleServiceError(e, "Failed to delete department");
    }
  }
}
