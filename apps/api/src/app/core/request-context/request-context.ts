import { JWTTokenPayload } from '@ackplus/nest-auth';
import { RoleNameEnum } from '@libs/types';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';
import { Equal, FindOneOptions } from 'typeorm';

import { User } from '../../modules/user/user.entity';


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

    public static create(
        request: Request,
        response: Response,
        next: () => void,
    ) {
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

    static currentUser(options?: FindOneOptions<User>): Promise<User | null> {
        const request: any = RequestContext.currentRequest();

        if (request) {
            const user: JWTTokenPayload = request.user;
            return User.findOne({
                ...options,
                where: { authUserId: Equal(user?.sub) },
            });
        }
        return null;
    }

    static getTokenPayload(): JWTTokenPayload {
        const request: any = RequestContext.currentRequest();
        if (request) {
            return request.user;
        }
        return null;
    }

    static isSuperAdmin(): boolean {
        const user: JWTTokenPayload = RequestContext.getTokenPayload();
        const userRoles = user?.roles;
        if (user && userRoles.some((role) => role?.name === RoleNameEnum.SUPER_ADMIN)) {
            return true;
        }
        return false;
    }

}
