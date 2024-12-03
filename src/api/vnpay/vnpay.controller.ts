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
import { BookingService } from "../booking/booking.service";
import { BookingStatus, BookingType } from "src/enums/booking.enum";

@Controller("vnpay")
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) {}

  @Post("create_payment_url")
  async createPaymentUrl(
    @Body()
    body: {
      amount: number;
      bookingType: BookingType;
      guestSize: number;
      orderId: string;
      roomId: string;
      startDate: string;
      endDate: string;
    },
    @Req() req
  ) {
    try {
      const ipAddr = this.getClientIpAddress(req);
      const paymentUrl = await this.vnpayService.createPaymentUrl(
        body,
        req.user._id
      );

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
  async vnpayReturn(@Query() query: any) {
    try {
      const isValid = await this.vnpayService.verifyReturn(query);

      if (isValid) {
        const booking = await this.vnpayService.getTypeBooking(
          query.vnp_TxnRef,
          BookingStatus.CONFIRMED
        );
        // const room = await this.vnpayService.roomStatus(booking.roomId);

        return successResponse({
          status: BookingStatus.CONFIRMED,
          bookingType: booking.bookingType,
          amount: query.vnp_Amount / 100,
          txnRef: query.vnp_TxnRef,
          responseCode: query.vnp_ResponseCode,
        });
      } else {
        await this.vnpayService.getTypeBooking(
          query.vnp_TxnRef,
          BookingStatus.CANCELLED
        );

        return successResponse({
          status: BookingStatus.CANCELLED,
          amount: query.vnp_Amount / 100,
          txnRef: query.vnp_TxnRef,
          message: "Your order has been canceled or an error occurred.",
        });
      }
    } catch (error) {
      return successResponse({
        status: "ERROR",
        amount: query.vnp_Amount / 100,
        txnRef: query.vnp_TxnRef,
        message: "Invalid secure hash",
      });
    }
  }
}
