import { Module, forwardRef } from "@nestjs/common";
import { DiscountService } from "./discounts.service";
import { DiscountController } from "./discounts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleModule } from "../roles/role.module";
import { PermissionModule } from "../permission/permission.module";
import { DiscountSchema } from "src/schema/discount.schema";
import { Discount } from "src/schema/discount.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }]),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService, MongooseModule],
})
export class DiscountsModule {}
