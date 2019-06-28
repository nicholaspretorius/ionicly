import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

import { Capacitor, Plugins, AppState, StatusBarStyle } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  private authSub: Subscription;
  private previousAuth = false;

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuth !== isAuth) {
        this.router.navigateByUrl('auth');
      }
      this.previousAuth = isAuth;
    });

    Plugins.App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe(success => {
          if (!success) {
            this.onLogout();
          }
        });
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
        Plugins.StatusBar.setStyle({ style: StatusBarStyle.Light });
      }
    });
  }

  onLogout() {
    console.log('Logout');
    this.authService.logout();
  }
}
