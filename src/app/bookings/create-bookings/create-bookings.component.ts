import { Component, OnInit, Input } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-bookings',
  templateUrl: './create-bookings.component.html',
  styleUrls: ['./create-bookings.component.scss']
})
export class CreateBookingsComponent implements OnInit {
  @Input() selectedPlace: Place;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onBookPlace() {
    console.log('Book this place!');
    this.modalCtrl.dismiss({ message: 'This is a dummy booking message' }, 'book');
  }

  onCancel() {
    console.log('Close this place!');
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
