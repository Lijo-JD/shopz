import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = new User({
    _id: null,
    email: null,
    password: null,
    security: null,
    __v: null,
  });
  decodedJwtData = null;
  setView: boolean;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.setView = true;
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    c_email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.emailvalidator,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    c_password: new FormControl('', [Validators.required, this.pwdvalidator]),
  });

  isToggle() {
    this.setView = !this.setView;
  }

  onLogin() {
    this.user.email = this.loginForm.value.email;
    this.user.password = this.loginForm.value.password;
    this.user.security = 'user';
    this.auth.login(this.user).subscribe((data) => {
      if (data === null) {
        this.loginForm.reset();
      } else {
        let jwtData = JSON.stringify(data).split('.')[1];
        let decodedJwtJsonData = window.atob(jwtData);
        this.decodedJwtData = JSON.parse(decodedJwtJsonData);
        if (this.decodedJwtData.security === 'admin') {
          localStorage.setItem('jwt', JSON.stringify(data));
          this.router.navigate(['/admin']);
        } else if (this.decodedJwtData.security === 'user') {
          localStorage.setItem('jwt', JSON.stringify(data));
          this.router.navigate(['/user']);
        }
      }
    });
  }

  onRegister() {
    this.user.email = this.registerForm.value.email;
    this.user.password = this.registerForm.value.password;
    this.user.security = 'user';
    this.auth.register(this.user).subscribe((data) => {
      if (data === null) {
        this.registerForm.reset();
      } else {
        this.user = new User(data as User);
        this.auth.login(this.user).subscribe((user) => {
          if (user === null) {
            this.registerForm.reset();
          } else {
            let jwtData = JSON.stringify(user).split('.')[1];
            let decodedJwtJsonData = window.atob(jwtData);
            this.decodedJwtData = JSON.parse(decodedJwtJsonData);
            if (this.decodedJwtData.security === 'user') {
              localStorage.setItem('jwt', JSON.stringify(user));
              this.router.navigate(['/user']);
            }
          }
        });
      }
    });
  }

  pwdvalidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (
      control !== null &&
      (control.value != null || control.value != undefined)
    ) {
      if (control.root.get('password') != null) {
        let pwdcontrol = control.root.get('password');
        if (control.value != pwdcontrol.value) {
          return { password: true };
        }
      }
      return null;
    }
  }

  emailvalidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (
      control !== null &&
      (control.value != null || control.value != undefined)
    ) {
      if (control.root.get('email') != null) {
        let emailcontrol = control.root.get('email');
        if (control.value != emailcontrol.value) {
          return { email: true };
        }
      }
      return null;
    }
  }
}
