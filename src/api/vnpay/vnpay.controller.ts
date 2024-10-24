import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { VnpayService } from "./vnpay.service";
import { SkipAuth } from "src/config/skip.auth";
import { successResponse } from "src/common/dto/response.dto";
import { CommonException } from "src/common/exception/common.exception";

@Controller("vnpay")
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) {}

  @Post("create_payment_url")
  @SkipAuth()
  async createPaymentUrl(
    @Body() body: { amount: number },
    @Req() req: Request
  ) {
    try {
      const ipAddr = this.getClientIpAddress(req);
      const paymentUrl = await this.vnpayService.createPaymentUrl(body, ipAddr);

      return successResponse({ paymentUrl });
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getClientIpAddress(req: any): string {
    return (req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection?.socket?.remoteAddress) as string;
  }

  @Get("vnpay_return")
  @SkipAuth()
  async vnpayReturn(@Query() query: any) {
    try {
      const isValid = await this.vnpayService.verifyReturn(query);

      return successResponse({
        status: "success",
        txnRef: query.vnp_TxnRef,
        responseCode: query.vnp_ResponseCode,
      });
    } catch (error) {
      return successResponse({
        status: "fail",
        message: "Invalid secure hash",
      });
    }
  }
}
