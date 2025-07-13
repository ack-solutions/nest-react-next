import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Setting } from './setting.entity';
import { BaseService } from '../../core/service/base-service';


@Injectable()
export class SettingService extends BaseService<Setting> {

    constructor(
        @InjectRepository(Setting)
        public readonly settingRepository: Repository<Setting>,
    ) {
        super(settingRepository);
    }


    async updateSetting(request: { settings: Record<string, string> }) {
        const keys = Object.keys(request.settings);
        const updatedSettings = [];

        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const settingKey = await this.settingRepository.findOne({ where: { key } });

            if (settingKey) {
                updatedSettings.push({
                    ...settingKey,
                    value: request.settings[key],
                });
            } else {
                updatedSettings.push(
                    this.settingRepository.create({
                        key,
                        value: request.settings[key],
                    }),
                );
            }
        }
        await this.settingRepository.save(updatedSettings);
        return { message: 'Successfully Updated' };
    }

}
