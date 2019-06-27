import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid/v4';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  placeId: string;
  userId: string;
  placeTitle: string;
  placeImage: string;
  firstName: string;
  lastName: string;
  numGuests: number;
  dateFrom: Date;
  dateTo: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);
  private URL = 'https://ionicly-8e283.firebaseio.com/bookings';

  constructor(private authService: AuthService, private http: HttpClient) { }

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No used if found');
        }
        return this.http
          .get<{ [key: string]: BookingData }>(this.URL + `.json?orderBy="userId"&equalTo="${userId}"`)
      }),
      map(bookings => {
        const newBookings = [];
        for (const key in bookings) {
          if (bookings.hasOwnProperty(key)) {
            newBookings.push(
              new Booking(
                key,
                bookings[key].placeId,
                bookings[key].userId,
                bookings[key].placeTitle,
                bookings[key].placeImage,
                bookings[key].firstName,
                bookings[key].lastName,
                bookings[key].numGuests,
                bookings[key].dateFrom,
                bookings[key].dateTo
              )
            );
          }
        }
        return newBookings;
      }),
      tap(res => {
        this._bookings.next(res);
      })
    );
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
    let generatedId: string;
    let newBooking: Booking;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found.');
        }

        newBooking = new Booking(
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

        return this.http
          .post<{ name: string }>(this.URL + '.json', {
            ...newBooking,
            id: null
          });
      }),
      switchMap(res => {
        console.log('Bookings: ', res);
        generatedId = res.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
    // add new booking to observable
    // return this._bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(bookings => {
    //     this._bookings.next(bookings.concat(newBooking));
    //     console.log('Bookings: ', this._bookings);
    //   })
    // );
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(`${this.URL}/${bookingId}.json`).pipe(
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
      })
    );
    // return this._bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(bookings => {
    //     this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
    //     console.log('Bookings: ', this._bookings);
    //   })
    // );
  }
}
