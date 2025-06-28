import {
    FactoryValueGenerator,
    FactoryValue,
} from '../decorators/factory.decorator';


export interface PropertyMetadata {
    target: () => void;
    propertyKey: string;
    arg: FactoryValueGenerator | FactoryValue;
}
