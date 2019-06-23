import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { MapsModalComponent } from './modals/maps-modal/maps-modal.component';

@NgModule({
  declarations: [LocationPickerComponent, ImagePickerComponent, MapsModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocationPickerComponent, ImagePickerComponent, MapsModalComponent],
  entryComponents: [MapsModalComponent]
})
export class SharedModule {}
