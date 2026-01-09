import { MfaService, UserService as NestAuthUserService, TenantService } from '@ackplus/nest-auth';
import { ID, PaginationResponse, IFindOneOptions } from '@ackplus/nest-crud';
import {
    IChangeEmailInput,
    IChangePasswordInput,
    IDeleteAccountInput,
    ISetPasswordInput,
    IUpdateProfileInput,
    IUser,
    RoleGuardEnum,
    UserStatusEnum,
} from '@libs/types';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { has, omit } from 'lodash';
import { SaveOptions, In } from 'typeorm';

import { ChangePhoneInputDTO } from './dto/change-phone-input.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.entity';
import { SuccessDTO } from '../../core/dto/success.dto';
import { RequestContext } from '../../core/request-context/request-context';
import { BaseService } from '../../core/service/base-service';
import { BaseRepository } from '../../core/typeorm/base-repository';
import { IAppConfig } from '../../config/app';


@Injectable()
export class UserService extends BaseService<User> {

    constructor(
        private readonly nestAuthUserService: NestAuthUserService,

        @InjectRepository(User)
        public readonly userRepository: BaseRepository<User>,

        private tenantService: TenantService,

        private nestAuthMfaService: MfaService,
        private configService: ConfigService,

    ) {
        super(userRepository);
    }

    protected override async beforeSave(entity: Partial<CreateUserDTO>, _request?: any) {
        return entity;
    }

    protected override async afterSave(newValue: any, oldValue: any, request?: any) {
        if (has(newValue, 'status')) {
            if (newValue.status === UserStatusEnum.ACTIVE) {
                this.nestAuthUserService.updateUserStatus(newValue.authUserId, true);
            } else {
                this.nestAuthUserService.updateUserStatus(newValue.authUserId, false);
            }
        }

        // Update email if it has changed
        if (request?.email && request?.email !== oldValue?.email) {
            await this.nestAuthUserService.updateUser(newValue?.authUserId, { email: request?.email });
        }

        // Update phone number if it has changed
        const newPhoneNumber = newValue?.phoneNumber ? `${newValue?.phoneCountryCode}${newValue?.phoneNumber}` : null;
        const oldPhoneNumber = oldValue?.phoneNumber ? `${oldValue?.phoneCountryCode}${oldValue?.phoneNumber}` : null;
        if (newValue?.phoneNumber && newPhoneNumber !== oldPhoneNumber) {
            await this.nestAuthUserService.updateUser(newValue?.authUserId, { phone: newPhoneNumber });
        }
        return newValue;
    }

    protected override async beforeUpdate(entity: Partial<UpdateUserDTO>) {

        // Check if the roles are valid for the user
        if (has(entity, 'roles') && entity.roles) {
            const { authUserId } = entity;
            const authUser = await this.nestAuthUserService.getUserById(authUserId);
            await authUser.assignRoles(entity.roles, RoleGuardEnum.ADMIN) as any; // TODO: change to the correct guard
            await authUser.save();
        }
        return super.beforeUpdate(entity);
    }

    protected override async beforeDelete(entity: User) {
        const isSuperAdmin = this.isSuperAdmin();
        if (entity.isSuperUser && !isSuperAdmin) {
            throw new ForbiddenException('You can not delete this user');
        }
        return entity;
    }

    protected override async afterDelete(entity: User) {
        await this.nestAuthUserService.updateUserStatus(entity.authUserId, false);
        return entity;
    }

    protected override async afterDeleteMany(ids: ID[]) {
        const users = await this.userRepository.find({
            select: ['authUserId'],
            where: {
                id: In(ids),
            },
        });
        for (const user of users) {
            await this.nestAuthUserService.updateUserStatus(user.authUserId, false);
        }
        return ids;
    }

    protected override async afterRestore(entity: User) {
        await this.nestAuthUserService.updateUserStatus(entity.authUserId, true);
        return entity;
    }

    protected override async afterRestoreMany(ids: ID[]) {
        const users = await this.userRepository.find({
            select: ['authUserId'],
            where: {
                id: In(ids),
            },
        });
        for (const user of users) {
            await this.nestAuthUserService.updateUserStatus(user.authUserId, true);
        }
        return ids;
    }

    protected override async afterDeleteFromTrash(oldData: any): Promise<any> {
        await this.nestAuthUserService.deleteUser(oldData.authUserId);
        return oldData;
    }

    protected override async beforeDeleteFromTrashMany(ids: ID[]): Promise<any> {
        const users = await this.userRepository.find({
            select: ['authUserId'],
            where: {
                id: In(ids),
            },
        });
        for (const user of users) {
            await this.nestAuthUserService.deleteUser(user.authUserId);
        }
        return ids;
    }

    async findCurrentUser() {
        const user = await RequestContext.currentUser({
            relations: ['authUser', 'authUser.roles'],
        });
        return user;
    }

    override async findMany(query: any, ..._others: any[]): Promise<PaginationResponse<any>> {
        const response = await super.findMany(query, ..._others);
        return response;
    }

    override async findOne(id: ID, query?: IFindOneOptions, ..._others: any[]) {
        const user = await super.findOne(id, query, ..._others);
        return user;
    }

    override async create(entity: CreateUserDTO, options?: SaveOptions) {
        const authUser = await this.nestAuthUserService.createUser({
            phone: entity.phoneNumber,
            email: entity.email,
        });

        await authUser.setPassword(entity.password);
        if (entity.roles?.length > 0) {
            await authUser.assignRoles(entity.roles, RoleGuardEnum.ADMIN); // TODO: change to the correct guard
        }
        if (entity.phoneNumber) {
            await authUser.findOrCreateIdentity('phone', `${entity.phoneCountryCode}${entity.phoneNumber}`);
        }
        if (entity.email) {
            await authUser.findOrCreateIdentity('email', entity.email);
        }
        await authUser.save();
        entity.authUserId = authUser.id;
        const user = await super.create(entity, options);
        return user;
    }

    async updateProfile(entity: IUpdateProfileInput): Promise<IUser> {
        const user = await RequestContext.currentUser();
        const userEntity = omit(entity, [
            'roles',
            'phoneNumber',
            'phoneCountryCode',
            'phoneIsoCode',
        ]);

        await this.userRepository.update(user?.id, userEntity);
        const updatedUser = await this.userRepository.findOneBy({
            id: user?.id,
        });
        return updatedUser;
    }

    async changeEmail(entity: IChangeEmailInput): Promise<SuccessDTO> {
        const authUser = await RequestContext.getTokenPayload();

        await this.nestAuthUserService.updateUser(authUser?.sub, { email: entity?.email });
        return new SuccessDTO({ message: 'Email updated successfully' });
    }

    async changePhone(entity: ChangePhoneInputDTO): Promise<SuccessDTO> {
        const user = await RequestContext.currentUser();

        await this.nestAuthUserService.updateUser(user.authUserId, { phone: `${entity?.phoneCountryCode}${entity?.phoneNumber}` });

        await this.userRepository.update(user.id, {
            phoneNumber: entity?.phoneNumber,
            phoneCountryCode: entity?.phoneCountryCode,
            phoneIsoCode: entity?.phoneIsoCode,
        });
        return new SuccessDTO({ message: 'Phone number updated successfully' });
    }

    // Change password for own account
    async changePassword(entity: IChangePasswordInput) {
        const authUser = await RequestContext.getTokenPayload();

        const user = await this.nestAuthUserService.getUserById(authUser.sub);

        const isPasswordMatch = await user.validatePassword(entity.oldPassword);
        if (!isPasswordMatch) {
            throw new BadRequestException('Invalid old password. Please re-enter your old password correctly.');
        }
        await user.setPassword(entity.password);
        await user.save();

        return new SuccessDTO({ message: 'Password successfully changed.' });
    }


    // Set password for user
    async setPassword(userId: string, entity: ISetPasswordInput) {
        const { authUserId } = await this.userRepository.findOne({
            where: { id: userId },
            select: ['authUserId'],
        });
        const authUser = await this.nestAuthUserService.getUserById(authUserId);
        if (!authUser) {
            throw new BadRequestException('User not found');
        }
        await authUser.setPassword(entity.password);
        await authUser.save();
        return new SuccessDTO({ message: 'Password successfully changed.' });
    }

    async deleteAccount(request: IDeleteAccountInput) {
        const user = await RequestContext.currentUser();

        const authUser = await this.nestAuthUserService.getUserById(user.authUserId);
        const isPasswordMatch = await authUser.validatePassword(request.password);
        if (!isPasswordMatch) {
            throw new BadRequestException('Invalid old password. Please re-enter your old password correctly.');
        }

        await this.nestAuthUserService.updateUserStatus(authUser.id, false);
        await this.userRepository.softDelete(user.id);

        return new SuccessDTO({ message: 'Your account has been successfully deleted. If this was a mistake, please contact support.' });
    }

    async canToggleMfa() {
        const config = await this.nestAuthMfaService.getMfaConfig();
        const access = config.enabled && !config.required && config.methods?.length > 0;
        const avaibleMethods = config.methods?.filter(Boolean);
        return { access, avaibleMethods };
    }

    async toggleMfa(userId: string, enable: boolean) {
        const authUserId = await this.userRepository.findOne({
            where: { id: userId },
            select: ['authUserId'],
        });
        if (enable) {
            return this.nestAuthMfaService.enableMFA(authUserId.authUserId);
        }
        return this.nestAuthMfaService.disableMFA(authUserId.authUserId);
    }

    async getTotpDevices(userId: string) {
        const authUserId = await this.userRepository.findOne({
            where: { id: userId },
            select: ['authUserId'],
        });
        return this.nestAuthMfaService.getTotpDevices(authUserId.authUserId);
    }

    async removeDevice(deviceId: string) {
        return this.nestAuthMfaService.removeDevice(deviceId);
    }
}
