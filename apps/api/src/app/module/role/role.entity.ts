import { Column, Entity, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {  IsString } from 'class-validator';
import { Permission } from '../permission/permission.entity';
import { IPermission, IRole } from '@libs/types';
import { BaseEntity } from '@libs/nest-core';

@Entity()
export class Role extends BaseEntity implements IRole {
    @ApiProperty()
    @IsString()
    @Column()
    name?: string;

    @ApiProperty({ default: false })
    @IsString()
    @Column({ default: false })
    isSystemRole?: boolean;

    @ApiProperty({ type: Permission, readOnly: true })
    @ManyToMany(() => Permission, permission => permission.roles, { onDelete: 'CASCADE' })
    permissions?: IPermission[];
}
