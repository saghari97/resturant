import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map, take, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {
  constructor(private authSer: AuthService,
              private route: Router,
              private router: ActivatedRoute) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authSer.user.pipe(take(1) , map(resData => {
      const isAuth = !!resData;
      if (isAuth) {
        return true;
      }
      return this.route.createUrlTree(['/auth']);
    }));
  }
}
