import { RoleGuardEnum } from '@libs/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsObject,
    IsEnum,
} from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({ description: 'Permission name (unique identifier)' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Permission guard (e.g., Admin, Portal)',
    })
    @IsOptional()
    @IsEnum(RoleGuardEnum)
    guard?: string;

    @ApiPropertyOptional({ description: 'Permission description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Permission category for grouping' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Additional metadata' })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class UpdatePermissionDto {
    @ApiPropertyOptional({ description: 'Permission name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Permission guard' })
    @IsOptional()
    @IsEnum(RoleGuardEnum)
    guard?: RoleGuardEnum;

    @ApiPropertyOptional({ description: 'Permission description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Permission category' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Additional metadata' })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class GetPermissionsQueryDto {
    @ApiPropertyOptional({ description: 'Search term' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by category' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Filter by guard' })
    @IsOptional()
    @IsEnum(RoleGuardEnum)
    guard?: RoleGuardEnum;

    @ApiPropertyOptional({ description: 'Limit results' })
    @IsOptional()
    limit?: number;
}
