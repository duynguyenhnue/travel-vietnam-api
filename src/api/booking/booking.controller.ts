import { Controller, Post, Get, Param, Body, HttpStatus } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { successResponse } from "src/common/dto/response.dto";
import { CommonException } from "src/common/exception/common.exception";
import { CreateBookingRequest } from "src/payload/request/booking.request";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.BOOKING_CREATE)
  async createBooking(@Body() createBookingDto: CreateBookingRequest) {
    try {
      const savedBooking = await this.bookingService.createBooking(
        createBookingDto
      );
      return successResponse(savedBooking);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.BOOKING_CANCEL)
  async cancelBooking(@Param("id", ParseObjectIdPipe) id: string) {
    try {
      await this.bookingService.cancelBooking(id);
      return successResponse("Booking has been cancelled");
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.BOOKING_VIEW)
  async getBooking(@Param("id", ParseObjectIdPipe) id: string) {
    try {
      const booking = await this.bookingService.getBookingById(id);
      return successResponse(booking);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async getAllBookings() {
    try {
      const bookings = await this.bookingService.getAllBookings();
      return successResponse(bookings);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
