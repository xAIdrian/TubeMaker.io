import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class LoggingService {
  debug(...args: any[]): void {
    if (environment.debug) {
      console.log(...args);
    }
  }

  // Add other log levels as needed (e.g., info, error, etc.)
}
