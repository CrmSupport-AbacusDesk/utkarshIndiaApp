
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { DealerNetworkDetailPage } from '../dealer-network-detail/dealer-network-detail';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
@IonicPage()
@Component({
  selector: 'page-dealer-network',
  templateUrl: 'dealer-network.html',
})
export class DealerNetworkPage {
  dr_id: any;
  distributor_detail: any = [];
  total_checkin: any = [];
  retailer_list: any = [];
  DealerType: any = 'Active'
  type: any
  search: any = {}
  limit:any;
  start:any;
  flag:any;
  date: any
  showRelatedTab: any
  target: any;
  achievement: any;
  image_url: any = ''
  DrType: any;
  drCode: any;
  LoginType: any = '';
  constructor(public file: File,
    private fileOpener: FileOpener,
    public constant: ConstantProvider,
    private app: App, public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.LoginType = this.constant.UserLoggedInData.loggedInUserType

    this.image_url = this.constant.upload_url1
    this.DrType = this.navParams.get('dr_type')
    this.drCode = this.navParams.get('dr_code');
    if (this.navParams.get('dr_id')) {
      this.dr_id = this.navParams.get('dr_id');
    }
    this.retailerdetail();

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
  error_msg: any = ''
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: this.error_msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  data_status: boolean;
  retailerdetail() {

    this.serve.presentLoading()
this.limit=20
this.start=0
    this.serve.addData({ 'Id': this.dr_id ,'limit':this.limit,'start':this.start}, 'AppCustomerNetwork/distributorDealerLists').then((result) => {
      if (result['statusCode'] == 200) {
        this.data_status = result['status']
        this.serve.dismissLoading()
        this.distributor_detail = result['result'];
        this.retailer_list = result['result']['dealers_info'];
      } else {
        this.serve.dismissLoading()
        this.serve.errorToast(result['statusMsg'])
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });

  }

  ionViewDidLeave() {

  }
  goOnDealerDetail(id) {
    this.navCtrl.push(DealerNetworkDetailPage, { id: id })
  }
  loadData(infiniteScroll) {
    this.start = this.retailer_list.length
    this.serve.addData({"dr_id":this.dr_id,'Id': this.dr_id ,'limit':this.limit,'start':this.start}, 'AppCustomerNetwork/distributorDealerLists').then(resp=> {
      if (resp['result']['dealers_info'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.retailer_list = this.retailer_list.concat(resp['result']['dealers_info']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
}
