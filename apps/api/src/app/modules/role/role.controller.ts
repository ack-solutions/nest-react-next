import { NestAuthAuthGuard } from '@ackplus/nest-auth';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { RoleService } from './role.service';


@Controller('role')
@ApiTags('Role')
@UseGuards(NestAuthAuthGuard)
export class RoleController {

    constructor(private service: RoleService) {
    }

    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({
        status: 200,
        description: 'The list of roles has been successfully retrieved.',
    })
    @Get()
    async getAllRoles(@Query() query: any) {
        return this.service.getAllRoles(query);
    }

    @ApiOperation({ summary: 'Get a role by id' })
    @ApiParam({
        name: 'id',
        description: 'The id of the role',
    })
    @ApiResponse({
        status: 200,
        description: 'The role has been successfully retrieved.',
    })
    @Get('/by-id/:id')
    async getRoleById(@Param('id') id: string) {
        return this.service.getRoleById(id);
    }

    @ApiOperation({ summary: 'Get a roles by guard' })
    @ApiResponse({
        status: 200,
        description: 'The roles has been successfully retrieved.',
    })
    @Get(':guard')
    async getRoleByGuard(@Param('guard') guard: string) {
        return this.service.getRoleByGuard(guard);
    }

    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({
        status: 201,
        description: 'The role has been successfully created.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
    })
    @Post()
    async createRole(@Body() body: CreateRoleDTO) {
        return this.service.createRole(body);
    }

    @ApiOperation({ summary: 'Update a role' })
    @ApiResponse({
        status: 200,
        description: 'The role has been successfully updated.',
    })
    @Put(':id')
    async updateRole(@Param('id') id: string, @Body() body: UpdateRoleDTO) {
        return this.service.updateRole(id, body);
    }

    @ApiOperation({ summary: 'Delete a role' })
    @ApiResponse({
        status: 200,
        description: 'The role has been successfully deleted.',
    })
    @Delete(':id')
    deleteRole(@Param('id') id: string) {
        return this.service.deleteRole(id);
    }

}
