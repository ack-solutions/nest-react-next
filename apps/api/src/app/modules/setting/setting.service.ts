import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './setting.entity';
import { CrudService } from '@api/app/core/crud';


@Injectable()
export class SettingService extends CrudService<Setting> {
  constructor(
    @InjectRepository(Setting)
    repository: Repository<Setting>
  ) {
    super(repository);
  }

  async updateSetting(request: any) {
    const keys = Object.keys(request.settings)

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const settingKey = await this.repository.findOne({ where: { key } });

      if (settingKey) {
        await this.repository.update({ key: key }, {
          value: request.settings[key]
        })
      } else {
        await this.repository.save(new Setting({
          key,
          name: key,
          value: request.settings[key],
        }))
      }
    }
    return { message: 'SuccessFully Updated' }
  }


}
