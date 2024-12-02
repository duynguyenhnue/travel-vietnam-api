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
  Req,
} from "@nestjs/common";
import { TourService } from "./tour.service";
import { successResponse } from "src/common/dto/response.dto";
import { CommonException } from "src/common/exception/common.exception";
import {
  CreateTourDto,
  SearchTourRequestDto,
  UpdateTourDto,
} from "src/payload/request/tour.request";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SkipAuth } from "src/config/skip.auth";
import { ParseObjectIdPipe } from "src/config/parse-objectId-pipe";
import { NotificationService } from "../notification/notification.service";
import { AuthJwtAccessProtected } from "src/common/guards/role.guard";
import { AUTH_PERMISSIONS } from "src/enums/auth.enum";

@Controller("tours")
export class TourController {
  constructor(
    private readonly tourService: TourService,
    private readonly notificationService: NotificationService
  ) {}

  @Post()
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.TOUR_CREATE)
  @UseInterceptors(FilesInterceptor("files"))
  async createTour(
    @Body() createTourDto: CreateTourDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req
  ) {
    try {
      const savedTour = await this.tourService.createTour(
        createTourDto,
        files,
        req.user._id
      );
      this.notificationService.logNotification({
        title: "New Tour Created",
        message: `New tour ${savedTour.title} has been created`,
        id: req.user.id,
        avatar: req.user.avatar,
        name: req.user.fullName,
        action: "create",
      });
      return successResponse(savedTour);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.TOUR_UPDATE)
  @UseInterceptors(FilesInterceptor("files"))
  async updateTour(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() updateTourDto: UpdateTourDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req
  ) {
    try {
      const updatedTour = await this.tourService.updateTour(
        id,
        updateTourDto,
        files
      );
      this.notificationService.logNotification({
        title: "Update Tour Created",
        message: `Update tour ${updatedTour.title} has been created`,
        id: req.user.id,
        avatar: req.user.avatar,
        name: req.user.fullName,
        action: "create",
      });
      return successResponse(updatedTour);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete("/cancel/:id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.TOUR_DELETE)
  async cancelTour(@Param("id", ParseObjectIdPipe) id: string) {
    try {
      await this.tourService.cancelTour(id);
      return successResponse("Successfully cancel tour");
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("get/:id")
  @SkipAuth()
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
  @Get("search")
  async getTourBySearch(@Query() query: SearchTourRequestDto, @Req() req) {
    try {
      const authHeader = req.headers.authorization;
      let user = null;
      if (authHeader) {
        const token = authHeader.split(" ")[1];

        user = await this.tourService.validateToken(token);
      }

      const tours = await this.tourService.getTourBySearch(query, user);

      return successResponse(tours);
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @AuthJwtAccessProtected(AUTH_PERMISSIONS.TOUR_DELETE)
  async deleteTour(@Param("id", ParseObjectIdPipe) id: string, @Req() req) {
    try {
      const tours = await this.tourService.deleteTour(id);

      this.notificationService.logNotification({
        title: "Update Tour Created",
        message: `Update tour ${tours.title} has been created`,
        id: req.user.id,
        avatar: req.user.avatar,
        name: req.user.fullName,
        action: "create",
      });
      return successResponse("Successfully delete tour");
    } catch (error) {
      throw new CommonException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
