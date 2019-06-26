import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private _userIsAuthenticated = false;
  // private _userId = null; // 'xyz';
  private _user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (!user) {
        return false;
      }
      return !!user.token;
    }));
    // return this._userIsAuthenticated;
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (!user) {
        return null;
      }
      return user.id;
    }));
    // return this._userId;
  }

  register(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.fbKey}`
      , {
        email,
        password,
        returnSecureToken: true
      });
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.fbKey}`
      , {
        email,
        password,
        returnSecureToken: true
      });
    // this._userIsAuthenticated = true;
  }

  logout() {
    // this._userIsAuthenticated = false;
  }
}
