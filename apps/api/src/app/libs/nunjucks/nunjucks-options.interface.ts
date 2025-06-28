import { ModuleMetadata, Type } from '@nestjs/common';
import nunjucks from 'nunjucks';


export interface NunjucksModuleOptions extends nunjucks.ConfigureOptions {
    viewsDir: string; // Directory for views
    autoescape?: boolean; // Optional Nunjucks setting
    noCache?: boolean; // Optional Nunjucks setting
    extendEnvironment?: (env: nunjucks.Environment) => void; // Optional Nunjucks setting
}


export interface NunjucksAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    /**
     * The `useExisting` syntax allows you to create aliases for existing providers.
     */
    useExisting?: Type<NunjucksOptionsFactory>;
    /**
     * The `useClass` syntax allows you to dynamically determine a class
     * that a token should resolve to.
     */
    useClass?: Type<NunjucksOptionsFactory>;
    /**
     * The `useFactory` syntax allows for creating providers dynamically.
     */
    useFactory?: (...args: any[]) => Promise<NunjucksModuleOptions> | NunjucksModuleOptions;
    /**
     * Optional list of providers to be injected into the context of the Factory function.
     */
    inject?: any[];
}


export interface NunjucksOptionsFactory {
    createNunjucksOptions(): Promise<NunjucksModuleOptions> | NunjucksModuleOptions;
}
