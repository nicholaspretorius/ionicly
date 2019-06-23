import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapsModalComponent } from '../../modals/maps-modal/maps-modal.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PlaceLocation } from '../../../places/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Output()
  locationSelected = new EventEmitter<PlaceLocation>();

  pickedLocation: PlaceLocation;
  isLoading = false;
  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {}

  onPickLocation() {
    console.log('Select Location');
    this.modalCtrl.create({ component: MapsModalComponent }).then(modalEl => {
      modalEl.present();
      modalEl.onDidDismiss().then(modalData => {
        console.log('Modal Map Data: ', modalData);
        if (!modalData.data) {
          alert('No location selected');
          return;
        }

        const placeLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          mapShotUrl: null
        };

        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng)
          .pipe(
            switchMap(res => {
              placeLocation.address = res;
              console.log('Address: ', placeLocation);
              return of(this.getMapShot(placeLocation.lat, placeLocation.lng, 13));
            })
          )
          .subscribe(mapShot => {
            placeLocation.mapShotUrl = mapShot;
            this.pickedLocation = placeLocation;
            this.locationSelected.emit(placeLocation);
            this.isLoading = false;
            console.log('Place Location: ', placeLocation);
          });
      });
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          environment.googleMapsAPI
        }`
      )
      .pipe(
        map((data: any) => {
          if (!data || !data.results || data.results.length === 0) {
            return null;
          }
          return data.results[0].formatted_address;
        })
      );
  }

  private getMapShot(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&maptype=roadmap
    &markers=color:blue%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPI}`;
  }
}
