import {
  Get,
  Put,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiPropertyOptional, ApiQuery, ApiResponse } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../guard/jwt-auth.guard';
// import { RolesGuard } from '../guard/roles.guard';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { merge } from 'lodash';
import { DeleteManyInputDTO, GetManyInputDTO } from './dto/get-many-input.dto';
import { ICrudControllerOptions, IFindOptions, IPaginationResult } from '@libs/types';
import { ICrudService } from '../../types/crud.service';


export function CrudController(dto, options?: ICrudControllerOptions) {

  class PaginationDto {
    @ApiPropertyOptional()
    count: number;

    @ApiPropertyOptional({
      type: [dto]
    })
    items: typeof dto[];
  }

  class CountDto {
    @ApiPropertyOptional()
    count: number;

  }
  const CreateDTO = options?.createDto || dto
  const UpdateDTO = options?.updateDto || dto

  abstract class CrudControllerClass<T> {
    protected constructor(readonly crudService: ICrudService<T>) { }


    @ApiOperation({ summary: 'Count' })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
    })
    @ApiResponse({
      type: CountDto,
      status: HttpStatus.OK,
      description: 'Success',
    })
    @ApiQuery({
      type: GetManyInputDTO
    })
    @Get('count')
    async count(
      @Query() filter: FindManyOptions,
      ..._extra: any
    ): Promise<any> {
      const count = this.crudService.count(filter);
      return { count }
    }

    @ApiOperation({ summary: 'Get Many' })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
    })
    @ApiResponse({
      type: PaginationDto,
      status: HttpStatus.OK,
      description: 'Success',
    })
    @ApiQuery({
      type: GetManyInputDTO
    })
    @Get()
    async getMany(
      @Query() filter?: IFindOptions,
      ..._extra: any
    ): Promise<IPaginationResult<T>> {
      return this.crudService.getMany(filter);
    }

    @ApiOperation({ summary: 'Get By ID' })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
    })
    @ApiResponse({
      type: dto,
      status: HttpStatus.OK,
      description: 'Success',
    })
    @Get(':id')
    async getOne(
      @Param('id') id: string,
      @Query() queryParams: FindOneOptions<T>,
      ..._extra: any
    ): Promise<T> {
      const options: any = {
        where: { id: id }
      }
      return this.crudService.getOne(merge(queryParams, options));
    }


    @ApiOperation({ summary: 'Create' })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
    })
    @ApiResponse({
      type: dto,
      status: HttpStatus.OK,
      description: 'Success',
    })
    @ApiBody({
      type: CreateDTO
    })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
      @Body() entity: DeepPartial<T>,
      ..._extra: any
    ): Promise<T> {
      return this.crudService.create(entity);
    }

    @ApiOperation({ summary: 'Update' })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
    })
    @ApiResponse({
      type: dto,
      status: HttpStatus.OK,
      description: 'Success',
    })
    @ApiBody({
      type: UpdateDTO
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
      @Param('id') id: string,
      @Body() entity: Partial<typeof dto>,
      ..._extra: any
    ): Promise<any> {
      return this.crudService.update(id, entity as any);
    }

    @ApiOperation({ summary: 'Delete' })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id: string, ..._extra: any): Promise<any> {
      return this.crudService.delete(id);
    }

    @ApiOperation({ summary: 'Bulk Delete' })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @Delete()
    @UseGuards(AuthGuard('jwt'))
    async bulkDelete(
      @Query() request: DeleteManyInputDTO,
      ..._extra: any
    ): Promise<any> {
      return this.crudService.delete(request);
    }


    // @ApiOperation({ summary: 'Restore form Trash' })
    // @ApiResponse({
    //   status: HttpStatus.BAD_REQUEST,
    //   description: 'Failed',
    // })
    // @ApiResponse({
    //   status: HttpStatus.OK,
    //   description: 'Success',
    // })
    // @HttpCode(HttpStatus.ACCEPTED)
    // @Put(':id/restore')
    // // @UseGuards(JwtAuthGuard, RolesGuard)
    // async restore(
    //   @Param('id') id: string,
    //   ..._extra: any
    // ) {
    //   return this.crudService.restore(id);
    // }

    // @ApiOperation({ summary: 'Delete form Trash' })
    // @ApiResponse({
    //   status: HttpStatus.BAD_REQUEST,
    //   description: 'Failed',
    // })
    // @ApiResponse({
    //   status: HttpStatus.OK,
    //   description: 'Success',
    // })
    // @HttpCode(HttpStatus.ACCEPTED)
    // @Delete(':id/trash')
    // // @UseGuards(JwtAuthGuard, RolesGuard)
    // async trashDelete(
    //   @Param('id') id: string,
    //   ..._extra: any
    // ) {
    //   return this.crudService.trashDelete(id);
    // }

  }

  return CrudControllerClass
}