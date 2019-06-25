import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { Capacitor, Plugins, CameraResultType, Camera, CameraSource } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;

  @Output() imageSelected = new EventEmitter<string | File>();
  selectedImage: string;
  useFilePicker = false;

  @Input() showPreview = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) { }

  ngOnInit() {
    console.log('Mobile? ', this.platform.is('mobile'));
    console.log('Hybrid? ', this.platform.is('hybrid'));
    console.log('iOS? ', this.platform.is('ios'));
    console.log('Android? ', this.platform.is('android'));
    console.log('Desktop? ', this.platform.is('desktop'));

    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.useFilePicker = true;
    }
  }

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
      // this.showAlert();
      this.filePickerRef.nativeElement.click();
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
        if (this.useFilePicker) {
          this.filePickerRef.nativeElement.click();
        }
        this.showAlert();
        return false;
      });
  }

  private takePicture() {
    console.log('Take picture with Camera');
  }

  onFileUpload(event: Event) {
    console.log('File upload event: ', event);
    // const selectedFile = event.target.files[0]; // need to wrap event.target as below
    const selectedFile = (event.target as HTMLInputElement).files[0];

    if (!selectedFile) {
      this.showAlert('No file selected', 'Please select a file.');
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imageSelected.emit(selectedFile);
    };
    fr.readAsDataURL(selectedFile);
  }
}
