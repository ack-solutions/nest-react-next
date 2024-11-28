
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../role/role.entity';

import { IPermission, IRole } from '@libs/types';
import { BaseEntity } from '@api/app/core/typeorm/base.entity';

@Entity()
export class Permission extends BaseEntity implements IPermission {

  @ApiProperty({ type: Role, readOnly: true })
  @ManyToMany(() => Role, role => role.permissions)
  @JoinTable()
  roles?: IRole[];

  @ApiProperty()
  @Column({ length: 255, nullable: true })
  @IsString()
  name?: string;
}
