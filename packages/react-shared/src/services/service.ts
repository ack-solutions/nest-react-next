import { instanceApi } from '../config';


export interface ServiceStatic<T extends Service> {
    new(): T;
    instance: T;
    // initialize(o: T): void
}

export abstract class Service {

    protected abstract apiPath: string;
    static instance: any;

    static getInstance<T extends Service>(this: ServiceStatic<T>) {
        if (this.instance) {
            return this.instance;
        }
        const instance = new this();
        return instance;
    }

    protected instanceApi = instanceApi;

    getQueryKey(method?: 'get-all' | 'get-one' | 'get-many' | string) {
        return [this.apiPath, method].filter(Boolean).join('/');
    }

}
