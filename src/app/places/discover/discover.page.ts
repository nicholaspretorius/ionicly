import { Component, OnInit } from '@angular/core';
import { PlacesService } from './../places.service';
import { Place } from './../place.model';
import { MenuController } from '@ionic/angular';

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

  ionViewWillEnter() {}

  navigateTo() {}

  onMenuClick() {
    this.menuCtrl.toggle('m1');
    this.menuOpen = !this.menuOpen;
  }
}
