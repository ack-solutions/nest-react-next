import {
    registerDecorator,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsNumberConstraint
implements ValidatorConstraintInterface {
    async validate(inputValue: number | string, args: ValidationArguments) {

        const { property, value, targetName, object: request } = args;
        // const [options] = args.constraints;
        if (!isNaN(value) && value != null) {
            return true;
        }
        else {
            return false;
        }
    }
}

export function IsNumber() {
    return function (object?: any, propertyName?: string) {
        registerDecorator({
            target: object?.constructor,
            propertyName: propertyName,
            options: { message: '$value not a valid number.', },
            constraints: [],
            validator: IsNumberConstraint,
        });
    };
}