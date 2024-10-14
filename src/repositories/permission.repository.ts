import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Permission, PermissionDocument } from "../schema/permission.schema";
import { Status } from "src/enums/permission.enum";

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>
  ) {}

  async create(permissionDocument: Partial<PermissionDocument>) {
    const permission = new this.permissionModel(permissionDocument);
    return await permission.save();
  }
  async createOrUpdate(permissionDocument: Partial<PermissionDocument>) {
    return await this.permissionModel
      .findOneAndUpdate({ code: permissionDocument.code }, permissionDocument, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec();
  }

  async getListPermissions(): Promise<PermissionDocument[]> {
    const data = await this.permissionModel
      .find({ status: Status.PUBLISHED })
      .sort({ createdAt: -1 })
      .exec();

    return data;
  }

  async getAll(): Promise<PermissionDocument[]> {
    const data = await this.permissionModel.find().exec();
    return data;
  }

  async findById(id: string): Promise<PermissionDocument> {
    const objectId = new Types.ObjectId(id);
    return this.permissionModel.findById(objectId).exec();
  }

  async findByIds(ids: string[]): Promise<string[]> {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const permissions = await this.permissionModel
      .find({ _id: { $in: objectIds } }, "name")
      .exec();
    return permissions.map((permission) => permission.name);
  }

  async findByPermissionId(
    permissionId: string
  ): Promise<PermissionDocument | null> {
    return this.permissionModel.findOne({ permissionId }).exec();
  }

  async update(
    permissionId: string,
    permissionDocument: Partial<PermissionDocument>
  ): Promise<PermissionDocument | null> {
    return this.permissionModel
      .findByIdAndUpdate(permissionId, permissionDocument, {
        new: true,
      })
      .exec();
  }

  async softDelete(permissionId: string): Promise<void> {
    await this.permissionModel.findByIdAndUpdate(permissionId, {
      isDeleted: true,
    });
  }

  async findByCodes(code: string): Promise<PermissionDocument> {
    return this.permissionModel.findOne({ code }).exec();
  }
}
