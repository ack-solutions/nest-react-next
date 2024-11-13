
import {  Column, Entity } from "typeorm";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { IVerification } from "@libs/types";
import { BaseEntity } from "@api/app/core/typeorm/base.entity";


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

}
