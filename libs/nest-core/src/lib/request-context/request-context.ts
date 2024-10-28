import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestContext {
    readonly id: number;
    request: Request;
    response: Response;

    constructor(request: Request, response: Response) {
        this.id = Math.random();
        this.request = request;
        this.response = response;
    }

    // static currentBusinessId(): string {
    //     const requestContext = RequestContext.currentRequestContext();
    //     return requestContext?.request ? requestContext.request['headers']['business-id'] : null;
    // }

    // static currentOrganizationId(): string {
    //     const requestContext = RequestContext.currentRequestContext();
    //     return requestContext?.request ? requestContext.request['headers']['organization-id'] : null;
    // }

    public static currentRequestContext(): RequestContext {
        return global[RequestContext.name];
    }

    static currentRequest(): Request {
        const requestContext = RequestContext.currentRequestContext();

        if (requestContext) {
            return requestContext.request;
        }

        return null;
    }

    static currentUser(throwError?: boolean): any {
        const requestContext = RequestContext.currentRequestContext();

        if (requestContext) {
            const user: any = requestContext.request['user'];

            if (user) {
                return user;
            }
        }

        if (throwError) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        return null;
    }

}
