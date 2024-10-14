import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Role } from "../schema/role.schema";
import { RoleDocument } from "../schema/role.schema";
import { PermissionRepository } from "./permission.repository";
import { CommonException } from "src/common/exception/common.exception";

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    private readonly permissionRepository: PermissionRepository
  ) {}

  async findOneAndUpdate(roleDocument: Partial<RoleDocument>) {
    const role = await this.roleModel
      .findOneAndUpdate({ name: roleDocument.name }, roleDocument, {
        upsert: true,
        new: true,
      })
      .exec();
    return role;
  }

  async create(roleDocument: Partial<RoleDocument>) {
    const role = new this.roleModel(roleDocument);
    return await role.save();
  }

  async findById(id: string): Promise<RoleDocument> {
    const objectId = new Types.ObjectId(id);
    const role = await this.roleModel
      .findOne({ _id: id, isDeleted: false })
      .exec();

    if (!role) {
      throw new CommonException("Role not found", HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async findByRoleId(roleId: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ roleId }).exec();
  }

  async findByRoleName(name: string): Promise<RoleDocument | null> {
    const role = await this.roleModel.findOne({ name }).exec();

    if (!role) {
      throw new CommonException("Role not found", HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async getListRoles(
    offset: number,
    limit: number
  ): Promise<{ data: RoleDocument[]; total: number }> {
    const data = await this.roleModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    const total = await this.roleModel
      .countDocuments({ isDeleted: false })
      .exec();
    return { data, total };
  }

  async update(
    roleId: string,
    roleDocument: Partial<RoleDocument>
  ): Promise<RoleDocument | null> {
    return this.roleModel
      .findByIdAndUpdate(roleId, roleDocument, {
        new: true,
      })
      .exec();
  }

  async softDelete(roleId: string): Promise<void> {
    await this.roleModel.findByIdAndUpdate(roleId, {
      isDeleted: true,
    });
  }
}
