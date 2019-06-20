import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

/*
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
      'xyz'
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
*/

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  private URL = 'https://ionicly-8e283.firebaseio.com/places';

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>(this.URL + '.json').pipe(
      map(res => {
        const places = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                res[key].title,
                res[key].description,
                res[key].imageUrl,
                res[key].price,
                new Date(res[key].availableFrom),
                new Date(res[key].availableTo),
                res[key].userId
              )
            );
          }
        }
        return places;
        // return [];
      }),
      tap(res => {
        this._places.next(res);
      })
    );
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`${this.URL}/${id}.json`).pipe(
      map(place => {
        return new Place(
          id,
          place.title,
          place.description,
          place.imageUrl,
          place.price,
          new Date(place.availableFrom),
          new Date(place.availableTo),
          place.userId
        );
      })
    );
    // return this._places.pipe(
    //   take(1),
    //   map(places => {
    //     return places.find(place => place.id === id);
    //   })
    // );
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

    let generatedId: string;

    console.log('createPlace: ', newPlace);

    // POST newPlace with a null id so that Firebase generates its own id.
    return this.http
      .post<{ name: string }>(this.URL + '.json', {
        ...newPlace,
        id: null
      })
      .pipe(
        // switchMap "switches" to a new observable, i.e. from the POST response to this.places
        switchMap(res => {
          generatedId = res.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );

    // this._places.push(newPlace);
    // return this._places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     console.log(this._places);
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(id: string, title: string, description: string, price: number) {
    let latestPlaces: Place[];
    return this._places.pipe(
      take(1),
      switchMap(places => {
        const index = places.findIndex(place => place.id === id);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[index];
        const newPlace = new Place(
          id,
          title,
          description,
          oldPlace.imageUrl,
          price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        updatedPlaces[index] = newPlace;
        latestPlaces = [...updatedPlaces];

        return this.http.put(`${this.URL}/${id}.json`, { ...newPlace, id: null });
      }),
      tap(() => {
        this._places.next(latestPlaces);
      })
    );
  }
}
