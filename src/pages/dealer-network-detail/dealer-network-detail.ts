import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController,  ToastController  } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the DealerNetworkDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-network-detail',
  templateUrl: 'dealer-network-detail.html',
})
export class DealerNetworkDetailPage {
  dr_id:any;
    distributor_detail:any=[];
    total_checkin:any = [];
    total_order:any = [];
    DealerType:any= 'Active'
    type:any = 'orders'
    search:any={}
    date:any
    showRelatedTab:any
    target:any;
    achievement:any;
  constructor(
    private app:App,public navCtrl: NavController,private alertCtrl: AlertController,public db:MyserviceProvider,public modalCtrl: ModalController, public navParams: NavParams,public service:MyserviceProvider,public loadingCtrl: LoadingController,public toastCtrl:ToastController
    ) {
      this.dr_id=this.navParams.get('id');
      console.log(this.dr_id)
      this.dealer_detail()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerNetworkDetailPage');
  }

  dealer_detail()
  {
     
      // this.distributor_detaill.orderType = type
      // this.service.show_loading()

      console.log(this.search);
      
      this.service.addData({'dr_id':this.dr_id,search:this.search},'Distributor/dr_detail').then((result)=>{
          console.log(result);
  //    this.service.dismiss()

          this.distributor_detail = result['result'];
          // this.document = result['result']['image'];
// console.log(this.document)

          this.target=result['total_target'];
          this.achievement=result['total_achivement'];
          // this.total_checkin = result['total_checkin'];
          this.total_order = result['Primary'];
          // this.secondary = result['Secondary'];
          this.target=parseInt(this.target)
          this.achievement=parseInt(this.achievement)
          console.log(this.target)
          console.log(this.achievement)
          
      });

  }

}
