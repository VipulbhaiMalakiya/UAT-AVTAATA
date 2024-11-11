import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class XAuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get username from local storage


    // Clone the request and add the new header
    if (localStorage.getItem('loginUrl')) {
      const clonedRequest = req.clone({
        setHeaders: {
            // 'X-Telnet' : localStorage.getItem('loginUrl')  || ''
            'X-Telnet': (localStorage.getItem('loginUrl') || '').charAt(0)

        }
      });

      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
