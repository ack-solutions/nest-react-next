import { ILoginSendOtpInput } from "@mlm/types";
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

