import { Injectable } from "@nestjs/common";
import { UpdateStatusPermissionRequest } from "../../payload/request/permission.request";
import { GetListPermissionResponse } from "../../payload/response/permission.response";
import { PermissionRepository } from "../../repositories/permission.repository";
import { PermissionDocument } from "../../schema/permission.schema";
import { AUTH_ROLES } from "src/enums/auth.enum";
import { Status } from "src/enums/role.enum";

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async onModuleInit() {
    await this.createPermissions();
  }

  async createPermissions() {
    const permissions = this.getAllPermissions();
    for (const permission of permissions) {
      await this.permissionRepository.createOrUpdate(permission);
    }
  }

  getAllPermissions() {
    const permissionsArray = [];

    for (const group in AUTH_ROLES) {
      if (AUTH_ROLES.hasOwnProperty(group)) {
        const permissions = AUTH_ROLES[group];
        for (const key in permissions) {
          if (permissions.hasOwnProperty(key)) {
            permissionsArray.push({
              name: key,
              description: `${group} permission for ${key.toLowerCase()}`,
              code: key,
              group: group,
              status: permissions[key],
            });
          }
        }
      }
    }

    return permissionsArray;
  }

  async getListPermissions(): Promise<PermissionDocument[]> {
    const permissions = await this.permissionRepository.getListPermissions();
    return permissions;
  }

  async getPermissionDetail(permissionId: string): Promise<PermissionDocument> {
    return this.permissionRepository.findById(permissionId);
  }

  async updatePermission(
    permissionId: string,
    request: UpdateStatusPermissionRequest
  ): Promise<PermissionDocument> {
    const currentPermission = await this.permissionRepository.findById(
      permissionId
    );

    const newVersion = this.incrementVersion(currentPermission.version);
    const updatedRequest = {
      ...currentPermission,
      status: request.status,
      version: newVersion,
    };
    return this.permissionRepository.update(permissionId, updatedRequest);
  }

  async deletePermission(permissionId: string): Promise<string> {
    await this.permissionRepository.softDelete(permissionId);
    return "Permission Deleted";
  }

  private incrementVersion(currentVersion: string): string {
    const parts = currentVersion.split(".").map(Number);

    if (parts[2] < 9) {
      parts[2]++;
    } else if (parts[1] < 9) {
      parts[1]++;
      parts[2] = 0;
    } else {
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
    }

    return parts.join(".");
  }
}
