import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const username = '11188393';
    const password = '60-dayfreetrial';
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    // Clone the request to add the new header.
    const authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });

    // Pass the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
