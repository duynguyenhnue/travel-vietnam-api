import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException, UploadedFiles } from "@nestjs/common";
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
import { Discount } from "src/schema/discount.schema";
import { CreateDiscountRequestDto, SearchDiscountRequestDto, UpdateDiscountRequestDto } from "src/payload/request/discounts.request";
import { DiscountResponseDto } from "src/payload/response/discounts.response";

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
  ) {}

  async create(
    createDiscountDto: CreateDiscountRequestDto,
  ): Promise<DiscountResponseDto> {
    const data = {
      ...createDiscountDto,
    };
    const createdDiscount = new this.discountModel(data);
    const savedDiscount = await createdDiscount.save();
    return plainToInstance(DiscountResponseDto, savedDiscount.toObject());
  }

  async getDiscountBySearch(
    query: SearchDiscountRequestDto
  ): Promise<{ data: DiscountResponseDto[]; total: number }> {
    const { code, type, value, limit, page } = query;
    const offset = page * limit;

    const filter: any = {};

    if (code && code.trim() !== "") {
      filter.code = new RegExp(code, "i");
    }
    if (type && type.trim() !== "") {
      filter.type = type;
    }
    if (value && !isNaN(Number(value)) && value != 0) {
      filter.value = { $lte: parseInt(value.toString(), 10) };
    }

    const discounts = await this.discountModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.discountModel.countDocuments(filter).exec();

    return { data: discounts, total };
  }

  async findOne(id: ObjectId): Promise<DiscountResponseDto> {
    const discount = await this.discountModel.findById(id).exec();

    if (!discount) {
      throw new CommonException("Hotel not found", HttpStatus.NOT_FOUND);
    }
    return plainToInstance(DiscountResponseDto, discount.toObject());
  }

  async update(
    id: ObjectId,
    updateDiscountDto: UpdateDiscountRequestDto,
  ): Promise<DiscountResponseDto> {
    await this.findOne(id);
    const newData = updateDiscountDto;
    const updatedDiscount = await this.discountModel
      .findByIdAndUpdate(id, newData, { new: true })
      .exec();
    return plainToInstance(DiscountResponseDto, updatedDiscount.toObject());
  }

  async delete(id: ObjectId): Promise<string> {
    await this.findOne(id);
    await this.discountModel.findByIdAndDelete(id).exec();
    return "Deleted successfully";
  }

}
