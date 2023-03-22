import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { MyserviceProvider } from '../../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-loyalty-tracker-detail',
  templateUrl: 'loyalty-tracker-detail.html',
})


export class LoyaltyTrackerDetailPage {
  redeemDetail:any ={};
  redeem_id:any;
  uploadUrl:any;
  editAddress:boolean = false
  
  constructor(public navCtrl: NavController, public navParams: NavParams,  public alertCtrl:AlertController, public loadingCtrl:LoadingController, public service:MyserviceProvider , public constant : ConstantProvider) {
    this.redeem_id = this.navParams.get('id');
    this.uploadUrl = constant.upload_url1+"gift_gallery/";
    this.giftTracker();
  }
  
  
  ionViewWillEnter(){
  }
  
  ionViewDidLoad() {
  }
  
 
  
  doRefresh(refresher) 
  {
    this.giftTracker(); 
    refresher.complete();
  }
  
  
  changeAddress(){
    this.editAddress = true;
  }

  
  updateAddress(){
    this.service.addData({'id':this.redeem_id, 'shipping_address':this.redeemDetail.shipping_address},'AppGiftTracker/shippingAddressChange').then((r) =>
    {
      if(r['statusCode'] ==  200){
        this.service.successToast(r['statusMsg']);
        this.editAddress = false;
        this.giftTracker();
      }
      else{
        this.service.errorToast(r['statusMsg']);
        this.editAddress = false;
      }
    });
  }
  
  
  giftTracker()
  {
    this.service.presentLoading();
    this.service.addData({'id':this.redeem_id},'AppGiftTracker/redeemGiftRequestDetail').then((result) =>
    {
      if(result['statusCode'] == 200){
        this.redeemDetail =  result['gift_master_list'];
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    });
  }
  
  
}
