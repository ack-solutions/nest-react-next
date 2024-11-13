import { ILoginSendOtpInput } from "@libs/types";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginSendOtpDTO implements ILoginSendOtpInput {

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

}

