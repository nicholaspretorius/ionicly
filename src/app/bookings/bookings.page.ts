import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings: Booking[];
  private bookingsSub: Subscription;

  constructor(private bookingsService: BookingsService) {}

  ngOnInit() {
    this.bookingsSub = this.bookingsService.bookings.subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  onDelete(bookingId: string, slidingBooking: IonItemSliding) {
    console.log('Deleting: ', bookingId, slidingBooking);
    this.bookingsService.cancelBooking(bookingId).subscribe();
    slidingBooking.close();
  }
}
