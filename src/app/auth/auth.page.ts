import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    console.log(email, password);

    this.authenticate(email, password);
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Logging in...'
      })
      .then(loadingEl => {
        loadingEl.present();
        let authObservable: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObservable = this.authService.login(email, password)
        } else {
          authObservable = this.authService.register(email, password)
        }
        authObservable.subscribe(data => {
          console.log(data);
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, res => {
          console.log('Authentication error: ', res);
          loadingEl.dismiss();

          const code = res.error.error.message;
          let message = 'Authentication failed, please try again.';

          if (code === 'EMAIL_EXISTS') {
            message = 'Email address already registered, please use a different email address.';
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'Email address not found, please register before logging in.';
          }
          this.showAlert(message);
        });
      });
  }

  onSwitchToRegister() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }
}
