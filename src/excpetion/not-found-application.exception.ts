import { HttpStatus } from "@nestjs/common";
import { ApplicationException } from "./application.exception";

export class NotFoundApplicationException extends ApplicationException {
  constructor(detail: string, instance: string) 
    {
        super(
        'https://example.com/probs/resource-not-found',
        'Resource not found',
        HttpStatus.NOT_FOUND,
        detail,
        instance
        );
    }
}