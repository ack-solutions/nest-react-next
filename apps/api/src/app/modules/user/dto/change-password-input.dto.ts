import { IChangePasswordInput } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class ChangePasswordInputDTO implements IChangePasswordInput {

    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    password: string;

}
