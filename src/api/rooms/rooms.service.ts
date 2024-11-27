import { HttpStatus, Injectable, UploadedFiles } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { plainToInstance } from "class-transformer";
import { Room } from "src/schema/room.schema";
import {
  CreateRoomRequestDto,
  SearchRoomRequestDto,
  UpdateRoomRequestDto,
} from "src/payload/request/rooms.request";
import { RoomResponseDto } from "src/payload/response/room.response";
import { FirebaseService } from "../firebase/firebase.service";
import { Folder } from "src/enums/folder.enum";
import { HotelsService } from "../hotels/hotels.service";
import { CommonException } from "src/common/exception/common.exception";

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly firebaseService: FirebaseService,
    private readonly hotelsService: HotelsService
  ) {}

  async roomStatus(roomId: ObjectId, status: boolean) {
    const room = await this.roomModel.findById(roomId).exec();

    if (!room) {
      throw new CommonException(
        `Room with ID { ${roomId} } not found`,
        HttpStatus.NOT_FOUND
      );
    }

    room.status = status;

    await room.save();
  }

  async create(
    createRoomDto: CreateRoomRequestDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<RoomResponseDto> {
    await this.hotelsService.findOne(createRoomDto.hotelId);

    const images = await Promise.all(
      (files || []).map(async (file) => {
        return await this.firebaseService.uploadImage(file, Folder.ROOMS);
      })
    );

    const newRoom = {
      ...createRoomDto,
      images,
    };

    const createdRoom = new this.roomModel(newRoom);
    const savedRoom = await createdRoom.save();
    return plainToInstance(RoomResponseDto, savedRoom.toObject());
  }

  async searchRoomsByHotel(
    query: SearchRoomRequestDto
  ): Promise<{ data: RoomResponseDto[]; total: number }> {
    const { limit = 6, page = 0, price, maxOccupancy, roomType } = query;
    const offset = page * limit;

    const filter: any = {};
    filter.hotelId = query.hotelId;

    if (roomType) {
      filter.roomType = roomType;
    }

    if (price) {
      filter.price = { $lte: price };
    }

    if (maxOccupancy) {
      filter.maxOccupancy = maxOccupancy;
    }

    const data = await this.roomModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.roomModel.countDocuments(filter).exec();

    return {
      data: data.map((hotel) =>
        plainToInstance(RoomResponseDto, hotel.toObject())
      ),
      total,
    };
  }

  async findRoomByHotelId(
    hotelId: ObjectId,
    roomId: ObjectId
  ): Promise<RoomResponseDto> {
    await this.hotelsService.findOne(hotelId);

    const room = await this.roomModel.findOne({ _id: roomId, hotelId }).exec();

    if (!room) {
      throw new CommonException(
        `Room with ID { ${roomId} } not found in Hotel with ID { ${hotelId} }`,
        HttpStatus.NOT_FOUND
      );
    }

    return plainToInstance(RoomResponseDto, room.toObject());
  }

  async update(
    id: string,
    updateRoomDto: UpdateRoomRequestDto
  ): Promise<RoomResponseDto> {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
    return plainToInstance(RoomResponseDto, updatedRoom.toObject());
  }

  async delete(id: string): Promise<void> {
    await this.roomModel.findByIdAndDelete(id).exec();
  }
}
