import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AlertController, IonicPage, ModalController, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { ConstantProvider } from '../../providers/constant/constant';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
@IonicPage()
@Component({
  selector: 'page-loyalty-enter-coupon-code',
  templateUrl: 'loyalty-enter-coupon-code.html',
})
export class LoyaltyEnterCouponCodePage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

  qr_code: any = '';
  data: any = {};
  flag: boolean = true;
  couponFlag: boolean = true;
  spinnerLoader: boolean = false;
  userType: any;
  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, public modalCtrl: ModalController, public toastCtrl: ToastController, public navParams: NavParams, public service: MyserviceProvider, public alertCtrl: AlertController,
    public locationAccuracy: LocationAccuracy, public geolocation: Geolocation, public platform: Platform, public Constant: ConstantProvider, public openNativeSettings: OpenNativeSettings) {
    this.userType = this.navParams.data;


  }

  ionViewDidLoad() {
  }



  submit() {

    if (this.data.code == undefined ||(this.data.code.length < 16)) {
      this.service.errorToast('Please Enter Coupon Code');
      return;
    }
    else {
      this.platform.ready().then(() => {
        this.spinnerLoader = true;
        this.service.addData({ 'coupon_code': this.data.code, 'is_mobile_manual_scan': 1 }, 'AppCouponScan/couponCodeScan').then((r: any) => {
          if (r['statusCode'] == 200 && r['bonus_point'] > 0) {
            this.spinnerLoader = false;
            this.data.code = '';
            this.service.successToast((r['coupon_point'] + r['bonus_point']) + " points has been added into your wallet");
          }
          else if (r['statusCode'] == 200) {
            this.spinnerLoader = false;
            this.data.code = '';
            this.service.successToast(r['coupon_point'] + " points has been added into your wallet");
          }
          else {
            this.spinnerLoader = false;
            this.data.code = '';
            this.service.errorToast(r['statusMsg']);
          }
        },
          error => {
            this.spinnerLoader = false;
            this.service.dismissLoading();
            this.service.Error_msg(error);
          });

      });
    }

  }

  presentConfirm(title, msg) {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: title,
      message: msg,
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Settings',
          handler: () => {
            this.openSettings()
          }
        }
      ]
    });
    alert.present();
  }
  openSettings() {
    this.openNativeSettings.open("application_details")
  }


}