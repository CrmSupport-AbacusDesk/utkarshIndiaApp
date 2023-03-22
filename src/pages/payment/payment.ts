import { Component, TestabilityRegistry } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  drCode: any;
  distributor_detail: any = [];
  PaymentInfo: any = [];
  type: any
  search: any;
  filter:any={}
  flag:any
  limit:any;
  start:any;
  date: any
  showRelatedTab: any
  target: any;
  achievement: any;
  image_url: any = ''
  DrType: any;
  dr_id: any;
  LoginType : any = '';
  constructor(public file: File,
    private fileOpener: FileOpener,
    public constant: ConstantProvider,
    private app: App, public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.DrType = this.navParams.get('dr_type')
    this.dr_id = this.navParams.get('dr_id')
    this.image_url = this.constant.upload_url1
    this.LoginType = this.constant.UserLoggedInData.loggedInUserType

    if (this.navParams.get('dr_code')) {
      this.drCode = this.navParams.get('dr_code');
      this.payment_list();
    }

  }



  doRefresh(refresher) {
    if (this.search)
      this.search = {}

    // this.limit = 0

    this.payment_list()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode, 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
    })

  }
  payment_list() {
    this.limit=20
    this.start=0
    this.serve.presentLoading()
    if (!this.navParams.get('dr_code')) {
      this.drCode = this.constant.UserLoggedInData.all_data.dr_code
    }

    this.serve.addData({ 'customer_code': this.drCode, 'filter': this.filter,'start':this.start }, 'AppCustomerNetwork/customerPaymentInfo').then((result) => {
if(result['statusCode']==200){
      this.distributor_detail = result['result'];
      this.PaymentInfo = result['result']['payment_info']
      this.start = this.PaymentInfo.length
      this.serve.dismissLoading()
}else{
  this.serve.errorToast(result['statusMsg'])
  this.serve.dismissLoading()

}

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });

  }
  loadData(infiniteScroll) {
    this.start = this.PaymentInfo.length
    this.serve.addData({ 'customer_code': this.drCode, search: this.search }, 'AppCustomerNetwork/customerPaymentInfo').then(result => {
      if (result['result']['payment_info'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.PaymentInfo = this.PaymentInfo.concat(result['result']['payment_info']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
}
