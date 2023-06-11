import { Injectable, ErrorHandler } from '@angular/core';
import * as Sentry from '@sentry/browser';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: any): void {
    // Capture and send error to Sentry
    Sentry.captureException(error);

    // Optionally rethrow the error for default Angular error handling
    // throw error;
  }
}


