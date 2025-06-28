import { PermissionsEnum } from '@libs/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';


export class UpdateRoleDTO {

    @ApiPropertyOptional({
        type: String,
        description: 'The name of the tag',
    })
    @IsString()
    @IsNotEmpty()
    name: string;


    @ApiPropertyOptional({
        type: [String],
        enum: PermissionsEnum,
        description: 'The permissions of the role',
    })
    @IsArray()
    @IsNotEmpty()
    permissions: any[];

}
