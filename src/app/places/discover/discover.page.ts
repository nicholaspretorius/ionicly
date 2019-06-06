import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from './../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  places: Place[];
  menuOpen = false;
  private placesSub: Subscription;

  constructor(private placesService: PlacesService, private menuCtrl: MenuController) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.places = places;
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
    console.log('Event: ', event.detail);
  }
}
