import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapsModalComponent } from '../../modals/maps-modal/maps-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onPickLocation() {
    console.log('Select Location');
    this.modalCtrl.create({ component: MapsModalComponent }).then(modalEl => {
      modalEl.present();
    });
  }
}
