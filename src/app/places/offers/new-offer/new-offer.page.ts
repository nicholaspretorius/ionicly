import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';

function base64toBlob(base64Data: any, contentType: any) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

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
      }),
      image: new FormControl(null)
    });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
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

  onImageSelected(imageUrl: string | File) {
    let imageFile;
    if (typeof imageUrl === 'string') {
      try {
        imageFile = base64toBlob(imageUrl.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (err) {
        console.log('String to file conversion error! ', err);
        alert('String to file conversion error.');
      }
    } else {
      // file
      imageFile = imageUrl;
    }
    this.form.patchValue({ image: imageFile });
  }
}
