import { Injectable, NestMiddleware } from '@nestjs/common';

import { RequestContext } from './request-context';


@Injectable()
export class RequestContextMiddleware implements NestMiddleware {

    use(req, res, next) {
        RequestContext.create(req, res, next);
    }

}
