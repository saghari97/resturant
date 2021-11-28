import { Component, OnInit } from '@angular/core';
import {Form, NgForm} from '@angular/forms';
import {AuthResData, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLogged = true;
  isLoading = false;
  errMsg: string = null;
  constructor(private authSer: AuthService,
              private route: Router) { }

  ngOnInit(): void {
  }
  onSwichedMode() {
    this.isLogged = !this.isLogged;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResData>;
    if (this.isLogged) {
      authObs = this.authSer.onLogin(email , password);
    } else {
      authObs = this.authSer.onSignUp(email , password);
    }
    authObs.subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        this.route.navigate(['/recipes']);
      },
      err => {
        console.log(err);
        this.errMsg = err;
        this.isLoading = false;
      }
    );
    form.reset();
  }
}
