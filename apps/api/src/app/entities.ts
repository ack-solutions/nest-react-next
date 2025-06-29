import { NestAuthEntities } from '@ackplus/nest-auth';

import { Country } from './modules/country/country.entity';
import { EmailTemplate } from './modules/email-template/email-template.entity';
import { Page } from './modules/page/page.entity';
import { User } from './modules/user/user.entity';


export const ALL_ENTITIES = [
    ...NestAuthEntities,
    User,
    EmailTemplate,
    Page,
    Country,
];
