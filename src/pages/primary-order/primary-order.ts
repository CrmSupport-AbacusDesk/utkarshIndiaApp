
import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { PrimaryOrderDetailPage } from '../primary-order-detail/primary-order-detail';

@IonicPage()
@Component({
  selector: 'page-primary-order',
  templateUrl: 'primary-order.html',
})
export class PrimaryOrderPage {
  dr_id: any;
  Order_detail: any = [];
  total_checkin: any = [];
  total_order: any = [];
  type: any
  filter:any={};
  search: any;
  start: any;
  limit: any;
  date: any
  flag: any = '';
  showRelatedTab: any
  target: any;
  achievement: any;
  image_url: any = ''
  LoginType: any = ''
  OrderType: any
  count: any = {}
  Order_status_type: any = 'Pending'
  DrType: any = ''
  drCode: any;
  constructor(public file: File,
    public constant: ConstantProvider,
     private app: App, public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.DrType = this.navParams.get('dr_type')
    this.drCode = this.navParams.get('dr_code')
    this.dr_id = this.navParams.get('dr_id');
    this.Order_list();

    this.LoginType = this.constant.UserLoggedInData.loggedInUserType
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
  Order_list() {

    this.service.presentLoading()
    if (this.constant.UserLoggedInData.id) {
      this.dr_id = this.constant.UserLoggedInData.id
    }
    this.limit=20;
    this.start=0;
    this.service.addData({ 'dr_id': this.dr_id, 'limit': this.limit,'start':this.start, 'Status': this.Order_status_type ,'filter':this.filter}, 'AppCustomerNetwork/customerPrimaryOrdersInfo').then((result) => {
      if (result['statusCode'] == 200) {
        this.service.dismissLoading()
        this.Order_detail = result['result'];
        this.total_order = result['result']['Order_Info'];
        this.count = result['count']
        this.start=this.Order_detail.length;
      } else {
        this.service.errorToast(result['statusMsg'])
        this.service.dismissLoading()
      }

    });

  }
  doRefresh(refresher) {
    this.start = 0
    this.filter.master = '';
    this.filter.date = '';
    this.Order_list()
    setTimeout(() => {
        refresher.complete();
    }, 1000);
}
  loadData(infiniteScroll) {
    this.start = this.total_order.length
    this.service.addData({'dr_id': this.dr_id, search: this.search, 'limit': this.limit,'start':this.start, 'Status': this.Order_status_type}, 'AppCustomerNetwork/customerPrimaryOrdersInfo').then(result => {
      if (result['result']['Order_Info'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.total_order = this.total_order.concat(result['result']['Order_Info']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }
  goOnOrderDetail(id) {
    this.navCtrl.push(PrimaryOrderDetailPage, { id: id, login: 'Employee' })
  }
}
