import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingsComponent } from '../../../bookings/create-bookings/create-bookings.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapsModalComponent } from '../../../shared/modals/maps-modal/maps-modal.component';
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingsService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      let retrievedUserId: string;
      const placeId = paramMap.get('placeId');
      this.loadingCtrl.create({ message: 'Loading place...' }).then(loadingEl => {
        loadingEl.present();

        this.placeSub = this.authService.userId.pipe(
          take(1),
          switchMap(userId => {
            if (!userId) {
              throw new Error('No user id found.');
            }
            retrievedUserId = userId;
            return this.placesService.getPlace(placeId);
          })
        ).subscribe(
          place => {
            this.place = place;
            this.isBookable = this.place.userId !== retrievedUserId;
            loadingEl.dismiss();
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.alertCtrl
              .create({
                header: 'Something unexpected happened.',
                message: 'Unfortunately the place was not loaded, please try again.',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.router.navigate(['/places/tabs/discover']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl
      .create({
        header: 'Choose an action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            }
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel' // destructive
          }
        ]
      })
      .then(actionEl => {
        actionEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log('Mode: ', mode);
    this.modalCtrl
      .create({
        component: CreateBookingsComponent,
        componentProps: { selectedPlace: this.place, id: 'booking-modal', selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'book') {
          this.loadingCtrl
            .create({
              message: 'Making booking...'
            })
            .then(loadingEl => {
              loadingEl.present();
              console.log('BOOKED!');
              const data = resultData.data.data;
              this.bookingsService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.numGuests,
                  data.dateFrom,
                  data.dateTo
                )
                .subscribe(() => {
                  // this.form.reset();
                  loadingEl.dismiss();
                  this.router.navigate(['/bookings']);
                });
            });
        }
      });
  }

  onShowMap() {
    this.modalCtrl
      .create({
        component: MapsModalComponent,
        componentProps: {
          center: { lat: this.place.location.lat, lng: this.place.location.lng },
          selectable: false,
          closeBtnText: 'Close',
          title: this.place.title
        }
      })
      .then(modalEl => {
        modalEl.present();
      });
  }
}
