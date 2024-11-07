import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
} from 'typeorm';
import { User } from './user.entity';
import { CrudService, hashPassword } from '@mlm/nest-core';
import { RoleNameEnum } from '@mlm/types';
import { Role } from '../role';


@Injectable()
export class UserService extends CrudService<User> {
  protected hasSoftDelete = true;

  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    public readonly roleRepository: Repository<Role>,

  ) {
    super(userRepository);
  }

  async beforeSave(entity: DeepPartial<User>, req): Promise<User> {
    // if ((entity as any).password) {
    //   entity.passwordHash = await hashPassword((entity as any).password.trim());
    // }
    return entity as User;
  }

  async createUser(request: any) {
    const userEntity: User = request;

    console.log(userEntity,89989898);
    
    if (request.password) {
      userEntity.passwordHash = await hashPassword(request.password.trim());
    }
    if (!request?.roles || request.roles?.length === 0) {
      const userRole = await this.roleRepository.findOne({
        where: { name: RoleNameEnum.ADMIN },
      });
      userEntity.roles = [new Role({ id: userRole.id })];
    }

    const user = new User(userEntity);
    console.log(user,656565);
    
    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['roles']
    });
  }

  async getUserForAuth(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'roles'
      ],
    });
  }

}
