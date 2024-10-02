import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { TourService } from "./tour.service";
import { successResponse } from "src/common/dto/response.dto";
import { CommonException } from "src/common/exception/common.exception";
import {
  CreateTourDto,
  GetTourRequestDto,
  SearchTourRequestDto,
  UpdateTourDto,
} from "src/payload/request/tour.request";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SkipAuth } from "src/config/skip.auth";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";

@Controller("tours")
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @SkipAuth()
  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  async createTour(
    @Body() createTourDto: CreateTourDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      const savedTour = await this.tourService.createTour(
        createTourDto,
        files[0]
      );
      return successResponse(savedTour);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  async updateTour(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() updateTourDto: UpdateTourDto
  ) {
    try {
      const updatedTour = await this.tourService.updateTour(id, updateTourDto);
      return successResponse(updatedTour);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  async deleteTour(@Param("id", ParseObjectIdPipe) id: string) {
    try {
      await this.tourService.deleteTour(id);
      return successResponse("Successfully deleted");
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  @SkipAuth()
  @Get("get/:id")
  async getSingleTour(@Param("id", ParseObjectIdPipe) id: string) {
    try {
      const tour = await this.tourService.getSingleTour(id);
      return successResponse(tour);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SkipAuth()
  @Get()
  async getAllTours(@Query() query: GetTourRequestDto) {
    try {
      const tours = await this.tourService.getAllTours(query);
      return successResponse(tours);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SkipAuth()
  @Get("search")
  async getTourBySearch(@Query() query: SearchTourRequestDto) {
    try {
      const tours = await this.tourService.getTourBySearch(query);
      return successResponse(tours);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SkipAuth()
  @Get("featured")
  async getFeaturedTours() {
    try {
      const featuredTours = await this.tourService.getFeaturedTours();
      return successResponse(featuredTours);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
