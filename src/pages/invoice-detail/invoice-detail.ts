import { Component, TestabilityRegistry } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { HomePage } from '../home/home';
import moment from 'moment';
import { CheckinDetailPage } from '../sales-app/checkin-detail/checkin-detail';
import { OrderDetailPage } from '../order-detail/order-detail';
import { ExecutiveOrderDetailPage } from '../executive-order-detail/executive-order-detail';
import { ContractorMeetListPage } from '../Contractor-Meet/contractor-meet-list/contractor-meet-list';
import { VisitingCardListPage } from '../visiting-card/visiting-card-list/visiting-card-list';
import { PointLocationPage } from '../point-location/point-location';
import { AddLeadsPage } from '../sales-app/add-leads/add-leads';
import { AddRetailerPage } from '../add-retailer/add-retailer';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
/**
* Generated class for the InvoiceDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-invoice-detail',
  templateUrl: 'invoice-detail.html',
})
export class InvoiceDetailPage {
  
  InvoiceType:any='paid'
  Id:any;
  InvoiceDetail:any={};
  invoice_info:any={};
  search:any={}
  flag:any;
  date:any
  InvoiceList : any = []
  showRelatedTab:any
  target:any;
  achievement:any;
  image_url:any=''
  DrCode : any = '';
  LoginType : any = '';
  constructor(  public file:File,
    private fileOpener: FileOpener,
    public constant:ConstantProvider,
    private transfer: FileTransfer,private app:App,public navCtrl: NavController,private alertCtrl: AlertController,public db:MyserviceProvider,public modalCtrl: ModalController, public navParams: NavParams,public serve:MyserviceProvider,public loadingCtrl: LoadingController,public popoverCtrl: PopoverController,public toastCtrl:ToastController) {
      this.date = moment(this.date).format('YYYY-MM-DD');
      console.log(this.navParams);
      this.image_url = this.constant.upload_url1
      this.LoginType = this.constant.UserLoggedInData.loggedInUserType
      
      this.Id =  this.navParams.get('id'),
      this.DrCode =  this.navParams.get('CustomerCode'),
      this.invoice_detail()
      
      
    }
    
    ionViewDidLoad() {
      
    }
    
    loading:any;
    lodingPersent()
    {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
      });
      this.loading.present();
    }
    
    presentPopover(myEvent) {
      let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'leads-details' });
      
      popover.present({
        ev: myEvent
      });
      
      popover.onDidDismiss(resultData => {
     
      })
      
    }
    
    invoice_detail()
    {
      this.search.limit=20;
      this.search.start=0;
      this.serve.presentLoading()
      this.serve.addData({'customer_code':this.DrCode,'Id':this.Id, 'filter':this.search},'AppCustomerNetwork/customerInvoiceDetail').then((result)=>{
        console.log(result);
        if(result['statusCode']==200){
          this.InvoiceDetail = result['result']
          this.invoice_info = result['result']['invoice_info']
          this.InvoiceList = result['result']['invoice_item']
          this.search.start = this.InvoiceList.length
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
      this.search.start = this.InvoiceList.length
      this.serve.addData({'customer_code':this.DrCode,'Id':this.Id, 'filter':this.search}, 'AppCustomerNetwork/customerInvoiceDetail').then(result => {
        if (result['result'] == '') {
          this.flag = 1;
        }
        else {
          setTimeout(() => {
            this.InvoiceList = this.InvoiceList.concat(result['result']['invoice_item']);
            infiniteScroll.complete();
          }, 1000);
        }
      });
    }
    
  }
  