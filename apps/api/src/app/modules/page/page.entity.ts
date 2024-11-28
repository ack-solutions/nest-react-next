import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseEntity } from '@api/app/core/typeorm/base.entity';
import { IPage } from '@libs/types';
import { generateSlug } from '@api/app/utils/str-to-slug';

@Entity()
export class Page extends BaseEntity implements IPage {
    @ApiProperty()
    @IsString()
    @Column()
    name?: string;

    @ApiProperty()
    @IsString()
    @Column()
    title?: string;

    @ApiProperty()
    @IsString()
    @Column({ nullable: true })
    slug?: string;

    @ApiProperty()
    @IsString()
    @Column({ nullable: true })
    key?: string;

    @ApiProperty()
    @IsString()
    @Column("text", { nullable: true })
    value?: string;

    @ApiProperty()
    @IsString()
    @Column('text', { nullable: true })
    content?: string;

    @Column({ default: 'default' })
    template?: string;

    @BeforeInsert()
    async createSlug() {
      this.slug = await generateSlug(Page, this.name, this.id);
    }
  
    @BeforeUpdate()
    async updateSlug() {
      this.slug = await generateSlug(Page, this.name, this.id);
    }
}
