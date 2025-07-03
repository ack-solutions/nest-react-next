import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';


@Catch(QueryFailedError)
export class DatabaseErrorFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Log the exception Do not remove this
        console.error(exception);

        // PostgreSQL error codes
        const errorCodes = {
            23505: 'Unique constraint violation', // unique_violation
            23503: 'Foreign key violation', // foreign_key_violation
            23502: 'Not null violation', // not_null_violation
        };

        console.error(exception);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        // Handle specific PostgreSQL errors
        if (exception.code && errorCodes[exception.code]) {
            status = HttpStatus.BAD_REQUEST;

            // Extract constraint name from the error detail
            const constraintMatch = exception.detail?.match(/\((.*?)\)=/);
            const fieldName = constraintMatch ? constraintMatch[1] : '';

            // Extract constraint name from error (for specific constraint handling)
            const constraintName = exception.constraint;

            switch (exception.code) {
                case '23505': // unique_violation
                    if (constraintName === 'uq_product_batch_batch_codeproduct_id') {
                        message = 'A batch with the same code already exists for this product.';
                    } else if (constraintName === 'uq_payment_method_namelocation_id') {
                        message = 'This payment method name already exists';
                    } else if (constraintName === 'uq_order_order_numberlocation_id') {
                        message = 'This order number already exists';
                    } else if (constraintName === 'uq_invoice_invoice_numberlocation_id') {
                        message = 'This invoice number already exists';
                    } else {
                        message = `This ${fieldName} already exists.`;
                    }
                    status = HttpStatus.CONFLICT;
                    break;
                case '23503': // foreign_key_violation
                    message = `Referenced ${fieldName} does not exist`;
                    break;
                case '23502': // not_null_violation
                    message = `${fieldName} cannot be empty`;
                    break;
                default:
                    message = errorCodes[exception.code];
            }
        }

        // Determine error message based on status
        let errorMessage = 'Internal Server Error';
        if (status === HttpStatus.BAD_REQUEST) {
            errorMessage = 'Bad Request';
        } else if (status === HttpStatus.CONFLICT) {
            errorMessage = 'Conflict';
        }

        return response.status(status).json({
            statusCode: status,
            message: message,
            error: errorMessage,
        });
    }

}
