import { NestAuthEntities } from '@ackplus/nest-auth';
import { NestDynamicTemplatesEntities } from '@ackplus/nest-dynamic-templates';

import { Country } from './modules/country/country.entity';
import { Page } from './modules/page/page.entity';
import { Setting } from './modules/setting/setting.entity';
import { User } from './modules/user/user.entity';


export const ALL_ENTITIES = [
    ...NestAuthEntities,
    ...NestDynamicTemplatesEntities,
    User,
    Page,
    Country,
    Setting,
];
