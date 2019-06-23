import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapsModalComponent } from '../../modals/maps-modal/maps-modal.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PlaceLocation, Coordinates } from '../../../places/location.model';
import { Capacitor, Plugins } from '@capacitor/core';

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
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    console.log('Select Location');

    this.actionSheetCtrl
      .create({
        header: 'Please select',
        buttons: [
          {
            text: 'Auto Locate',
            handler: () => {
              this.locateUser();
            }
          },
          {
            text: 'Select from Map',
            handler: () => {
              this.openMap();
            }
          },
          { text: 'Cancel', role: 'cancel' }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    console.log('GeoLocate');
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showAlert();
      return;
    }

    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then(data => {
        const location: Coordinates = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };
        console.log('Geolocation', location);
        this.populatePlaceData(location);
        this.isLoading = false;
      })
      .catch(err => {
        this.showAlert('Error calculating location.', 'Please try again.');
        return;
      });
  }

  private showAlert(header?: string, message?: string) {
    this.alertCtrl
      .create({
        header: header ? header : 'Location Geolocation Not Enabled',
        message: message
          ? message
          : "Please enable geolocation or choose 'Select from Map' instead.",
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }

  private openMap() {
    this.modalCtrl.create({ component: MapsModalComponent }).then(modalEl => {
      modalEl.present();
      modalEl.onDidDismiss().then(modalData => {
        console.log('Modal Map Data: ', modalData);
        if (!modalData.data) {
          alert('No location selected');
          return;
        }
        const location: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };
        this.populatePlaceData(location);
      });
    });
  }

  private populatePlaceData(coords: Coordinates) {
    const placeLocation: PlaceLocation = {
      lat: coords.lat,
      lng: coords.lng,
      address: null,
      mapShotUrl: null
    };

    this.isLoading = true;
    this.getAddress(coords.lat, coords.lng)
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
