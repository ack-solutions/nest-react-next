import { IDeleteAccountInput } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class DeleteAccountInputDTO implements IDeleteAccountInput {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

}
