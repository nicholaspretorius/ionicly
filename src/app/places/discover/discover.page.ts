import { Component, OnInit } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from './../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit {
  places: Place[];
  menuOpen = false;
  constructor(private placesService: PlacesService, private menuCtrl: MenuController) {}

  ngOnInit() {
    this.places = this.placesService.places;
  }

  ionViewWillEnter() {
    this.places = this.placesService.places;
  }

  navigateTo() {}

  onMenuClick() {
    this.menuCtrl.toggle('m1');
    this.menuOpen = !this.menuOpen;
  }

  onFilter(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log('Event: ', event.detail);
  }
}
