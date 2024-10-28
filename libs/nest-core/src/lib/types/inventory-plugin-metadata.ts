import { Provider } from "@nestjs/common";
import { ConfigFactory } from "@nestjs/config";

export interface InventoryPluginMetadata {
    entities?: Function[];
    entitiesMarge?: {
        target: any;
        class: any;
    }[];
    seeders?: Provider[];
    migrationsDir?: string;
    config?: Array<ConfigFactory>;
}
