import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss']
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(160)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({ message: 'Creating new place...' }).then(loadingEl => {
      loadingEl.present();

      console.log('onCreateOffer: ', this.form.value);
      this.placesService
        .createPlace(
          this.form.value.title,
          this.form.value.description,
          this.form.value.price,
          this.form.value.dateFrom,
          this.form.value.dateTo,
          this.form.value.location
        )
        .subscribe(() => {
          this.form.reset();
          loadingEl.dismiss();
          this.router.navigate(['/places/tabs/offers']);
        });
    });
  }

  onLocationSelected(location: PlaceLocation) {
    console.log('Location Event: ', location);
    this.form.patchValue({ location: location });
  }
}
