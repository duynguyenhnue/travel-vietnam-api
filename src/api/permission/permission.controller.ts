import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from "@nestjs/common";
import { CommonExceptionFilter } from "../../common/exception/http-exception.filter";
import { CommonException } from "../../common/exception/common.exception";
import { successResponse } from "../../common/dto/response.dto";
import { PermissionService } from "./permission.service";
import {
  GetListPermissionCommonRequest,
  UpdateStatusPermissionRequest,
} from "../../payload/request/permission.request";
import { SkipAuth } from "../../config/skip.auth";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";

@Controller("permissions")
@UseFilters(CommonExceptionFilter)
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Get()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.PERMISSION_VIEW)
  async getListPermissions() {
    try {
      const permissions = await this.service.getListPermissions();
      return successResponse(permissions);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("get/:permissionId")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.PERMISSION_VIEW)
  async getPermissionDetail(@Param("permissionId") permissionId: string) {
    try {
      const permission = await this.service.getPermissionDetail(permissionId);
      return successResponse(permission);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put("update/:permissionId")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.PERMISSION_UPDATE)
  async updatePermission(
    @Param("permissionId") permissionId: string,
    @Body() request: UpdateStatusPermissionRequest
  ) {
    try {
      const permission = await this.service.updatePermission(
        permissionId,
        request
      );
      return successResponse(permission);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
