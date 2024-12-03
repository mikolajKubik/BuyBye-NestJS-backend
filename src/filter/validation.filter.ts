import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
  } from '@nestjs/common';
  import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Pobranie szczegółów błędu z wyjątku
    const exceptionResponse: any = exception.getResponse();
    const validationErrors = Array.isArray(exceptionResponse?.message)
    ? exceptionResponse.message
    : [exceptionResponse?.message];

    const formattedResponse = {
    type: 'https://example.com/validation-error',
    title: 'Validation failed for the incoming request body.',
    status: status,
    'invalid-params': validationErrors.map((error: string) => {
        const [field, ...reasonParts] = error.split(' ');
        return {
        name: field,
        reason: reasonParts.join(' '),
        };
    }),
    };

    response.status(status).json(formattedResponse);
}
}