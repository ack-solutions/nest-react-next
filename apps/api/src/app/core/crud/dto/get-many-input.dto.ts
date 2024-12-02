import { IFindOptions, IOrderBy, IWhereCondition, OrderDirectionEnum } from "@libs/types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray } from "class-validator";



export class ConditionOperatorDTO {
    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $between?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $in?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $notIn?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $eq?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $notEq?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $lte?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $gte?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $lt?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $gt?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $isNull?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $notNull?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $like?: string | number;

    @ApiPropertyOptional({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
        ]
    })
        $iLike?: string | number;
}


class WhereConditionDTO implements IWhereCondition {

    //[x: string]: string | number | ConditionOperatorDTO;
    @ApiPropertyOptional({
        description: `Column Name of entity, You can select any one operator from list $eq, $in or etc... \n
      i.e {"firstName": { "$eq" : "test"}, "lastName": {"$like": "%test%"}}
      {"firstName":  "test", "lastName": {"$like": "%test%"}}
      `,
        type: () => ConditionOperatorDTO,
    })
        columnName: string | number | ConditionOperatorDTO;

    @ApiPropertyOptional({
        description: `If you want "and" condition, you can pass object or array of object  \n
      i.e {"$and": {"firstName": { "$eq" : "test"}, "lastName": {"$like": "%test%"} } \n
      {"$and": [{"firstName": { "$eq" : "test"}}, {"lastName": {"$like": "%test%"}] }
      `,
        type: () => [WhereConditionDTO],

        // oneOf: [
        //   {
        //     type: 'object',
        //     $ref: getSchemaPath(WhereConditionDTO)
        //   },
        //   {
        //     type: 'array',
        //     items: {
        //       type: 'object',
        //       $ref: getSchemaPath(WhereConditionDTO)
        //     }
        //   }
        // ]
    })
        $and: WhereConditionDTO | WhereConditionDTO[]

    @ApiPropertyOptional({
        description: `If you want "or" condition, you can pass object or array of object  \n
      i.e {"$or": {"firstName": { "$eq" : "test"}, "lastName": {"$like": "%test%"} } \n
      {"$or": [{"firstName": { "$eq" : "test"}}, {"lastName": {"$like": "%test%"}] }
      `,
        type: () => [WhereConditionDTO],
        // oneOf: [
        //   {
        //     type: 'object',
        //     $ref: getSchemaPath(WhereConditionDTO)
        //   },
        //   {
        //     type: 'array',
        //     items: {
        //       type: 'object',
        //       $ref: getSchemaPath(WhereConditionDTO)
        //     }
        //   }
        // ]
    })
        $or: WhereConditionDTO | WhereConditionDTO[]

}


export class OrderByDTO<T> implements IOrderBy {
    [x: string]: OrderDirectionEnum;

    @ApiPropertyOptional({ type: [String] })
        columnName: OrderDirectionEnum;
}



export class GetManyInputDTO<T> implements IFindOptions {

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
        select?: string[]

    @ApiPropertyOptional({ type: Boolean })
    @IsArray()
        onlyDeleted?: boolean

    @ApiPropertyOptional({ type: Boolean })
    @IsArray()
        withDeleted?: boolean

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
        relations?: string[]

    @ApiPropertyOptional({
        type: () => [WhereConditionDTO],
        // oneOf: [
        //     {
        //         type: 'object',
        //         $ref: getSchemaPath(WhereConditionDTO)
        //     },
        //     {
        //         type: 'array',
        //         items: {
        //             type: 'object',
        //             $ref: getSchemaPath(WhereConditionDTO)
        //         }
        //     }
        // ]
    })
        where?: WhereConditionDTO | WhereConditionDTO[]

    @ApiPropertyOptional({
        type: () => [OrderByDTO],
        // oneOf: [
        //     {
        //         type: 'object',
        //         $ref: getSchemaPath(OrderByDTO)
        //     },
        //     {
        //         type: 'array',
        //         items: {
        //             type: 'object',
        //             $ref: getSchemaPath(OrderByDTO)
        //         }
        //     }
        // ]
    })
        order?: OrderByDTO<T> | OrderByDTO<T>[];

}


export class DeleteManyInputDTO {
    @ApiPropertyOptional({ type: [String] })
    @IsArray()
        ids: string[]
}


export class RestoreManyInputDTO {
    @ApiPropertyOptional({ type: [String] })
    @IsArray()
        ids: string[]
}
