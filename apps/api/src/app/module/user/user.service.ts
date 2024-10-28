import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
} from 'typeorm';
import { User } from './user.entity';
import { CrudService } from '@mlm/nest-core';


@Injectable()
export class UserService extends CrudService<User> {
  protected hasSoftDelete = true;

  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,

  ) {
    super(userRepository);
  }

  async beforeSave(entity: DeepPartial<User>, req): Promise<User> {
    // if ((entity as any).password) {
    //   entity.passwordHash = await hashPassword((entity as any).password.trim());
    // }
    return entity as User;
  }

  // async createUser(request: IRegisterInput) {
  //   const userEntity: User = request;

  //   if (request.password) {
  //     userEntity.passwordHash = await hashPassword(request.password.trim());
  //   }
  //   if (!request?.roles || request.roles?.length === 0) {
  //     const userRole = await this.roleRepository.findOne({
  //       name: UserRoleEnum.USER,
  //     });
  //     userEntity.roles = [new Role({ id: userRole.id })];
  //   }
  //   if (request?.referralCode) {
  //     const referredUser = await this.userRepository.findOne({
  //       where: { referralCode: request?.referralCode },
  //       select: ['id'],
  //     });
  //     userEntity.referredById = referredUser?.id || null;
  //     try {
  //       if (referredUser) {
  //         await this.walletService.credit(
  //           'Referral Credit',
  //           500,
  //           referredUser,
  //           {}
  //         );
  //       }
  //     } catch (error) {
  //       throw new BadRequestException(error);
  //     }
  //   }
  //   // else if (request.roles?.length > 0) {
  //   //     const userRoles = await this.roleRepository.find({ name: In(request.roles) })
  //   //     userEntity.roles = userRoles?.map((role) => {
  //   //         return new Role({ id: role.id })
  //   //     })
  //   // }
  //   const user = new User(userEntity);
  //   try {
  //     await this.userRepository.save(user);

  //     await this.afterUserCreate(user);
  //   } catch (error) {
  //     console.log(error);
  //     throw new BadRequestException(error);
  //   }

  //   return this.userRepository.findOne(user.id, {
  //     relations: ['roles'],
  //   });
  // }

}
