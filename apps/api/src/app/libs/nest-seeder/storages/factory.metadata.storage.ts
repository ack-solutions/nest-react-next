import { Type } from '@nestjs/common';

import {
    FactoryValue,
    FactoryValueGenerator,
} from '../decorators/factory.decorator';


export type PropertyMetadataType = {
    target?: any;
    propertyKey?: any;
    arg: {
        generator: FactoryValueGenerator | FactoryValue;
        dependsOn?: string[];
    };
};

export class FactoryMetadataStorageHost {

    private properties: PropertyMetadataType[] = [];

    addPropertyMetadata(metadata: PropertyMetadataType): void {
        this.properties.push(metadata);
    }

    getPropertyMetadatasByTarget(
        target: Type<unknown>,
    ): PropertyMetadataType[] {
        return this.properties.filter((property) => property.target === target);
    }

}

const globalRef = global as any;

export const FactoryMetadataStorage: FactoryMetadataStorageHost = globalRef.FactoryMetadataStorage ||
    (globalRef.FactoryMetadataStorage = new FactoryMetadataStorageHost());
