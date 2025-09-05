import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/User/login') || req.url.includes('/User/register')) {
        return next.handle(req);
    }

    const token = sessionStorage.getItem(environment.tokenKey);

    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return next.handle(clonedReq);
    }

    return next.handle(req);
}
}
