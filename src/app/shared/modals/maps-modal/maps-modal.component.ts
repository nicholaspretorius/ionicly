import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-maps-modal',
  templateUrl: './maps-modal.component.html',
  styleUrls: ['./maps-modal.component.scss']
})
export class MapsModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElRef: ElementRef;

  clickListener: any;
  googleMaps: any;

  constructor(private modalCtrl: ModalController, private renderer: Renderer2) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.googleMaps.event.removeListener(this.clickListener);
  }

  ngAfterViewInit() {
    this.getGoogleMaps()
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: {
            lat: -34.03,
            lng: 24.93
          },
          zoom: 16
        });

        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

        this.clickListener = map.addListener('click', event => {
          const selectedCoords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };

          this.modalCtrl.dismiss(selectedCoords);
        });
      })
      .catch(err => {
        alert('Error loading Google Maps!');
      });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsAPI;
      script.async = true;
      script.defer = true;

      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;

        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK not available.');
        }
      };
    });
  }
}
