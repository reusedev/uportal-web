import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const message = inject(NzMessageService);
  const headers = {};
  const token = auth.get();

  if (token) {
    Object.assign(headers, {
      'Authorization': `Bearer ${token}`,
    });
  }
  const url = new URL(req.url, window.location.origin);
  if (url.origin === window.location.origin) {
    return next(req.clone({
      setHeaders: headers,
    }))
      .pipe(
        switchMap((event: HttpEvent<unknown>):  Observable<HttpEvent<unknown>> => {
          if (event instanceof HttpResponse) {
            const token = event.headers.get('Set-Token');
            if (token) {
              auth.set(token);
            }
            const body = event.body as { code: number; message: string; data: unknown };
            if (body.code === 0) {
              return of(event);
            } else {
              if (body.code === 401) {
               auth.login(window.location.href.replace(window.location.origin, ''));
                return of(event);
              }
              return throwError(() => body);
            }
          } else {
            return of(event);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          message.error(error.message ?? '服务异常');
          return throwError(() => ({
            code: error.status,
            message: error.message,
          }));
        }),
      );
  } else {
    return next(req);
  }
};
