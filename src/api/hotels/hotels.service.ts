import { HttpStatus, Injectable, UploadedFiles } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { plainToInstance } from "class-transformer";
import { Hotel } from "src/schema/hotel.schema";
import {
  CreateHotelRequestDto,
  SearchHotelsRequestDto,
  UpdateHotelRequestDto,
} from "src/payload/request/hotels.request";
import { HotelResponseDto } from "src/payload/response/hotels.response";
import { FirebaseService } from "../firebase/firebase.service";
import { Folder } from "src/enums/folder.enum";
import { CommonException } from "src/common/exception/common.exception";

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    private readonly firebaseService: FirebaseService
  ) {}

  async create(
    createHotelDto: CreateHotelRequestDto,
    files: Express.Multer.File[]
  ): Promise<HotelResponseDto> {
    const photos = await Promise.all(
      (files || []).map(async (file) => {
        return await this.firebaseService.uploadImage(file, Folder.HOTELS);
      })
    );

    const data = {
      ...createHotelDto,
      photos,
    };

    const createdHotel = new this.hotelModel(data);
    const savedHotel = await createdHotel.save();
    return plainToInstance(HotelResponseDto, savedHotel.toObject());
  }
  
  async getHotelBySearch(
    query: SearchHotelsRequestDto
  ): Promise<{ data: HotelResponseDto[]; total: number }> {
    const { name, maxGroupSize, limit, page, price, status } = query;
    const offset = page * limit;

    const filter: any = {
    };
  
    if (name && name.trim() !== "") {
      filter.name = new RegExp(name, "i");
    }
  
    if (maxGroupSize && !isNaN(Number(maxGroupSize))) {
      filter.maxGroupSize = { $gte: parseInt(maxGroupSize.toString(), 10) };
    }
    
    if (price && !isNaN(Number(price))) {
      filter.price = { $lte: parseInt(price.toString(), 10) };
    }

    if (status && status.trim() !== "") {
      filter.status = status;
    }

    const hotels = await this.hotelModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    
    console.log(hotels);

    const hotelsMap: HotelResponseDto[] = await Promise.all(
      hotels.map(async (hotel) => {
        return { ...hotel.toObject() };  
      })
    );

    const total = await this.hotelModel.countDocuments(filter).exec();

    return { data: hotelsMap, total };
  }
  

  async findOne(id: ObjectId): Promise<HotelResponseDto> {
    const hotel = await this.hotelModel.findById(id).exec();

    if (!hotel) {
      throw new CommonException("Hotel not found", HttpStatus.NOT_FOUND);
    }
    return plainToInstance(HotelResponseDto, hotel.toObject());
  }

  async update(
    id: ObjectId,
    updateHotelDto: UpdateHotelRequestDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<HotelResponseDto> {
    await this.findOne(id);

    const newData = updateHotelDto;

    if (files) {
      await Promise.all(
        files.map(async (file) => {
          newData.images.push(
            await this.firebaseService.uploadImage(file, Folder.HOTELS)
          );
        })
      );
    }

    const updatedHotel = await this.hotelModel
      .findByIdAndUpdate(id, newData, { new: true })
      .exec();
    return plainToInstance(HotelResponseDto, updatedHotel.toObject());
  }

  async delete(id: ObjectId): Promise<string> {
    await this.findOne(id);
    await this.hotelModel.findByIdAndDelete(id).exec();
    return "Deleted successfully";
  }
}
