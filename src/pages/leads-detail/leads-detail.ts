import { Component,AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Platform } from 'ionic-angular';
import moment from 'moment';
import { PointLocationPage } from '../point-location/point-location';
import { FileTransfer} from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';
@IonicPage()
@Component({
  selector: 'page-leads-detail',
  templateUrl: 'leads-detail.html',
})
export class LeadsDetailPage implements AfterViewInit {
  dr_id: any;
  drCode: any;
  distributor_detail: any = [];
  total_checkin: any = [];
  total_order: any = [];
  type: any
  search: any = {}
  currentDate: any;
  date: any
  showRelatedTab: any
  target: any;
  achievement: any;
  image_url: any = ''
  inoviceInfo: any = []
  fourthInfo: any = {};
  thirdInfo: any = {};
  secondInfo: any = {};
  firstInfo: any = {};
  DrType: any = ''
  
  constructor(public file: File,
    private fileOpener: FileOpener,
    public platform: Platform,
    public constant: ConstantProvider,
    private transfer: FileTransfer, private app: App, public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
      
      
    }

    ionViewWillEnter(){
      this.date = moment(this.date).format('YYYY-MM-DD');
      this.currentDate = moment().format("MMMM YYYY");
      this.image_url = this.constant.upload_url1
      this.DrType = this.navParams.get('dr_type')
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
        this.dr_detail();
    
    }

    
    ngAfterViewInit() {
      // this.platform.ready().then(() => this.loadMap());
    }
 
    
    loading: any;
    lodingPersent() {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
      });
      this.loading.present();
    }
    
    
    close() {
      this.navCtrl.push(MainDistributorListPage);
    }
    presentPopover(myEvent) {
      let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode ,'dr_type':this.DrType});
      
      popover.present({
        ev: myEvent
      });
      
      popover.onDidDismiss(resultData => {
        
   
      })
      
    }
    dr_detail() {
      this.serve.presentLoading()
      this.serve.addData({ 'Id': this.dr_id, search: this.search }, 'AppCustomerNetwork/distributorDetails').then((result) => {
        if(result['statusCode']==200){
        this.serve.dismissLoading()
        this.distributor_detail = result['result'];
        this.inoviceInfo = result['result']['inoviceInfo']
        this.drCode = this.distributor_detail.dr_code
        this.target = result['total_target'];
        this.achievement = result['total_achivement'];
        this.total_order = result['Primary'];
        this.target = parseInt(this.target)
        this.achievement = parseInt(this.achievement)
        }else{
        this.serve.dismissLoading()
        this.serve.errorToast(result['statusMsg'])
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      }
      );
      
    }
    
    checkin_list: any = [];
    load_data: any = "0";
    order_list: any = [];
    update_location(lat, lng, id) {
      this.navCtrl.push(PointLocationPage, { "lat": lat, "lng": lng, "id": id, "type": this.type })
    }
  }
  