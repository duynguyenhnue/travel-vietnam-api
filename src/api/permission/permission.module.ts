import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { Permission, PermissionSchema } from "../../schema/permission.schema";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";
import { PermissionRepository } from "../../repositories/permission.repository";
import { RoleRepository } from "src/repositories/role.repository";
import { RoleModule } from "../roles/role.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "JWT_SECRET",
      signOptions: { expiresIn: "15m" },
    }),
    forwardRef(() => RoleModule),
  ],

  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, MongooseModule, PermissionRepository],
})
export class PermissionModule {}
