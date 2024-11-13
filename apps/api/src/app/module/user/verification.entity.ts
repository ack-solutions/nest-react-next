
import {  Column, Entity, ManyToOne } from "typeorm";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "./user.entity";
import { IsNumber, IsString } from "class-validator";
import { IUser, IVerification } from "@libs/types";
import { BaseEntity } from "@libs/nest-core";


@Entity()
export class Verification extends BaseEntity  implements IVerification {

  @ApiPropertyOptional()
  @IsString()
  @Column({ nullable: true })
  email?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Column()
  otp: number;

  @ApiPropertyOptional()
  @IsString()
  @Column({ length: 20, nullable: true })
  phoneNumber?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user?: IUser;

}
