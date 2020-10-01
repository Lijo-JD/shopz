import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new User({_id: null, email: null, password: null, security: null, __v: null})

  constructor(private http: HttpClient) {}

  login(user: User) {
    return this.http.post('http://localhost:3000/login', user)
  }

  register(user: User) {
    return this.http.post('http://localhost:3000/register', user)
  }

  isAuthenticated() {
    let jwt = localStorage.getItem('jwt')
    if(jwt === null){
      return false
    } else {
      jwt = JSON.parse(jwt)
      let jwtData = JSON.stringify(jwt).split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      let expiry = new Date(decodedJwtData.exp * 1000)
      if(expiry.getTime() > new Date().getTime()){
        return true
      } else {
        return false
      }
    }
  }

}
