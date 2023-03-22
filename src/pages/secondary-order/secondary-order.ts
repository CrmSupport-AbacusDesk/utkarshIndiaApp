import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { SecondaryOrderDetailPage } from '../secondary-order-detail/secondary-order-detail';

@IonicPage()
@Component({
  selector: 'page-secondary-order',
  templateUrl: 'secondary-order.html',
})
export class SecondaryOrderPage {
  dr_id: any;
  Order_detail: any = [];
  total_checkin: any = [];
  total_order: any = [];
  type: any;
  flag:any;
  search: any = {};
  date: any;
  showRelatedTab: any;
  target: any;
  achievement: any;
  filter:any;
  start:any;
  image_url: any = ''
  OrderType: any
  Order_status_type: any = 'Pending'
  count: any = {}
  DrType: any;
  drCode: any;
  NavType: any;
  LoginType: any = '';
  constructor(public file: File,
    public constant: ConstantProvider,
    public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.LoginType = this.constant.UserLoggedInData.loggedInUserType

    this.image_url = this.constant.upload_url1
    this.DrType = this.navParams.get('dr_type')
    this.NavType = this.navParams.get('from')
    this.drCode = this.navParams.get('dr_code');
    if (this.navParams.get('dr_id')) {
      this.dr_id = this.navParams.get('dr_id');
    }

    if (this.navParams.get('showRelatedTab') == 'false') {
      this.showRelatedTab = false
    }
    else {
      this.showRelatedTab = true
    }
    this.type = this.navParams.get('type');
    this.Order_detail.orderType = this.type

    this.Secondary_order(this.type);
    // }

  }

  ionViewDidLoad() {

  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode, 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
    })

  }
  loading: any;
  lodingPersent() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    this.loading.present();
  }


  Secondary_order(type) {
    this.filter = 20
    this.start = 0
    this.Order_detail.orderType = type
    this.service.presentLoading()
    if (this.constant.UserLoggedInData.id) {
      this.dr_id = this.constant.UserLoggedInData.id
    }
    this.service.addData({ 'dr_id': this.dr_id, 'limit': this.filter,start:this.start, 'Status': this.Order_status_type }, 'AppCustomerNetwork/customerSecondaryOrdersInfo').then((result) => {
     if(result['statusCode']==200){
      this.service.dismissLoading()
      this.Order_detail = result['result'];
      this.total_order = result['result']['Order_Info'];
      this.count = result['count']
     }else{
      this.service.errorToast(result['statusMsg'])
      this.service.dismissLoading();
     }
    },err=>{
      this.service.dismissLoading();
    });

  }
  loadData(infiniteScroll) {
    this.start = this.total_order.length
    this.db.addData({ 'dr_id': this.dr_id, 'limit': this.filter,'start':this.start, 'Status': this.Order_status_type }, 'AppCustomerNetwork/customerSecondaryOrdersInfo').then(resp=> {
      if (resp['result']['Order_Info'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.total_order = this.total_order.concat(resp['result']['Order_Info']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }


  ionViewDidLeave() {

  }

  goOnOrderDetailFromDrLogin(id) {
    this.navCtrl.push(SecondaryOrderDetailPage, { id: id, login: 'Employee' })
  }
}
