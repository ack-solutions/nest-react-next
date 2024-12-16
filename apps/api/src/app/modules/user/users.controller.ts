import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user';
import { IChangePasswordInput, IUpdateProfileInput, IUser } from '@libs/types';
import { CrudController } from '../../core/crud';
import { User } from './user.entity';
import { RequestContext } from '@api/app/core/request-context/request-context';
import * as bcrypt from 'bcryptjs';
import { hashPassword } from '@api/app/utils';
import { join } from 'path';
import moment from 'moment';
import { FileStorage, UploadedFileStorage } from '@api/app/core/file-storage';
import { RequestDataTypeInterceptor } from '@api/app/core/request-data-type.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeepPartial } from 'typeorm';

@ApiTags('User')
@Controller('user')
@UseGuards()
export class UsersController extends CrudController(UserDTO)<IUser> {
    constructor(private userService: UserService) {
        super(userService);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async findCurrentUser(@CurrentUser() user: IUser): Promise<IUser> {
        return this.userService.userRepository.findOne({
            where: {
                id: user?.id,
            },
            relations: [
                'roles',
                'roles.permissions',
            ],
        });
    }

    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: new FileStorage().storage({
                dest: () => {
                    return join('avatar', moment().format('YYYY/MM'));
                },
                prefix: 'avatar',
            }),
        }),
        RequestDataTypeInterceptor
    )
    @Post()
    async create(@Body() req: DeepPartial<User>, @UploadedFileStorage() avatar) {
        if (avatar?.key) {
            req.avatar = avatar?.key;
        }
        return super.create(req);
    }

    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: new FileStorage().storage({
                dest: () => {
                    return join('avatar', moment().format('YYYY/MM'));
                },
                prefix: 'avatar',
            }),
        }),
        RequestDataTypeInterceptor
    )
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() req: DeepPartial<User>,
        @UploadedFileStorage() avatar
    ) {
        if (avatar?.key) {
            req.avatar = avatar?.key;
        }
        return super.update(id, req);
    }


    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: new FileStorage().storage({
                dest: () => {
                    return join('avatar', moment().format('YYYY/MM'));
                },
                prefix: 'avatar',
            }),
        }),
        RequestDataTypeInterceptor
    )
    @Put('update/profile')
    async updateProfile(
        @Body() entity: IUpdateProfileInput,
        @UploadedFileStorage() avatar
    ): Promise<User> {
        if (avatar?.key) {
            entity.avatar = avatar?.key;
        }
        return this.userService.updateProfile(entity);
    }


    @HttpCode(HttpStatus.ACCEPTED)
    @Post('change-password')
    @UseGuards(AuthGuard('jwt'))
    async changePassword(@Body() entity: IChangePasswordInput) {
        return this.userService.changePassword(entity);
    }

}
