import { Address, Phone } from "../request/users.request";

export class UserResponse {
  fullName: string;
  email: string;
  dateOfBirth: string;
  address: Address;
  phone: Phone;
}
