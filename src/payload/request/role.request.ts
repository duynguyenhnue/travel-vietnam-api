import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { Status } from "src/enums/role.enum";

export class CreateAndUpdateRoleRequest {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  permissions: string[];

  @IsEnum(Status)
  status: Status;
}

export class GetListRoleCommonRequest {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(5)
  limit: number;
}
