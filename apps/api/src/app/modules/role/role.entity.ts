import { BaseEntity } from '@api/app/core/typeorm/base.entity';
import { IPermission, IRole, RoleGuardEnum } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';

import { Permission } from '../permission/permission.entity';


@Entity()
export class Role extends BaseEntity implements IRole {

    @ApiProperty()
    @IsString()
    @Column()
    name?: string;

    @ApiProperty()
    @IsString()
    @Column('text', {
        default: RoleGuardEnum.ADMIN,
        comment: 'This type defines the different contexts or environments where roles may apply. Guard name like admin, web, portal and etc...',
    })
    guard?: RoleGuardEnum;

    @ApiProperty({ default: false })
    @IsString()
    @Column({ default: false })
    isSystemRole?: boolean;

    @ApiProperty({
        type: Permission,
        readOnly: true,
    })
    @ManyToMany(() => Permission, permission => permission.roles, { onDelete: 'CASCADE' })
    permissions?: IPermission[];

}
