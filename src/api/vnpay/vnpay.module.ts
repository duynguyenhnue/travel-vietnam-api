import { Module } from "@nestjs/common";
import { VnpayService } from "./vnpay.service";
import { VnpayController } from "./vnpay.controller";
import { BookingModule } from "../booking/booking.module";
import { BookingService } from "../booking/booking.service";
import { RoomsModule } from "../rooms/rooms.module";

@Module({
  imports: [BookingModule, RoomsModule],
  providers: [VnpayService],
  controllers: [VnpayController],
})
export class VnpayModule {}
