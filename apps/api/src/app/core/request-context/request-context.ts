import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';

export class RequestContext {
    private static storage = new AsyncLocalStorage<RequestContext>();

    readonly id: number;
    request: Request;
    response: Response;

    private constructor(request: Request, response: Response) {
        this.id = Math.random();
        this.request = request;
        this.response = response;
    }

    public static create(request: Request, response: Response, next: () => void) {
        const context = new RequestContext(request, response);
        RequestContext.storage.run(context, () => next());
    }

    public static current(): RequestContext | undefined {
        return RequestContext.storage.getStore();
    }

    public static currentRequest(): Request | null {
        const requestContext = RequestContext.current();
        return requestContext ? requestContext.request : null;
    }

    static currentUser(): any {
        const request:any = RequestContext.currentRequest();

        if (request) {
            const user: any = request['user'];

            if (user) {
                return user;
            }
        }
        return null;
    }

}
