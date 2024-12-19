import { CrudService } from '@api/app/core/crud';
import { RequestContext } from '@api/app/core/request-context/request-context';
import { SettingTypeEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { Setting } from './setting.entity';


@Injectable()
export class SettingService extends CrudService<Setting> {
    constructor(
        @InjectRepository(Setting)
        private settingRepository: Repository<Setting>
    ) {
        super(settingRepository);
    }

    async updateSetting(request: any) {
        const keys = Object.keys(request.settings);
        const updatedSettings = [];

        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const settingKey = await this.repository.findOne({ where: { key } });

            if (settingKey) {
                updatedSettings.push({
                    ...settingKey,
                    value: request.settings[key],
                });
            } else {
                updatedSettings.push(new Setting({
                    key,
                    value: request.settings[key],
                }));
            }
        }
        await this.repository.save(updatedSettings);
        return { message: 'Successfully Updated' };
    }

    async getPublicSettings() {
        const currentUser = RequestContext.currentUser();
        let whereCondition;

        if (currentUser) {
            whereCondition = {};
        } else {
            whereCondition = [
                {
                    type: Not(SettingTypeEnum.PRIVATE)
                },
                { type: IsNull() }
            ];
        }
        const settings = await this.settingRepository.find({
            where: whereCondition
        });
        return settings;
    }

}
