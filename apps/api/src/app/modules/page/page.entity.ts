import { IMeta, PageStatusEnum } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
    Column,
    Entity,
    BeforeInsert,
} from 'typeorm';

import { MetaDTO } from './dto/meta-dto';
import { CoreEntity } from '../../core/typeorm/core.entity';
import { getDataSource } from '../../utils/database';
import { generateSlug } from '../../utils/str-to-slug';


@Entity()
export class Page extends CoreEntity {

    @ApiProperty({ type: String })
    @Column()
    title?: string;

    @ApiProperty({ type: String })
    @Column({ nullable: true })
    @IsOptional()
    name?: string;

    @ApiProperty({ type: String })
    @Column({ nullable: true })
    slug?: string;

    @ApiProperty({ type: String })
    @Column({ nullable: true })
    content?: string;

    @ApiProperty({ enum: PageStatusEnum })
    @Column({
        type: 'enum',
        enum: PageStatusEnum,
        default: PageStatusEnum.DRAFT,
    })
    status?: PageStatusEnum;

    @ApiProperty({ type: () => [MetaDTO] })
    @Column('jsonb', { nullable: true })
    extras?: IMeta;

    @ApiProperty({ type: String })
    @Column({ nullable: true })
    template?: string;

    @BeforeInsert()
    async createSlug?() {
        if (!this.slug) {
            this.slug = await generateSlug(this.title, async (slug: string) => {
                const dataSource = getDataSource();
                const resp = await dataSource.getRepository(Page)
                    .createQueryBuilder('page')
                    .where('page.slug = :slug', { slug })
                    .getCount();
                return !!resp;
            });
        }
    }

}
