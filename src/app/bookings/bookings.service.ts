import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid/v4';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    numGuests: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const bookingId = uuid();
    const userId = this.authService.userId;
    const newBooking = new Booking(
      bookingId,
      placeId,
      userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      numGuests,
      dateFrom,
      dateTo
    );

    console.log('Add Booking: ', newBooking);

    // add new booking to observable
    return this._bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.concat(newBooking));
        console.log('Bookings: ', this._bookings);
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this._bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
        console.log('Bookings: ', this._bookings);
      })
    );
  }
}
