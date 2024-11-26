import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
  Not,
} from 'typeorm';
import { User } from './user.entity';
import { RoleNameEnum } from '@libs/types';
import { Role } from '../role';
import { has, omit } from 'lodash';
import { hashPassword } from '@api/app/utils';
import { CrudService } from '@api/app/core/crud';
import { RequestContext } from '@api/app/core/request-context/request-context';


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
    if (has(req, 'password') && req?.password) {
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

  async updateProfile(entity: any): Promise<User> {

    const currentUser = RequestContext.currentUser();
    const userId = currentUser?.id;
    console.log( { entity },{ userId });

    let user;

    if (userId) {
      //find user detail
      user = await this.userRepository.findOne({ where: { id: userId } });

      if (has(entity, 'email') && user?.email !== entity.email) {
        const exists = await this.checkIfExistsEmail(entity.email);
        if (exists) {
          throw new ConflictException(
            'Email is already taken, Please use other email'
          );
        }
      }
      //update user
      const userEntity = omit(entity, [
        'roles',
      ]);

      await this.userRepository.save({ ...user, ...userEntity });
      return await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: [
          'roles',
        ],
      });
    } else {
      throw new ConflictException('Please try again something is wrong!');
    }
  }

  async checkIfExistsEmail(email: string, ignoreId?: any): Promise<boolean> {
    const count = await this.userRepository.count({
      where: {
        email: email,
        ...(ignoreId ? { id: Not(ignoreId) } : {}),
      },
    });
    return count > 0;
  }
}
