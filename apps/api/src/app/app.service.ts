import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

    getData(): { message: string } {
        const appName = process.env.APP_NAME || 'API';
        return ({ message: `Hello ${appName}` });
    }

}
