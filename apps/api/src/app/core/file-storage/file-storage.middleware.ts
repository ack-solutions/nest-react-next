import { Injectable, NestMiddleware } from '@nestjs/common';


@Injectable()
export class FileStorageMiddleware implements NestMiddleware {

    constructor() {
        //
    }

    async use(req, _res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            // const token = authHeader.split(' ')[1];
            // const data: any = jwt.decode(token);
        }

        next();
    }

}
