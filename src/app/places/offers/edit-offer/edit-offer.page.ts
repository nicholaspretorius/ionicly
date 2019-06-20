import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: Place;
  placeId: string;
  form: FormGroup;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.isLoading = true;
      this.placeId = paramMap.get('placeId');

      this.placeSub = this.placesService.getPlace(this.placeId).subscribe(
        place => {
          this.offer = place;
          // setup edit form
          this.form = new FormGroup({
            title: new FormControl(this.offer.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.offer.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.max(140)]
            }),
            price: new FormControl(this.offer.price, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(1)]
            })
          });
          this.isLoading = false;
        },
        error => {
          this.alertCtrl
            .create({
              header: 'Something happened',
              message: 'There seems to have been an error trying to fetch this place.',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    this.router.navigate(['/places/tabs/offers']);
                  }
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
        }
      );
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({ message: 'Updating offer...' }).then(loadingEl => {
      loadingEl.present();
      this.placesService
        .updatePlace(
          this.offer.id,
          this.form.value.title,
          this.form.value.description,
          this.form.value.price
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
        });
    });
  }
}
