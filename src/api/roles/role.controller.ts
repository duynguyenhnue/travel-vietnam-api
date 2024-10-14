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
import { CommonException } from "../../common/exception/common.exception";
import { CommonExceptionFilter } from "../../common/exception/http-exception.filter";
import { RoleService } from "./role.service";
import { AuthJwtAccessProtected } from "../../common/guards/role.guard";
import { AUTH_PERMISSIONS } from "../../enums/auth.enum";
import {
  CreateAndUpdateRoleRequest,
  GetListRoleCommonRequest,
} from "../../payload/request/role.request";
import { successResponse } from "../../common/dto/response.dto";

@Controller("roles")
@UseFilters(CommonExceptionFilter)
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Post()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROLE_CREATE)
  async createRole(@Body() request: CreateAndUpdateRoleRequest) {
    try {
      const role = await this.service.createRole(request);
      return successResponse(role);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("search")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROLE_VIEW)
  async getListRoles(@Query() query: GetListRoleCommonRequest) {
    try {
      const roles = await this.service.getListRoles(query.page, query.limit);
      return successResponse(roles);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("get/:roleId")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROLE_VIEW)
  async getRoleDetail(@Param("roleId") roleId: string) {
    try {
      const role = await this.service.getRoleDetail(roleId);
      return successResponse(role);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":roleId")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROLE_UPDATE)
  async updateRole(
    @Param("roleId") roleId: string,
    @Body() request: CreateAndUpdateRoleRequest
  ) {
    try {
      const role = await this.service.updateRole(roleId, request);
      return successResponse(role);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("/permissions")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.PERMISSION_VIEW)
  async getPermissionRoles(@Body() request: { role: string }) {
    try {
      const permissions = await this.service.getListPermissionRole(
        request.role
      );
      return successResponse(permissions);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":roleId")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.ROLE_DELETE)
  async deleteRole(@Param("roleId") roleId: string) {
    try {
      const role = await this.service.deleteRole(roleId);
      return successResponse(role);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
