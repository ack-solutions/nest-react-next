
import { Column, Entity, AfterLoad, ManyToMany, JoinTable } from "typeorm";
import { Role } from "../role/role.entity";
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IUser, UserStatusEnum } from "@mlm/types";
import { BaseEntity,  } from "@mlm/nest-core";
import { Factory } from "apps/api/src/nest-seeder";



@Entity()
export class User extends BaseEntity  implements IUser {

  @ApiProperty()
  // @Factory((faker) => faker.person.firstName())
  @IsString()
  @Column()
  firstName?: string;

  @ApiProperty({ nullable: true })
  // @Factory((faker) => faker.person.lastName())
  @IsString()
  @Column({ nullable: true })
  lastName?: string;

  @ApiProperty()
  // @Factory((faker, ctx) => faker.internet.email({ firstName: ctx.firstName, lastName: ctx.lastName }), ['firstName', 'lastName'])
  @IsString()
  @IsEmail()
  @Column({ nullable: true, unique: true })
  // @IsUniqueExist({
  //   entity: User,
  //   options: {
  //     message: '$value is already taken, Please user other email',
  //   },
  //   ignoreField: 'id',
  // })
  email?: string;

  // @Factory((faker) => '+91' + faker.string.numeric(10))
  @ApiProperty()
  @Column('character', { length: 20, nullable: true })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  avatar?: string;

  @Factory(() => 'Test@123')
  @Column({ nullable: true, select: false })
  passwordHash?: string;

  @Column({ nullable: true, default: false, update: false, insert: false })
  isSuperAdmin?: boolean;

  @ApiProperty({ nullable: true })
  // @Factory((faker) => faker.date.past())
  @IsDateString()
  @IsOptional()
  @Column({ nullable: true, default: null })
  emailVerifiedAt?: Date;

  @ApiProperty({ type: UserStatusEnum, enum: UserStatusEnum, example: UserStatusEnum.ACTIVE })
  // @Factory((faker) => faker.helpers.enumValue(UserStatusEnum))
  @IsEnum(UserStatusEnum)
  @IsOptional()
  @Column('text', { default: UserStatusEnum.ACTIVE })
  status?: UserStatusEnum;

  // @Factory((faker) => faker.datatype.boolean())
  @ApiProperty({ example: 'string', readOnly: true })
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  isProfileCompleted?: boolean;

  // @ApiProperty({ type: [Role], readOnly: true })
  @ManyToMany(() => Role)
  @JoinTable()
  roles?: Role[];

  // read only 
  @ApiProperty({ example: 'string', readOnly: true })
  name?: string;

  @ApiProperty({ example: 'string', readOnly: true })
  avatarUrl?: string;

  @AfterLoad()
  afterLoad?() {
    this.name = this.firstName + ' ' + this.lastName;
    if(this.avatar){
      // this.avatarUrl = new FileStorage().getProvider().url(this.avatar);
    }
  }
}