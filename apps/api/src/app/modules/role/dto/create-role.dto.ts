import { PermissionsEnum, RoleGuardEnum } from '@libs/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { IsString } from 'class-validator';


export class CreateRoleDTO {

    @ApiPropertyOptional({
        type: String,
        description: 'The name of the tag',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        type: String,
        enum: RoleGuardEnum,
        description: 'The guard of the role',
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(RoleGuardEnum)
    guard: RoleGuardEnum;


    @ApiPropertyOptional({
        type: [String],
        enum: PermissionsEnum,
        description: 'The permissions of the role',
    })
    @IsArray()
    @IsNotEmpty()
    permissions: string[];


    @ApiPropertyOptional({
        type: String,
        description: 'The organization id of the role',
        format: 'uuid',
    })
    @IsString()
    @IsOptional()
    organizationId: string;

}
