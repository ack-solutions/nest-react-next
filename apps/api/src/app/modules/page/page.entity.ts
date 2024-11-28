import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { BaseEntity } from '@api/app/core/typeorm/base.entity';
import { IPage, PageStatusEnum } from '@libs/types';

@Entity()
export class Page extends BaseEntity implements IPage {
  
    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column()
    title?: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    slug?: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({ type: 'text' , nullable: true })
    content?: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    name?: string;

    @ApiProperty({ type: String, enum: PageStatusEnum })
    @IsEnum(PageStatusEnum)
    @IsOptional()
    @Column({ type: 'text', default: PageStatusEnum.DRAFT })
    status?: PageStatusEnum;

}
