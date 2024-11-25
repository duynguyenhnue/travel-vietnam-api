import { DiscountType } from "src/enums/discount.enum";

export class DiscountResponseDto {
  code: string;

  description: string;

  value: number;

  type: DiscountType;

  min_order_value: number;

  max_discount_value: number;

  startDate: Date;

  endDate: Date;
}
