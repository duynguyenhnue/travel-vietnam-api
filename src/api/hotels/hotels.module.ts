import { Module } from "@nestjs/common";
import { HotelsService } from "./hotels.service";
import { HotelsController } from "./hotels.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "src/schema/hotel.schema";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    FirebaseModule,
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService],
})
export class HotelsModule {}
