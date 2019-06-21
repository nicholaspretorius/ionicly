import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings: Booking[];
  isLoading = false;
  private bookingsSub: Subscription;

  constructor(private bookingsService: BookingsService, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.isLoading = true;
    this.bookingsSub = this.bookingsService.fetchBookings().subscribe(bookings => {
      this.bookings = bookings;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  onDelete(bookingId: string, slidingBooking: IonItemSliding) {
    this.loadingCtrl.create({ message: 'Deleting booking...' }).then(loadingEl => {
      loadingEl.present();
      console.log('Deleting: ', bookingId, slidingBooking);
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        slidingBooking.close();
        loadingEl.dismiss();
      });
    });
  }
}
