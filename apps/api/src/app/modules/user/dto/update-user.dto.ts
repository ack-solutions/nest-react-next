import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

import { User } from '../user.entity';


export class UpdateUserDTO extends PartialType(User) {

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

    @ApiProperty({
        type: Boolean,
        description: 'Enable or disable MFA for the user',
    })
    @IsBoolean()
    @IsOptional()
    isMfaEnabled?: boolean;

}
