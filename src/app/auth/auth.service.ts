import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

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
export class AuthService implements OnInit, OnDestroy {
  // private _userIsAuthenticated = false;
  // private _userId = null; // 'xyz';
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  get user() {
    return this._user.asObservable().pipe(
      map(user => {
        if (!user) {
          return null;
        } else {
          return user;
        }
      })
    );
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
    // return this._userIsAuthenticated;
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (!user) {
          return null;
        } else {
          return user.id;
        }
      })
    );
    // return this._userId;
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (!user) {
          return null;
        } else {
          return user.token;
        }
      })
    );
  }

  register(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.fbKey}`
      , {
        email,
        password,
        returnSecureToken: true
      }).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.fbKey}`
      , {
        email,
        password,
        returnSecureToken: true
      }).pipe(tap(this.setUserData.bind(this)));
    // this._userIsAuthenticated = true;
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this._user.next(null);
    Plugins.Storage.remove({ key: 'AuthData' });
    // this._userIsAuthenticated = false;
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'AuthData' }))
      .pipe(
        map(user => {
          if (!user || !user.value) {
            return null;
          }

          const data = JSON.parse(user.value) as { userId: string; email: string; token: string; tokenExpiration: string };

          const expirationTime = new Date(data.tokenExpiration);
          console.log('Retrived expiration: ', expirationTime);
          const newUser = new User(data.userId, data.email, data.token, expirationTime);

          return newUser;
        }), tap(user => {
          if (user) {
            this._user.next(user);
            this.autoLogout(user.tokenDuration);
          }
        }), map(user => {
          return !!user; // !! turns user into a boolean
        })
      );
  }

  private setUserData(data: AuthResponseData) {

    // expiraiton data is: date now converted into time/getTime (ms) + expiration time (s) * 1000ms
    const expirationDate = new Date(new Date().getTime() + (+data.expiresIn * 1000));
    // const expiry = +data.expiresIn;
    // const localMs = Date.now();
    // const localOffset = new Date().getTimezoneOffset() * 60000;
    // const expiryTime = expiry * 1000;

    // const expirationDate = new Date(localMs - localOffset + expiryTime);

    console.log('Expiration Date: ', expirationDate, expirationDate.toISOString());

    const user = new User(data.localId, data.email, data.idToken, expirationDate);

    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.setLocalAuthData(data.localId, data.email, data.idToken, expirationDate.toISOString());
  }

  // local storay in Plugins.Storage is a key/value pair as a string.
  private setLocalAuthData(userId: string, email: string, token: string, tokenExpiration: string) {
    console.log('Expiration String', tokenExpiration);
    const authData = JSON.stringify({ userId: userId, email: email, token: token, tokenExpiration: tokenExpiration });
    Plugins.Storage.set({ key: 'AuthData', value: authData });
  }
}
