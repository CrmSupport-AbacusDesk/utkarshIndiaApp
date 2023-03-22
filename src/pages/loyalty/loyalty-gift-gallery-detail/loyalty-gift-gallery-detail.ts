import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { LoyaltyRedeemRequestPage } from '../loyalty-redeem-request/loyalty-redeem-request';


@IonicPage()
@Component({
  selector: 'page-loyalty-gift-gallery-detail',
  templateUrl: 'loyalty-gift-gallery-detail.html',
})
export class LoyaltyGiftGalleryDetailPage {
  gift_id:any=''; 
  gift_detail:any={};
  balance_point:any='';
  loading:Loading;
  star:any=''; 
  rating_star:any='';
  otp:'';
  offer_balance:any=''
  karigar_detail:any={};
  tokenInfo:any={};
  lang:any='';
  uploadUrl:any;
  influencer_point:any ={};
  data:any ={};
  contact:any ={};


  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider,public loadingCtrl:LoadingController,private app: App,public storage:Storage,public db:DbserviceProvider,public constant:ConstantProvider,public toastCtrl:ToastController) {
    this.gift_id = this.navParams.get('id');
    this.uploadUrl = constant.upload_url1+'gift_gallery/';
    this.service.presentLoading();
    this.getGiftDetail(this.gift_id);
  }
  
  ionViewDidLoad() {
  }
  
  ionViewWillEnter()
  {
  }
  
  
  getGiftDetail(gift_id)
  {
    this.service.addData({'id' :gift_id},'AppGiftGallery/giftGalleryDetail').then( (result) =>
    {
      if(result['statusCode'] == 200){
        this.gift_detail=result['gift_master_list'];
        this.influencer_point=result['detail'];
        if(this.influencer_point.kyc_status != 'Verified'){
          this.contactDetails();
        }
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
      
      
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  
  getValue(value){
    if(parseFloat(value) > parseFloat(this.influencer_point.wallet_point)){
      this.service.errorToast('Insufficient Balance');
      return
    }
    else{
      this.data.cash_value =  value * this.gift_detail.point_range_value;
    }
  }


  contactDetails()
  {
    this.service.addData({},'AppContactUs/contactDetail').then((result) =>
    {
      if(result['statusCode'] == 200){
        this.contact = result['contact_detail'];
      }
      else{
        this.service.errorToast(result['statusMsg']);
      }
    });
  }
  
  
  SendRequest(){
    if(this.gift_detail.gift_type ==  'Cash'){
      if(this.data.cash_point == undefined){
        this.service.errorToast('Please enter redeem points value');
        return
      }

      if(parseFloat(this.data.cash_point) > parseFloat(this.influencer_point.wallet_point)){
        this.service.errorToast('Insufficient Balance');
        return
      }
      else{
        console.log('Data',this.data)
        this.navCtrl.push(LoyaltyRedeemRequestPage,{'karigar_id':this.db.tokenInfo.id,'gift_id':this.gift_id,"mode":"reedeemPoint",'offer_balance':this.offer_balance, 'cash_point':this.data.cash_point, 'gift_type':'Cash', 'cash_value':this.data.cash_value})
      }
    }
    if(parseFloat(this.influencer_point.wallet_point) < parseFloat(this.gift_detail.gift_point)){
      this.service.errorToast('Insufficient Balance');
      return
    }

    if(this.gift_detail.gift_type ==  'Gift'){
      this.navCtrl.push(LoyaltyRedeemRequestPage,{'karigar_id':this.db.tokenInfo.id,'gift_id':this.gift_id,"mode":"reedeemPoint",'offer_balance':this.offer_balance,  'gift_type':'Gift'})
    }
    // else{
    // }
  }
  
}
