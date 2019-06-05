import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-create-bookings',
  templateUrl: './create-bookings.component.html',
  styleUrls: ['./create-bookings.component.scss']
})
export class CreateBookingsComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('form') form: NgForm;
  dateStart: string;
  dateEnd: string;
  incompatibleDates = false;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.selectedPlace);

    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      // from
      const randomFrom = Math.random() * moment(availableTo).diff(moment(availableFrom), 'days');
      console.log('Rand from: ', Math.ceil(randomFrom));
      this.dateStart = moment(availableFrom)
        .add(Math.ceil(randomFrom), 'days')
        .toISOString();

      // to
      const randomTo =
        Math.random() *
        (Math.round(moment.duration(moment(availableTo).diff(this.dateStart)).asDays()) - 1);

      moment(availableTo).subtract(Math.ceil(randomFrom), 'days');
      console.log('Rand to: ', Math.ceil(randomTo));
      this.dateEnd = moment(this.dateStart)
        .add(Math.ceil(randomTo), 'days')
        .toISOString();

      console.log('Start: ', this.dateStart, ' End: ', this.dateEnd);
    } else {
      this.dateStart = moment(availableFrom).toISOString();
      this.dateEnd = moment(this.dateStart)
        .add(1, 'days')
        .toISOString();
    }
  }

  onBookPlace() {
    if (!this.form.valid) {
      return;
    }

    if (
      this.form.submitted &&
      new Date(this.form.value.dateFrom).getTime() > new Date(this.form.value.dateTo).getTime()
    ) {
      this.incompatibleDates = true;
      return;
    }

    this.modalCtrl.dismiss(this.form.value, 'book');
  }

  onCancel() {
    console.log('Close this place!');
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
