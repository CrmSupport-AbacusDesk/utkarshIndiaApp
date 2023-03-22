import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';
import { ActionSheetController, AlertController, App, Events, IonicPage, Loading, LoadingController, ModalController, Nav, NavController, NavParams, } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { RegistrationPage } from '../../login-section/registration/registration';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';

/**
* Generated class for the LoyaltyProfilePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-profile',
  templateUrl: 'loyalty-profile.html',
})


export class LoyaltyProfilePage {

  @ViewChild(Nav) nav: Nav;
  karigar_detail: any = {};
  loading: Loading;
  edit: any = '';
  edit1: any = '';
  lang: any = '';
  upload_url: any = ''
  tokenInfo: any = {};
  constructor(public navCtrl: NavController, public app: App, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, public storage: Storage, public events: Events, public actionSheetController: ActionSheetController, private camera: Camera, public alertCtrl: AlertController, public modalCtrl: ModalController, public db: DbserviceProvider, private socialSharing: SocialSharing, public constant: ConstantProvider) {
    this.upload_url = constant.influencer_doc;
    this.getKarigarDetail();
  }


  title: any = ""
  no: any = ""
  yes: any = ""
  content: any = ""


  logout() {
    let alert = this.alertCtrl.create({
      title: 'Logout!',
      message: 'Are you sure you want Logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
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
            this.events.publish('data', '1', Date.now());
            this.service.successToast(" Logout Successfully ");
            this.navCtrl.setRoot(SelectRegistrationTypePage);

          }
        }
      ]
    })

    alert.present();

  }



  cam: any = "";
  gal: any = "";
  cancl: any = "";
  ok: any = "";
  upl_file: any = "";
  save_succ: any = "";
  ionViewDidLoad() {
    this.cam = "Camera"
    this.gal = "Gallery"
    this.cancl = "Cancel"
    this.ok = "OK"
    this.upl_file = "Upload File"
    this.save_succ = "Registered Successfully"
  }

  ionViewWillEnter() {
  }
  language: any = [];
  getKarigarDetail() {
    this.service.presentLoading();
    this.service.addData({}, 'AppInfluencer/influencerDetail').then((result) => {
      if (result['statusCode'] == 200) {
        this.karigar_detail = result['detail'];
        this.service.dismissLoading();
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }

  openeditprofile() {
    let actionsheet = this.actionSheetController.create({
      title: "Profile photo",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    actionsheet.present();
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection: 1,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
      if (this.karigar_detail.profile) {
        this.uploadImage(this.karigar_detail.profile);
      }
    }, (err) => {
    });
  }
  getImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
      if (this.karigar_detail.profile) {
        this.uploadImage(this.karigar_detail.profile);
      }
    }, (err) => {
    });
  }
  uploadImage(profile) {
    this.service.addData({ 'profile': profile }, 'AppInfluencer/updateProfilePic').then((r) => {
      if (r['statusCode'] == 200) {
        this.service.successToast(r['statusMsg'])
        this.getKarigarDetail()
      } else {
        this.service.errorToast(r['statusMsg'])
      }
    });
  }

  ref_code: any = "";
  ShareApp() {
    if (this.karigar_detail.referral_code != "") {
      this.ref_code = ' and use my Code *' + this.karigar_detail.referral_code + '* to get points back in your wallet'
    }
    this.socialSharing.share('Hey There ! here is an awesome app from Pearl Precision   ..Give it a try https://play.google.com/store/apps/details?id=com.pearl.app ' + this.ref_code).then(() => {
    }).catch((e) => {
      this.service.errorToast('Something Went wrong , Please Try Again Later')
    });
  }

  updateProfile() {
    this.karigar_detail.edit_profile = 'edit_profile';
    this.navCtrl.push(RegistrationPage, { 'data': this.karigar_detail, "mode": 'edit_page' })
  }


  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


}
