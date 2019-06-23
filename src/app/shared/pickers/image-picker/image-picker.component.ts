import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Capacitor, Plugins, CameraResultType, Camera, CameraSource } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  @Output() imageSelected = new EventEmitter<string>();
  selectedImage: string;

  constructor(private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {}

  ngOnInit() {}

  onPickImage() {
    this.actionSheetCtrl
      .create({
        header: 'Add Image',
        buttons: [
          {
            text: 'Select from Camera Roll',
            handler: () => {
              this.selectImage();
            }
          },
          {
            text: 'Take picture',
            handler: () => {
              this.takePicture();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })
      .then(actionEl => {
        actionEl.present();
      })
      .catch(err => {
        console.log('Error: ', err);
        this.showAlert('Unfortunately something went wrong', 'Please try again.');
      });
  }

  private showAlert(header?: string, message?: string) {
    this.alertCtrl
      .create({
        header: header ? header : 'Camera Roll Not Accessible',
        message: message ? message : 'Please enable access to the Camera Roll',
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }

  private selectImage() {
    console.log('Select image from Camera Roll');
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.showAlert();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      resultType: CameraResultType.Base64,
      allowEditing: false,
      correctOrientation: true,
      source: CameraSource.Prompt,
      height: 320,
      width: 200
    })
      .then(data => {
        console.log('Camera: ', data);
        this.selectedImage = data.base64Data;
        this.imageSelected.emit(this.selectedImage);
      })
      .catch(err => {
        console.log('Camera error: ', err);
        this.showAlert();
      });
  }

  private takePicture() {
    console.log('Take picture with Camera');
  }
}
