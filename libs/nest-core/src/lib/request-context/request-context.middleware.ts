import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    use(req, res, next) {
        const requestContext = new RequestContext(req, res);

        global[RequestContext.name] = requestContext
        next()
    }
}
