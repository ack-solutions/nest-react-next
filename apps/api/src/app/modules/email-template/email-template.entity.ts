import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';

import { CoreEntity } from '../../core/typeorm/core.entity';
import { getDataSource } from '../../utils/database';
import { generateSlug } from '../../utils/str-to-slug';


@Entity()
export class EmailTemplate extends CoreEntity {

    @ApiProperty()
    @IsString()
    @Column({
        length: 191,
        nullable: true,
    })
    title?: string;

    @ApiProperty()
    @IsString()
    @Column({
        nullable: true,
        length: 1000,
    })
    emailSubject?: string;

    @ApiProperty()
    @IsString()
    @Column('text', { nullable: true })
    emailBody?: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsOptional()
    @Column({
        length: 255,
        nullable: true,
    })
    slug?: string;

    @ApiProperty()
    @IsString()
    @Column({ nullable: true })
    event?: string;

    @BeforeInsert()
    async createSlug() {
        if (!this.slug) {
            this.slug = await generateSlug(this.title, async (slug: string) => {
                const dataSource = getDataSource();
                const resp = await dataSource.getRepository(EmailTemplate)
                    .createQueryBuilder('email-template')
                    .where('email-template.slug = :slug', { slug })
                    .getCount();

                return !!resp;
            });
        }
    }

}
