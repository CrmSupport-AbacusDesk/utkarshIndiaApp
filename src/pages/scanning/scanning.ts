import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AlertController, IonicPage, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Geolocation } from '@ionic-native/geolocation';
import { LoyaltyHomePage } from '../loyalty/loyalty-home/loyalty-home';
import { OpenNativeSettings } from '@ionic-native/open-native-settings'

@IonicPage()
@Component({
  selector: 'page-scanning',
  templateUrl: 'scanning.html',
})
export class ScanningPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  product_detail: any ={};
  data:any ={};
  scaninfo: any ={};
  spinnerLoader:boolean = false;
  showDetail:boolean = false
  pageType:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider,
    public constant: ConstantProvider, public alertCtrl: AlertController,private openNativeSettings: OpenNativeSettings) {
      this.pageType = this.navParams.get('page_type');
      
      if(this.pageType == 'scan'){
        this.showDetail = true;
        this.product_detail = this.navParams.get('product_detail')
        this.scaninfo = this.product_detail.scaninfo;
      }
    }
    
    ionViewDidLoad() {
    }
    
    submit(){
      this.spinnerLoader= true;
      this.service.addData({ 'coupon_code': this.data.code, }, 'AppCouponScan/fetchProduct').then((r: any) => {
        if (r['statusCode'] == 200) {
          let result ;
          result = r['result'];
          if( result != ''){
            this.spinnerLoader= false;
            this.showDetail = true;
            this.product_detail = result;
            this.scaninfo = this.product_detail.scaninfo;
          }
        }
        else {
          this.spinnerLoader= false;
          this.service.errorToast(r['statusMsg']);
        }
      },
      err => {
        this.spinnerLoader= false;
        this.service.Error_msg(err);
      });
    }
    
    
    
  }
  