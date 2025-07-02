import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';


@Injectable()
export class RequestDataTypeInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();

        if (request.body) {
            request.body = this.deepMap(request.body, this.parseDataType);
        }

        if (request.query) {
            try {
                request.query = this.deepMap(request.query, this.parseDataType);
            } catch (_error) {
                // Handle read-only query property in newer Node.js versions
                const transformedQuery = this.deepMap(request.query, this.parseDataType);
                try {
                    Object.defineProperty(request, 'query', {
                        value: transformedQuery,
                        writable: true,
                        configurable: true,
                        enumerable: true,
                    });
                } catch (_defineError) {
                    // If we can't redefine the property, copy properties individually
                    Object.keys(transformedQuery).forEach(key => {
                        try {
                            request.query[key] = transformedQuery[key];
                        } catch (_keyError) {
                            // Silently ignore if individual key assignment fails
                        }
                    });
                }
            }
        }

        return next.handle();
    }

    deepMap(obj, cb) {
        let out = {};
        if (obj.length >= 0) {
            out = [];
        }

        Object.keys(obj).forEach((k) => {
            let val;

            if (obj[k] !== null && typeof obj[k] === 'object') {
                val = this.deepMap(obj[k], cb);
            } else {
                val = cb(obj[k], k);
            }
            // out[k] = val === 'null' ? null : val;
            out[k] = val;
        });
        return out;
    }

    parseDataType(value: any) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number') {
            return value;
        }
        if (value === 'true' || value === 'false') {
            return !!(value === 'true');
        }
        if (value === 'null' || value === '') {
            return null;
        }
        if (isNaN(value)) {
            return value;
        }
        return value;
    }

}
