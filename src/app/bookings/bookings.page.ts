import { Component, OnInit } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit {
  bookings: Booking[];

  constructor(private bookingsService: BookingsService) {}

  ngOnInit() {
    this.bookings = this.bookingsService.bookings;
  }

  onDelete(bookingId: string, slidingBooking: IonItemSliding) {
    console.log('Deleting: ', bookingId, slidingBooking);
    slidingBooking.close();
  }
}
