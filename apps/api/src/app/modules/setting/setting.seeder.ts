import { Seeder } from '@api/app/core/nest-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Setting } from './setting.entity';


@Injectable()
export class SettingSeeder implements Seeder {
    constructor(
        @InjectRepository(Setting)
        private repo: Repository<Setting>
    ) { }

    async seed() {
        const rows = [];

        return await this.repo.save(rows);
    }

    async drop() {
        return await this.repo.query(
            `TRUNCATE TABLE "${this.repo.metadata.tableName}" CASCADE`
        );
    }
}
