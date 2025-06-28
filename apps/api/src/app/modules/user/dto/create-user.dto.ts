import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsArray } from 'class-validator';

import { User } from '../user.entity';


export class CreateUserDTO extends PartialType(User) {

    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsOptional()
    override password?: string;

    @ApiProperty({
        type: [String],
    })
    @IsArray()
    @IsOptional()
    roles?: string[];

}
