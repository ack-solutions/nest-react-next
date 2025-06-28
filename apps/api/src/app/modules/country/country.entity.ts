import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
} from 'class-validator';
import { Entity, Column } from 'typeorm';

import { CoreEntity } from '../../core/typeorm/core.entity';


@Entity()
export class Country extends CoreEntity {

    @ApiProperty({ type: String })
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ type: String })
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({ type: String })
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    iso?: string;

}
