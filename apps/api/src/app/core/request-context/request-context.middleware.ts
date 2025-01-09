import { Injectable, NestMiddleware } from '@nestjs/common';

import { RequestContext } from './request-context';


@Injectable()
export class RequestContextMiddleware implements NestMiddleware {

    use(req:any, res:any, next:any) {
        RequestContext.create(req, res, next);
    }
}
