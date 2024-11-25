import {
  IsString,
  IsNotEmpty,
  IsEmail,
} from "class-validator";

export class EmailRequestDto {
  @IsEmail()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
