import { IChangeEmailInput } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';


export class ChangeEmailInputDTO implements IChangeEmailInput {

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

}
