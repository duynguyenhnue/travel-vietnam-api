import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateBookingRequest, SearchBookingRequestDto } from "src/payload/request/booking.request";
import { Booking, BookingDocument } from "src/schema/booking.schema";
import { TourService } from "../tour/tour.service";
import { UserService } from "../users/users.service";
import { BookingStatus, BookingType } from "src/enums/booking.enum";
import { Tour, TourDocument } from "src/schema/tour.schema";
import { CommonException } from "src/common/exception/common.exception";

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,

    private readonly tourService: TourService,
    private readonly userService: UserService
  ) {}

  async createBooking(
    createBookingDto: CreateBookingRequest
  ): Promise<Booking> {
    const user = await this.userService.findUserById(createBookingDto.userId);

    if (createBookingDto.bookingType === BookingType.TOURS) {
      const tour = await this.tourService.getSingleTour(
        createBookingDto.orderId
      );
      if (
        tour.customerIds.length + createBookingDto.guestSize >
        tour.maxGroupSize
      ) {
        throw new NotFoundException(
          `The tour is full with only a maximum of ${tour.maxGroupSize} guests`
        );
      }
      await this.tourModel
        .findByIdAndUpdate(
          createBookingDto.orderId,
          { $push: { customerIds: user._id } },
          { new: true }
        )
        .exec();
    }

    const newBooking = { ...createBookingDto, status: BookingStatus.PENDING };
    const createBooking = new this.bookingModel(newBooking);

    return await createBooking.save();
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId).exec();
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    return booking;
  }

  async getBookingByCode(
    code: string,
    status: BookingStatus
  ): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ vnpayCode: code }).exec();
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    booking.status = status;

    await this.bookingModel.findByIdAndUpdate(booking._id, booking, {
      new: true,
    });

    return booking;
  }

  async getAllBookings(id: string): Promise<{ data: Booking[]; total: number }> {
    const total = await this.bookingModel.countDocuments({ userId: id }).exec();
    const bookings = await this.bookingModel.find({ userId: id }).exec();
    console.log(total);
    return { data: bookings, total };
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const booking = await this.getBookingById(bookingId);
    booking.status = BookingStatus.CANCELLED;
    await this.tourModel
      .findByIdAndUpdate(bookingId, booking, { new: true })
      .exec();
  }

  async getBookingBySearch(
    query: SearchBookingRequestDto
  ): Promise<{ data: Booking[]; total: number }> {
    console.log(query);

    const { amount, bookingType, status, limit, page } = query;
    const offset = page * limit;
    const filter: any = {
      isDeleted: false,
    };

    if (amount) {
      filter.amount = amount;
    }

    if (bookingType) {
      filter.bookingType = bookingType;
    }

    if (status) {
      filter.status = status;
    }

    const bookings = await this.bookingModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.bookingModel.countDocuments(filter).exec();

    return { data: bookings, total };
  }
}
