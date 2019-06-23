import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapsModalComponent } from '../../modals/maps-modal/maps-modal.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
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
        this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(res => {
          console.log('Address: ', res);
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
}
