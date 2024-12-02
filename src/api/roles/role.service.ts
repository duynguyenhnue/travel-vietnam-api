import { HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAndUpdateRoleRequest } from "../../payload/request/role.request";
import { GetListRoleResponse } from "../../payload/response/role.response";
import { RoleRepository } from "../../repositories/role.repository";
import { RoleDocument } from "../../schema/role.schema";
import { AUTH_ROLES, USER_PERMISSIONS } from "src/enums/auth.enum";
import { PermissionRepository } from "src/repositories/permission.repository";
import { Status } from "src/enums/role.enum";
import { CommonException } from "src/common/exception/common.exception";

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository
  ) {}

  async onModuleInit() {
    await this.createOrUpdateUserRole();
  }

  async createOrUpdateUserRole() {
    const defaultsRole = [
      {
        name: "ADMIN",
        description: "Admin Role",
        permissions: await this.getFullPermissions(),
        status: Status.ACTIVATED,
      },
      {
        name: "USER",
        description: "User Role",
        permissions: await this.getUserPermissionIds(),
        status: Status.ACTIVATED,
      },
    ];

    defaultsRole.forEach(async (role) => {
      await this.roleRepository.findOneAndUpdate(role);
    });
  }

  async getFullPermissions() {
    const permissions = await this.permissionRepository.getAll();
    return permissions.map((permission) => permission.id);
  }
  async getUserPermissionIds() {
    const permissionIds = [];
    for (const permission in USER_PERMISSIONS) {
      if (USER_PERMISSIONS.hasOwnProperty(permission)) {
        const permissionEntity = await this.permissionRepository.findByCodes(
          USER_PERMISSIONS[permission]
        );
        if (permissionEntity) {
          permissionIds.push(permissionEntity.id);
        }
      }
    }
    return permissionIds;
  }

  async createRole(request: CreateAndUpdateRoleRequest): Promise<RoleDocument> {
    const roleToSave = { ...request };

    return await this.roleRepository.create(roleToSave);
  }

  async getListRoles(
    page: number,
    limit: number
  ): Promise<GetListRoleResponse> {
    const offset = page * limit;
    const { data: roles, total } = await this.roleRepository.getListRoles(
      offset,
      limit
    );
    return {
      data: roles,
      total,
    };
  }
  async getAllRoles(): Promise<string[]> {
    const roles = await this.roleRepository.getListRoles(0, 1000);
    return roles.data.map((role) => role.name);
  }

  async getListPermissionRole(role: string): Promise<string[]> {
    const res = await this.roleRepository.findByRoleName(role);

    const list = await this.permissionRepository.findByIds(res.permissions);
    return list;
  }

  async getRoleDetail(roleId: string): Promise<RoleDocument> {
    const role = await this.roleRepository.findById(roleId);
    return role;
  }

  async updateRole(
    roleId: string,
    request: CreateAndUpdateRoleRequest
  ): Promise<RoleDocument> {
    return this.roleRepository.update(roleId, request);
  }

  async deleteRole(roleId: string): Promise<string> {
    await this.roleRepository.softDelete(roleId);
    return "Role Deleted";
  }
}
