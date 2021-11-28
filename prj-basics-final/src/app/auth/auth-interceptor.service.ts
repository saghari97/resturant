import {Injectable} from '@angular/core';
import {HttpClient, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth.service';
import {exhaustMap, take} from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private http: HttpClient,
              private authSer: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authSer.user.pipe(take(1) , exhaustMap( user => {
      if (!user) {
        return next.handle(req);
      }
      const modified = req.clone({
        params: new HttpParams().set('auth', user.token)
      });
      return next.handle(modified);
    }));
  }
}

