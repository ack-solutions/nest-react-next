import {
    registerDecorator,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';


@ValidatorConstraint({ async: true })
export class IsNumberConstraint implements ValidatorConstraintInterface {

    async validate(_inputValue: number | string, args: ValidationArguments) {
        const { value } = args;
        // const [options] = args.constraints;
        if (!isNaN(value) && value != null) {
            return true;
        }

        return false;
    }

}

export function IsNumber() {
    return function (object?: any, propertyName?: string) {
        registerDecorator({
            target: object?.constructor,
            propertyName: propertyName,
            options: { message: '$value not a valid number.' },
            constraints: [],
            validator: IsNumberConstraint,
        });
    };
}
