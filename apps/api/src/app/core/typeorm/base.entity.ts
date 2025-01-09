import { IBaseEntity } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import {
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
} from 'typeorm';


// import { Factory } from '../nest-seeder';

export abstract class BaseEntity implements IBaseEntity {

    constructor(input?: any) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @ApiProperty({
        readOnly: true,
        type: String,
        format: 'uuid',
    })
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ApiProperty({ readOnly: true })
    // @Factory((faker) => faker.date.past({ years: 1 }))
    @CreateDateColumn()
    createdAt?: Date;

    @ApiProperty({ readOnly: true })
    // @Factory((faker, ctx) => faker.date.between({ from: ctx.createdAt, to: new Date() }))
    @UpdateDateColumn()
    updatedAt?: Date;

    @ApiProperty({ readOnly: true })
    @DeleteDateColumn()
    deletedAt?: Date;

}
