import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,Nav, Events, ActionSheetController, AlertController, ModalController} from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ViewProfilePage } from '../view-profile/view-profile';
import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';
import { PointLocationPage } from '../point-location/point-location';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { DomSanitizer  } from '@angular/platform-browser';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { HomePage } from '../home/home';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';




@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  
  @ViewChild(Nav) nav: Nav;
  karigar_detail:any={};
  loading:Loading;
  today_point:any='';
  last_point:any='';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider,
    public service:DbserviceProvider,public loadingCtrl:LoadingController, public storage: Storage,
    public events: Events,public actionSheetController: ActionSheetController,
    private camera: Camera,public alertCtrl:AlertController,
    public modalCtrl: ModalController,public sanitizer: DomSanitizer,public constant : ConstantProvider){
      if(this.service.connection=='offline')
      {
        this.service.showOfflineAlert()
        this.navCtrl.setRoot(HomePage)
      }
    }
    
    photoURL(url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    
    logout() {
      let alert = this.alertCtrl.create({
        title: 'Logout!',
        message: 'Are you sure you want Logout?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              // this.d.('Action Cancelled!')
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.storage.set('token', '');
              this.storage.set('role', '');
              this.storage.set('displayName', '');
              this.storage.set('role_id', '');
              this.storage.set('name', '');
              this.storage.set('type', '');
              this.storage.set('token_value', '');
              this.storage.set('userId', '');
              this.storage.set('token_info', '');
              this.constant.UserLoggedInData = {};
              this.constant.UserLoggedInData.userLoggedInChk = false;
              console.log(this.constant.UserLoggedInData);
              this.events.publish('data','1', Date.now());
              this.showSuccess( " Logout Successfully ");
              this.navCtrl.setRoot(SelectRegistrationTypePage);
            }
          }
        ]
      })
      
      alert.present();
      
    }
    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfilePage');
      if(this.service.connection!='offline')
      {
        this.presentLoading();
      }
    }
    
    ionViewWillEnter()
    {
      if(this.service.connection!='offline')
      {
        this.getKarigarDetail();
      }
    }
    
    
    getKarigarDetail()
    {
      console.log('karigar');
      
      this.serve.addData( {'karigar_id': this.constant.UserLoggedInData.id },'Login/userProfile').then(r =>
        {
          console.log(r);
          this.loading.dismiss();
          this.karigar_detail=r;
          
          
        }, err => {
          this.serve.Error_msg(err);
          this.serve.dismiss();
        });
      }
      
      pointLocation()
      {
        this.navCtrl.push(PointLocationPage,{'lat':this.karigar_detail.cust_lat,'log':this.karigar_detail.cust_long,'old_loc':this.karigar_detail.cust_geo_address});
      }
      openeditprofile()
      {
        let actionsheet = this.actionSheetController.create({
          title:"Profile photo",
          cssClass: 'cs-actionsheet',
          
          buttons:[{
            cssClass: 'sheet-m',
            text: 'Camera',
            icon:'camera',
            handler: () => {
              console.log("Camera Clicked");
              this.takePhoto();
            }
          },
          {
            cssClass: 'sheet-m1',
            text: 'Gallery',
            icon:'image',
            handler: () => {
              console.log("Gallery Clicked");
              this.getImage();
            }
          },
          {
            cssClass: 'cs-cancel',
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionsheet.present();
    }
    takePhoto()
    {
      console.log("i am in camera function");
      const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
      }
      
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {
        this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.karigar_detail.profile);
        if(this.karigar_detail.profile)
        {
          this.uploadImage(this.karigar_detail.profile);
        }
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
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {
        this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.karigar_detail.profile);
        if(this.karigar_detail.profile)
        {
          this.uploadImage(this.karigar_detail.profile);
        }
      }, (err) => {
      });
    }
    uploadImage(profile)
    {
      console.log(profile);
      this.service.post_rqst( {'karigar_id': this.service.karigar_id,'profile':profile },'app_karigar/updateProfilePic').subscribe(r =>
        {
          console.log(r);
          this.showSuccess("Profile Photo Updated")   
        });
        
      }
      
      viewProfiePic()
      {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile}).present();
      }
      
      showSuccess(text)
      {
        let alert = this.alertCtrl.create({
          title:'Success!',
          subTitle: text,
          buttons: ['OK']
        });
        alert.present();
      }
      presentLoading() 
      {
        this.loading = this.loadingCtrl.create({
          content: "Please wait...",
          dismissOnPageChange: true
        });
        this.loading.present();
      }
      
      
      editProfilePage()
      {
        this.navCtrl.push(EditProfilePage,{'detail':this.karigar_detail});
      }
    }
    