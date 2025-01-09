import { getDataSource } from '@api/app/utils';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';


export interface IsExistInDBOptions {
    options?: ValidationOptions,
    entity?: any;
    field?: string;
    ignore?: string | ((query: SelectQueryBuilder<any>) => void | SelectQueryBuilder<any> | Promise<void | SelectQueryBuilder<any>>),
    ignoreField?: string;
}

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    async validate(_inputValue: string, args: ValidationArguments) {

        const { property, value, targetName, object: request } = args;
        const [options] = args.constraints;

        const dataSource = getDataSource()
        const repository = dataSource.getRepository<ObjectLiteral>(options.entity || targetName)
        let query = repository.createQueryBuilder().select(property)

        query.where({ [property]: value });

        if (typeof options.ignore === 'function') {
            const resp = await options.ignore(query)
            if (resp) {
                query = resp;
            }
        } else if (options.ignore || options.ignoreField) {
            let ignoreField = options.ignoreField, ignore = options.ignore;

            if (!options.ignoreField) {
                ignoreField = repository.metadata.primaryColumns.map(
                    ({ propertyName }) => propertyName,
                )[0];
            }

            if (!options.ignore) {
                ignore = request[options.ignoreField];
            }

            if (ignoreField && ignore) {
                query.andWhere(`${ignoreField} != :id`, { id: ignore });
            }
        }

        const row = await query.withDeleted().getRawOne();

        if (row) {
            return false;
        }
        return true;
    }
}

export function IsExistInDB(
    options: IsExistInDBOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: options?.options,
            constraints: [options],
            validator: IsUniqueConstraint,
        });
    };
}
