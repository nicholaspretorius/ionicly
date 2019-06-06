import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      149.99,
      new Date(Date.now()),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      // tslint:disable-next-line:quotemark
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
      189.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      99.99,
      new Date('2019-06-15'),
      new Date('2019-12-25'),
      'abc'
    )
  ]);

  constructor(private authService: AuthService) {}

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this._places.pipe(
      take(1),
      map(places => {
        return places.find(place => place.id === id);
      })
    );
    // return { ...this._places.find(place => place.id === id) };
  }

  createPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    const newPlace = new Place(
      Math.round(Math.random() * 100).toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      new Date(availableFrom),
      new Date(availableTo),
      this.authService.userId
    );

    console.log('createPlace: ', newPlace);

    // this._places.push(newPlace);
    this._places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace));
    });

    console.log(this._places);
  }
}
