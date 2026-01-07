import { NestAuthAuthGuard, NestAuthPermission, NestAuthPermissions, NestAuthRoles } from '@ackplus/nest-auth';
import { Crud } from '@ackplus/nest-crud';
import {
    ISetPasswordInput,
    IUpdateProfileInput,
    IUser,
    PermissionsEnum,
    RoleGuardEnum,
    RoleNameEnum,
} from '@libs/types';
import {
    Body,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ChangeEmailInputDTO } from './dto/change-email-input.dto';
import { ChangePasswordInputDTO } from './dto/change-password-input.dto';
import { ChangePhoneInputDTO } from './dto/change-phone-input.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteAccountInputDTO } from './dto/delete-account-input.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { SuccessDTO } from '../../core/dto/success.dto';
import { RequestDataTypeInterceptor } from '../../core/interceptors/request-data-type.interceptor';
import { RequestContext } from '../../core/request-context/request-context';


@ApiTags('User')
@UseGuards(NestAuthAuthGuard)
@Crud({
    entity: User,
    name: 'User',
    path: 'user',
    softDelete: true,
    dto: {
        create: CreateUserDTO,
        update: UpdateUserDTO,
    },
    routes: {
        counts: {
            enabled: true,
            interceptors: [new RequestDataTypeInterceptor()],
        },
    },
})
export class UsersController {

    constructor(
        private service: UserService,
    ) {
        // super(userService);
    }

    @Get('me')
    @Throttle({
        default: {
            limit: 100,
            ttl: 60000,
        },
    })
    currentUser(): Promise<IUser | null> {
        return RequestContext.currentUser({ relations: ['authUser'] });
    }

    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(
        RequestDataTypeInterceptor,
    )
    @Put('update/profile')
    updateProfile(
        @Body() entity: IUpdateProfileInput,
    ): Promise<IUser> {
        return this.service.updateProfile(entity);
    }

    @ApiOperation({ summary: 'Change Password own account' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Password Change Success',
    })
    @Throttle({
        default: {
            limit: 5,
            ttl: 60000,
        },
    })
    @Post('change-password')
    changePassword(@Body() entity: ChangePasswordInputDTO) {
        return this.service.changePassword(entity);
    }

    @ApiOperation({ summary: 'Change Password own account' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Password Change Success',
    })
    @Throttle({
        default: {
            limit: 5,
            ttl: 60000,
        },
    })
    @NestAuthPermissions([PermissionsEnum.RESET_PASSWORD_USERS])
    @Put('set-password/:userId')
    setPassword(@Body() entity: ISetPasswordInput, @Param('userId') userId: string) {
        return this.service.setPassword(userId, entity);
    }

    @ApiOperation({ summary: 'Change Email' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Change email failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Email update successfully',
    })
    @Post('change-email')
    @Throttle({
        default: {
            limit: 5,
            ttl: 60000,
        },
    })
    async changeEmail(@Body() req: ChangeEmailInputDTO) {
        return this.service.changeEmail(req);
    }

    @ApiOperation({ summary: 'Change Phone Number' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Change phone number failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Phone number update successfully',
    })
    @Post('change-phone')
    @Throttle({
        default: {
            limit: 5,
            ttl: 60000,
        },
    })
    async changePhone(@Body() req: ChangePhoneInputDTO) {
        return this.service.changePhone(req);
    }

    @ApiOperation({ summary: 'Delete Account' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Success',
    })
    @Throttle({
        default: {
            limit: 5,
            ttl: 60000,
        },
    })
    @Delete('delete-account')
    async deleteAccount(@Body() req: DeleteAccountInputDTO) {
        return this.service.deleteAccount(req);
    }


    @ApiOperation({ summary: 'Toggle MFA' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Success',
    })
    @Throttle({
        default: {
            limit: 10,
            ttl: 60000,
        },
    })
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @Put('toggle-mfa/:userId')
    async toggleMfa(
        @Param('userId') userId: string,
        @Body() req: { enable: boolean }) {
        return this.service.toggleMfa(userId, req.enable);
    }

    @ApiOperation({ summary: 'Can toggle 2fa' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Success',
    })
    @Throttle({
        default: {
            limit: 10,
            ttl: 60000,
        },
    })
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @Get('can-toggle-mfa')
    async canToggleMfa() {
        return this.service.canToggleMfa();
    }


    @ApiOperation({ summary: 'Get Mfa devices' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Success',
    })
    @Throttle({
        default: {
            limit: 10,
            ttl: 60000,
        },
    })
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @Get('mfa-devices/:userId')
    async getMfaDevices(@Param('userId') userId: string) {
        return this.service.getTotpDevices(userId);
    }

    @ApiOperation({ summary: 'Get Mfa devices' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Success',
    })
    @Throttle({
        default: {
            limit: 10,
            ttl: 60000,
        },
    })
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @Delete('mfa-devices/:deviceId')
    async removeMfaDevice(@Param('deviceId') deviceId: string) {
        return this.service.removeDevice(deviceId);
    }

}
