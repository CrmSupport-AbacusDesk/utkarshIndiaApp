import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener';
import { ActionSheetController, AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SupportListPage } from '../support-list/support-list';

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage 
{
  data:any ={};
  selectImage:any=[];
  typeSupport:any =[];
  savingFlag:boolean = false;
  spinnerLoader:boolean=false;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public actionSheetController: ActionSheetController, private camera: Camera, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.service.presentLoading();
  }
  
  ionViewWillEnter(){
    this.getSupport();

}
  
  
  getSupport()
  {
    this.service.addData({},'AppSupport/getSupportcategory').then( (result) =>
    {
      
      if(result['statusCode'] == 200){
        this.typeSupport=result['data'];
        this.service.dismissLoading();
      } 
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    });
  }
  
  
  onUploadChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title:'Upload File',
      cssClass: 'cs-actionsheet',
      
      buttons:[{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon:'camera',
        handler: () => {
          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon:'image',
        handler: () => {
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.selectImage=[];
        }
      }]
    });
    actionsheet.present();
  }
  takePhoto()
  {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth : 500,
      targetHeight : 400
    }
    
    this.camera.getPicture(options).then((imageData) => {
      var image = 'data:image/jpeg;base64,' + imageData;
      this.selectImage.push(image);
    }, (err) => {
    });
  }
  
  getImage()
  {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(options).then((imageData) => {
      var image = 'data:image/jpeg;base64,' + imageData;
      this.selectImage.push(image);
    }, (err) => {
    });
  }
  
  delete_img(index){
    this.selectImage.splice(index,1);
  }

  
  submit(){
    this.data.image = this.selectImage;
    this.savingFlag == true;
    this.spinnerLoader=true;
    this.service.addData({'data':this.data},'AppSupport/addSupport')
    .then( (result) =>
    {
      
      if(result['statusCode'] == 200){
        this.spinnerLoader=true;

        this.navCtrl.popTo(SupportListPage);
        this.service.successToast(result['statusMsg']);
        this.savingFlag == false;
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.savingFlag == false;
      }
      
    }, error => {
      this.savingFlag == false;

      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
}
