import { Injectable } from '@nestjs/common';

import { getConfigValue } from '@libs/app-config';


@Injectable()
export class AppService {

    getData(): { message: string } {
        const appName = getConfigValue<string>('app.name', 'API');
        return ({ message: `Hello ${appName}` });
    }

}
