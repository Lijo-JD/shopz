import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean
  jwt: object

  user = new User({_id: null, email: null, password: null, security: null, __v: null})

  constructor(private http: HttpClient) {
    this.isLoggedIn = false
   }

  login(user: User) {
    return this.http.post('http://localhost:3000/login', user)
  }

  register(user: User) {
    return this.http.post('http://localhost:3000/register', user)
  }

}
