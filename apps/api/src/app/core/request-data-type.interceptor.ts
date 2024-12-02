import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class RequestDataTypeInterceptor implements NestInterceptor {

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ) {

        const request = context.switchToHttp().getRequest();
        if (request.body) {
            request.body = this.deepMap(request.body, this.parseDataType)
        }

        if (request.query) {
            request.query = this.deepMap(request.query, this.parseDataType)
        }


        return next.handle();
    }

    deepMap(obj, cb) {
        let out = {};

        if (obj?.length >= 0) {
            out = []
        }

        Object.keys(obj).forEach((k) => {
            let val;

            if (obj[k] !== null && typeof obj[k] === 'object') {
                val = this.deepMap(obj[k], cb);
            } else {
                val = cb(obj[k], k);
            }

            out[k] = val;
        });
        return out;
    }

    parseDataType(value: any) {
        if (typeof value === 'boolean') {
            return value;
        } else if (typeof value === 'number') {
            return value;
        } else if (value == 'true' || value == 'false') {
            return value == 'true' || value == 1 || value == '1' || value == true ? true : false
        } else if (value == 'null' || value == 'Null') {
            return null
        } else if (!isNaN(value) && value!='' && value!= null ) {
            return Number(value);
        } else {
            return value;
        }
    }
}