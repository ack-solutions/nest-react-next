import { NestAuthUser } from '@ackplus/nest-auth';
import { UserStatusEnum } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { Column, Entity, AfterLoad, ManyToOne } from 'typeorm';

import { CoreEntity } from '../../core/typeorm/core.entity';
import { Factory } from '@ackplus/nest-seeder';


@Entity()
export class User extends CoreEntity {

    @ApiProperty()
    @Factory((faker) => faker.person.firstName())
    @IsString()
    @Column()
    firstName?: string;

    @ApiProperty({ nullable: true })
    @Factory((faker) => faker.person.lastName())
    @IsString()
    @Column({ nullable: true })
    lastName?: string;

    @ApiProperty({
        format: 'uuid',
        nullable: true,
    })
    @IsString()
    @Column({
        nullable: true,
        comment: 'Save Nest Auth User ID',
    })
    authUserId?: string;

    @ApiProperty({
        type: () => NestAuthUser,
        nullable: true,
    })
    @ManyToOne(() => NestAuthUser, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    authUser?: NestAuthUser; // TODO: Create a new user Time show error Circular Dependency

    @Factory((faker) => faker.string.numeric(10))
    @ApiProperty({
        example: '123 456 7890',
        description: 'User\'s phone number (digits only or formatted)',
        required: false,
    })
    @Transform(({ value }) => value ? value.replace(/\D/g, '') : null)
    @Column('varchar', {
        length: 20,
        nullable: true,
    })
    @IsOptional()
    phoneNumber?: string;


    @ApiProperty({
        example: 'IN | US | UK | etc.',
        description: 'User\'s phone ISO code',
        required: false,
    })
    @Column('varchar', {
        length: 3,
        nullable: true,
    })
    @IsOptional()
    phoneIsoCode?: string;

    @ApiProperty({
        example: '+91 | +1 | +44 | etc.',
        description: 'User\'s phone country code',
        required: false,
    })
    @Column('varchar', {
        length: 6,
        nullable: true,
    })
    @IsOptional()
    phoneCountryCode?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    avatar?: string;

    @Column({
        nullable: true,
        default: false,
        update: false,
    })
    isSuperUser?: boolean;


    @ApiProperty({
        type: UserStatusEnum,
        enum: UserStatusEnum,
        enumName: 'UserStatusEnum',
        example: UserStatusEnum.ACTIVE,
    })
    @Factory((faker) => faker.helpers.enumValue(UserStatusEnum))
    @IsEnum(UserStatusEnum)
    @IsOptional()
    @Column('text', { default: UserStatusEnum.ACTIVE })
    status?: UserStatusEnum;

    @ApiProperty()
    @Column({ nullable: true })
    @IsUUID()
    @IsOptional()
    tenantId?: string;


    // read only
    @ApiProperty({ readOnly: true })
    name?: string;

    @ApiProperty({ readOnly: true })
    password?: string;

    @ApiProperty({ readOnly: true })
    formattedPhone?: string;

    @AfterLoad()
    async afterLoad?() {
        this.name = [this.firstName, this.lastName].filter(Boolean).join(' ');
        if (this.phoneNumber) {
            this.formattedPhone = `${this.phoneCountryCode}${this.phoneNumber}`;
        }
    }


}
