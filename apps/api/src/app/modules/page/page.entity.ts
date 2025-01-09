import { BaseEntity } from '@api/app/core/typeorm/base.entity';
import { generateSlug } from '@api/app/utils';
import { IPage, PageStatusEnum } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';


@Entity()
export class Page extends BaseEntity implements IPage {

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    title?: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    slug?: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({
        type: 'text',
        nullable: true,
    })
    content?: string;

    @ApiProperty({
        type: String,
        enum: PageStatusEnum,
    })
    @IsEnum(PageStatusEnum)
    @IsOptional()
    @Column({
        type: 'text',
        nullable: true,
    })
    status?: PageStatusEnum;

    @ApiProperty({ type: Object })
    @IsOptional()
    @Column({
        type: 'jsonb',
        nullable: true,
    })
    metaData?: any;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    name?: string;

    @BeforeInsert()
    async createSlug() {
        this.slug = await generateSlug(Page, this.title, this.id);
    }

    @BeforeUpdate()
    async updateSlug() {
        this.slug = await generateSlug(Page, this.title, this.id);
    }

}
