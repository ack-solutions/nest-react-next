import { DynamicModule, Type } from '@nestjs/common';


export interface IPluginModuleOptions {
    plugins?: Array<Type<any> | DynamicModule>;
}
