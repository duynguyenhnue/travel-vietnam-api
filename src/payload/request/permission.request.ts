import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { GroupPermission, Status } from "../../enums/permission.enum";
import { AUTH_PERMISSIONS } from "../../enums/auth.enum";

export class UpdateStatusPermissionRequest {
  @IsEnum(Status)
  status: Status;
}

export class GetListPermissionCommonRequest {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
