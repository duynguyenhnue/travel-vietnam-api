import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateBookingRequest } from "src/payload/request/booking.request";
import { Booking, BookingDocument } from "src/schema/booking.schema";
import { TourService } from "../tour/tour.service";
import { UserService } from "../users/users.service";

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,

    private readonly tourService: TourService,
    private readonly userService: UserService
  ) {}

  async createBooking(
    createBookingDto: CreateBookingRequest
  ): Promise<Booking> {
    await this.tourService.getSingleTour(createBookingDto.tourId);
    await this.userService.findUserById(createBookingDto.userId);

    const newBooking = new this.bookingModel(createBookingDto);
    return await newBooking.save();
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId).exec();
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingModel.find().exec();
  }
}
