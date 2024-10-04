import { Controller, Post, Get, Param, Body, HttpStatus } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { successResponse } from "src/common/dto/response.dto";
import { CommonException } from "src/common/exception/common.exception";
import { CreateBookingRequest } from "src/payload/request/booking.request";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { SkipAuth } from "src/config/skip.auth";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @SkipAuth()
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

  @SkipAuth()
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
