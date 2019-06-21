import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapsModalComponent } from './modals/maps-modal/maps-modal.component';

@NgModule({
  declarations: [LocationPickerComponent, MapsModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocationPickerComponent, MapsModalComponent],
  entryComponents: [MapsModalComponent]
})
export class SharedModule {}
