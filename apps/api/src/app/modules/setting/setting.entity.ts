import { SettingTypeEnum } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { Entity, Column } from 'typeorm';

import { CoreEntity } from '../../core/typeorm/core.entity';


@Entity()
export class Setting extends CoreEntity {

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    key?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    value?: string;

    @ApiProperty({
        type: SettingTypeEnum,
        enum: SettingTypeEnum,
        example: SettingTypeEnum.PUBLIC,
        enumName: 'SettingTypeEnum',
    })
    @IsEnum(SettingTypeEnum)
    @Column('text', { nullable: true })
    @IsOptional()
    type?: SettingTypeEnum;

}
