
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { find, uniqBy } from 'lodash';
import { Role } from '../role/role.entity'; 
import { IUser, RoleNameEnum } from '@libs/types';
import { DataFactory, Seeder } from '@api/app/core/nest-seeder';
import { hashPassword } from '@api/app/utils';


@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

  ) { }

  async seed() {
    let users = [];
    const roles = await this.roleRepository.find();
    const adminRole = find(roles, { name: RoleNameEnum.ADMIN });



    const defaultUsers:IUser[] = [
      {
        firstName: 'Chetan',
        lastName: 'Khandla',
        email: 'chetan@ackplus.com',
        roles: [adminRole],
        passwordHash: hashPassword('Admin@123'),
        isSuperAdmin: true,
      },
      {
        firstName: 'Ajay',
        lastName: 'Khandla',
        email: 'ajay@ackplus.com',
        roles: [adminRole],
        passwordHash: hashPassword('Test@123'),
        
      },
      {
        firstName: 'Customer',
        lastName: 'Ack',
        email: 'customer@gmail.com',
        roles: [adminRole],
        passwordHash: hashPassword('Test@123'),
      },
    ]

    users = defaultUsers?.map((user)=>{
      const factoryUser = new User(DataFactory.createForClass(User).generate(1)[0]);
      return { ...factoryUser, ...user}
    })

    const dummyUsers = []
    const Users = await DataFactory.createForClass(User).generate(10)
    for (let index = 0; index < Users.length; index++) {
      const dummyUser: any = Users[index];
      dummyUser.passwordHash = hashPassword('Test@123');
      dummyUser.roles = [adminRole];
      dummyUsers.push(new User(dummyUser));
    }
    users = uniqBy([...users, ...dummyUsers], (user) => user.email);
    return this.userRepository.save(users);
  }

  async drop() {
    return this.userRepository.query(`TRUNCATE TABLE "${this.userRepository.metadata.tableName}" CASCADE`);
  }
}