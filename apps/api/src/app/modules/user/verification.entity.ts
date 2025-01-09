import { BaseEntity } from '@api/app/core/typeorm/base.entity';
import { IVerification } from '@libs/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';


@Entity()
export class Verification extends BaseEntity implements IVerification {

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
  @Column({
      length: 20,
      nullable: true,
  })
      phoneNumber?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
      userId?: string;

}
