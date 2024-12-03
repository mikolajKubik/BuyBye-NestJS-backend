import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from './application.exception';

export class InvalidRequestApplicationException extends ApplicationException {
    constructor(detail: string, instance: string) {
        super(
        'https://example.com/probs/invalid-request',
        'Invalid request',
        HttpStatus.CONFLICT,
        detail,
        instance
        );
    }
}