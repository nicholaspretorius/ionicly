import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController, AlertController } from '@ionic/angular';
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

  constructor(private bookingsService: BookingsService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

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

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    }, err => {
      this.alertCtrl.create({
        header: 'Something went wrong.',
        message: 'There was an error while fetching bookings, please try again.',
        buttons: ['OK']
      }).then(alertEl => {
        console.log('Error: ', err);
        alertEl.present();
      });
    });
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
