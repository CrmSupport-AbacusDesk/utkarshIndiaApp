import { Component, TestabilityRegistry } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { HomePage } from '../home/home';
import moment from 'moment';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { InvoiceDetailPage } from '../invoice-detail/invoice-detail';

@IonicPage()
@Component({
  selector: 'page-invoice-list',
  templateUrl: 'invoice-list.html',
})
export class InvoiceListPage {

  InvoiceType: any = 'paid'
  dr_id: any;
  invoice_detail: any = [];
  invoice_info: any = []
  type: any
  search: any;
  filter: any = {};
  limit:any;
  start:any;
  date: any
  showRelatedTab: any
  target: any;
  achievement: any;
  image_url: any = ''
  drCode: any;
  DrType: any = '';
  flag: any;
  LoginType: any = '';
  constructor(public file: File,
    private fileOpener: FileOpener,
    public constant: ConstantProvider,
    private transfer: FileTransfer, private app: App, public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.DrType = this.navParams.get('dr_type')
    this.dr_id = this.navParams.get('dr_id')
    this.LoginType = this.constant.UserLoggedInData.loggedInUserType
    if (this.navParams.get('dr_code')) {
      this.drCode = this.navParams.get('dr_code');
    }
    this.invoice_list();
  }

  doRefresh(refresher) {
    if (this.search)
      this.search = {}

    // this.limit = 0

    this.invoice_list()
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

  invoice_list() {
    this.serve.presentLoading()
    if (!this.navParams.get('dr_code')) {
      this.drCode = this.constant.UserLoggedInData.all_data.dr_code
    }
    this.limit = 20;
    this.start = 0;
    this.serve.addData({ 'customer_code': this.drCode, 'limit': this.limit,'start':this.start }, 'AppCustomerNetwork/customerInvoiceInfo').then((result) => {

      if (result['statusCode'] == 200) {
        this.invoice_detail = result['result'];
        this.invoice_info = result['result']['invoice_info'];
        this.serve.dismissLoading()
        this.start = this.invoice_info.length
      } else{
        this.serve.dismissLoading()
        this.serve.errorToast(result['statusMsg'])
      }


    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });

  }
  loadData(infiniteScroll) {
    this.start = this.invoice_info.length
    this.serve.addData({ 'customer_code': this.drCode, search: this.search }, 'AppCustomerNetwork/customerInvoiceInfo').then(result => {
      if (result['result']['invoice_info'] == '') {
        this.flag = 1;
      }
      else { 
        setTimeout(() => {
          this.invoice_info = this.invoice_info.concat(result['result']['invoice_info']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  go_to(invoice_id, customer_code) {

    this.navCtrl.push(InvoiceDetailPage, { 'id': invoice_id, 'CustomerCode': customer_code })
  }

}
