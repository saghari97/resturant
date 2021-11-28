import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject,  throwError} from 'rxjs';
import {UserModel} from './user.model';
import {Router} from '@angular/router';

export interface AuthResData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<UserModel>(null);
  private timer: any;

  constructor(private http: HttpClient,
              private route: Router) {
  }
  onDelete() {
    this.user.next(null);
    this.route.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
  }
  autoLogOut (expirePeriod: number) {
    this.timer = setTimeout(() => {
      this.onDelete();
    }, expirePeriod);
  }
  autoLog () {
    const userData: {
      email: string,
      id: string ,
      _token: string ,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new UserModel(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const exPeriod = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogOut(exPeriod);
    }
  }

  onSignUp(email: string, password: string) {
    return this.http.post<AuthResData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPrcunbxig7Af6whD6pbo2_bNTxMVp-vM',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(catchError(errorRes => {
        let err = 'Unknown Error!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(err);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            err = 'The email address is already in use by another account';
        }
        return throwError(err);
      }), tap(resData => {
        this.handleAuthenticate(resData.email , resData.localId , resData.idToken , +resData.expiresIn);
        }
      ));
  }

  onLogin(email: string, password: string) {
    return this.http.post<AuthResData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPrcunbxig7Af6whD6pbo2_bNTxMVp-vM', {
      email: email,
      password: password,
      returnSecureToken: true
    })
      .pipe(catchError(errorRes => {
        let err = 'unknown Error occured.';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(err);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_NOT_FOUND':
            err = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        }
        return throwError(err);
      }), tap(resData => {
          this.handleAuthenticate(resData.email , resData.localId , resData.idToken , +resData.expiresIn);
        }
      ));
  }
  private handleAuthenticate(email: string , localId: string , idToken: string , expiresIn: number) {
    const expire = new Date( new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(email , localId , idToken , expire);
    this.user.next(user);
    this.autoLogOut(expiresIn * 1000);
    localStorage.setItem('userData' , JSON.stringify(user));
  }
}
