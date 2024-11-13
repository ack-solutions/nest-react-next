import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserDTO } from "../../user/dto/user.dto";
import { ILoginSuccess } from "@libs/types";


export class LoginSuccessDTO implements ILoginSuccess {

  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty({ type: () =>  UserDTO })
  @IsString()
  user: UserDTO;

}

