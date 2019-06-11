import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from './../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  places: Place[];
  bookablePlaces: Place[];
  menuOpen = false;
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.places = places;
      this.bookablePlaces = this.places;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  // ionViewWillEnter() {
  //   this.places = this.placesService.places;
  // }

  navigateTo() {}

  onMenuClick() {
    this.menuCtrl.toggle('m1');
    this.menuOpen = !this.menuOpen;
  }

  onFilter(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.bookablePlaces = this.places;
    } else {
      this.bookablePlaces = this.places.filter(place => place.userId !== this.authService.userId);
    }
  }
}
