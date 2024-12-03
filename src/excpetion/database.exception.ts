import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from './application.exception';

export class DatabaseException extends ApplicationException {
    constructor(detail: string, instance: string) {
        super(
        'https://example.com/probs/database-error',
        'Database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        detail,
        instance
        );
    }
}