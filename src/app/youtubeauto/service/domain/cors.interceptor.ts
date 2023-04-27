import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add headers for requests made by MyService
    if (request.url.includes('https://www.googleapis.com/youtube/v3')) {
      const headers = request.headers
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
        .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
      const newRequest = request.clone({ headers });
      return next.handle(newRequest);
    } else {
      return next.handle(request);
    }
  }
}
