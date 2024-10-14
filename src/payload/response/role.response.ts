import { RoleDocument } from "../../schema/role.schema";

export class GetListRoleResponse {
  data: RoleDocument[];
  total: number;
}
