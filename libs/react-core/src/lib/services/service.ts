import { instanceApi } from "@libs/utils";


export interface ServiceStatic<T extends Service> {
  new(): T;
  instance:T;
  // initialize(o: T): void
}

export abstract class Service {

  static instance: any;

  static getInstance<T extends Service>(this: ServiceStatic<T>) {
    if (this.instance){
      return this.instance;
    }
    const instance = new this();
    return instance;
  }


  protected instanceApi = instanceApi;

}