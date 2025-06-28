import { faker } from '@faker-js/faker';
import { Type } from '@nestjs/common';

import { FactoryValue } from '../decorators/factory.decorator';
import { Factory } from '../interfaces';
import {
    FactoryMetadataStorage,
    PropertyMetadataType,
} from '../storages/factory.metadata.storage';


export class DataFactory {

    static createForClass(target: Type<unknown>): Factory {
        if (!target) {
            throw new Error(
                `Target class "${target}" passed in to the "TemplateFactory#createForClass()" method is "undefined".`,
            );
        }

        const properties = FactoryMetadataStorage.getPropertyMetadatasByTarget(target);

        return {
            generate: (
                count: number,
                values: Record<string, any> = {},
            ): Record<string, FactoryValue>[] => {
                const ret: Record<string, FactoryValue>[] = [];
                for (let i = 0; i < count; i++) {
                    ret.push(this.generate(properties, values));
                }
                return ret;
            },
        };
    }

    private static generate(
        properties: PropertyMetadataType[],
        values: Record<string, any>,
    ): Record<string, FactoryValue> {
        const ctx = { ...values };

        return properties.reduce((result, property) => {
            const propertyKey = property.propertyKey;
            const { generator, dependsOn } = property.arg;

            // Skip if the value is already generated in the context (ctx)
            if (ctx[propertyKey] !== undefined) {
                return {
                    [propertyKey]: ctx[propertyKey],
                    ...result,
                };
            }

            // If the property has dependencies, ensure they are generated first
            if (Array.isArray(dependsOn)) {
                dependsOn.forEach((dependency) => {
                    if (ctx[dependency] === undefined) {
                        // Find the dependent property and generate it if it hasn't been generated yet
                        const dependentProperty = properties.find(
                            (p) => p.propertyKey === dependency,
                        );
                        if (dependentProperty) {
                            ctx[dependency] = typeof dependentProperty.arg.generator ===
                                'function' ?
                                dependentProperty.arg.generator(
                                    faker,
                                    ctx,
                                ) :
                                dependentProperty.arg;
                        }
                    }
                });
            }

            // Generate the current field
            ctx[propertyKey] = typeof generator === 'function' ?
                generator(faker, ctx) :
                generator;

            return {
                [propertyKey]: ctx[propertyKey],
                ...result,
            };
        }, {});

        // return properties.reduce(
        //   (r, p) => ({
        //     [p.propertyKey]: ctx[p.propertyKey] = typeof p.arg === 'function' ? p.arg(faker, ctx) : p.arg,
        //     ...r,
        //   }),
        //   {},
        // );
    }

}
