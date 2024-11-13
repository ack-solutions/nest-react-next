import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
} from 'typeorm';
import { User } from './user.entity';
import { RoleNameEnum } from '@libs/types';
import { Role } from '../role';
import { has } from 'lodash';
import { hashPassword } from '@api/app/utils';
import { CrudService } from '@api/app/core/crud';


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

  async beforeSave(entity: DeepPartial<any>, req): Promise<User> {   
    if (has(req, 'password') && req?.password ) {      
      entity.passwordHash = await hashPassword(req.password);
    }
    if (entity?.roles) {
      entity.roles = req.roles.map((id) => {
        return new Role({ id })
      });
    }
    return entity as User;
  }

  async createUser(request: any) {
    const userEntity: User = request;


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
