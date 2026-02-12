import { NestAuthAuthGuard, NestAuthRoles } from '@ackplus/nest-auth';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
    CreatePermissionDto,
    GetPermissionsQueryDto,
    UpdatePermissionDto,
} from './dto/permission.dto';
import { PermissionService } from './permission.service';
import { RoleGuardEnum, RoleNameEnum } from '@libs/types';

@Controller('permission')
@ApiTags('Permission')
@UseGuards(NestAuthAuthGuard)
export class PermissionController {
    constructor(private service: PermissionService) { }

    @ApiOperation({ summary: 'Get all permissions' })
    @ApiResponse({
        status: 200,
        description: 'The list of permissions has been successfully retrieved.',
    })
    @Get()
    async getPermissions(@Query() query: GetPermissionsQueryDto) {
        return this.service.getPermissions(query);
    }

    @ApiOperation({ summary: 'Get permission by id' })
    @ApiParam({ name: 'id', description: 'The permission id' })
    @ApiResponse({
        status: 200,
        description: 'The permission has been successfully retrieved.',
    })
    @Get('/by-id/:id')
    async getPermissionById(@Param('id') id: string) {
        return this.service.getPermissionById(id);
    }

    @ApiOperation({ summary: 'Get permissions by guard' })
    @ApiParam({ name: 'guard', description: 'The guard name' })
    @ApiResponse({
        status: 200,
        description: 'The permissions have been successfully retrieved.',
    })
    @Get('/guard/:guard')
    async getPermissionsByGuard(@Param('guard') guard: string) {
        return this.service.getPermissionsByGuard(guard);
    }

    @ApiOperation({ summary: 'Get all permission categories' })
    @ApiResponse({
        status: 200,
        description: 'The categories have been successfully retrieved.',
    })
    @Get('/categories')
    async getCategories() {
        return this.service.getCategories();
    }

    @ApiOperation({ summary: 'Get all guards' })
    @ApiResponse({
        status: 200,
        description: 'The guards have been successfully retrieved.',
    })
    @Get('/guards')
    async getGuards() {
        return this.service.getGuards();
    }

    @ApiOperation({ summary: 'Search permissions' })
    @ApiResponse({
        status: 200,
        description: 'Search results retrieved successfully.',
    })
    @Get('/search')
    async searchPermissions(
        @Query('query') query: string,
        @Query('guard') guard?: string,
        @Query('limit') limit?: number,
    ) {
        return this.service.searchPermissions(query, guard, limit);
    }

    @ApiOperation({ summary: 'Create a new permission' })
    @ApiResponse({
        status: 201,
        description: 'The permission has been successfully created.',
    })
    @Post()
    async createPermission(@Body() body: CreatePermissionDto) {
        return this.service.createPermission(body);
    }

    @ApiOperation({ summary: 'Create multiple permissions' })
    @ApiResponse({
        status: 201,
        description: 'The permissions have been successfully created.',
    })
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @Post('/bulk')
    async createPermissions(@Body() body: CreatePermissionDto[]) {
        return this.service.createPermissions(body);
    }

    @ApiOperation({ summary: 'Update a permission' })
    @ApiParam({ name: 'id', description: 'The permission id' })
    @ApiResponse({
        status: 200,
        description: 'The permission has been successfully updated.',
    })
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @Put(':id')
    async updatePermission(
        @Param('id') id: string,
        @Body() body: UpdatePermissionDto,
    ) {
        return this.service.updatePermission(id, body);
    }

    @ApiOperation({ summary: 'Delete a permission' })
    @ApiParam({ name: 'id', description: 'The permission id' })
    @ApiResponse({
        status: 200,
        description: 'The permission has been successfully deleted.',
    })
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @Delete(':id')
    async deletePermission(@Param('id') id: string) {
        return this.service.deletePermission(id);
    }
}
