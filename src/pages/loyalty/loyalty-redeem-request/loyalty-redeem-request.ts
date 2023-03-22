import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { DealerHomePage } from '../../dealer-home/dealer-home';
import { LoyaltyHomePage } from '../loyalty-home/loyalty-home';
import { CancelationPolicyPage } from '../../cancelation-policy/cancelation-policy';


/**
* Generated class for the LoyaltyRedeemRequestPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-redeem-request',
  templateUrl: 'loyalty-redeem-request.html',
})
export class LoyaltyRedeemRequestPage {
  gift_id:any;
  otp:any ='';
  gift_detail:any='';
  uploadUrl:any;
  currentPointBalcance:any;
  currentPointBalcance_round:any;
  otp_value:any='';
  data:any ={};
  karigar_detail:any = '';
  saveFlag:boolean = false;
  gift_type:any;
  
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,public service:MyserviceProvider,
    public loadingCtrl:LoadingController,private app: App,public storage:Storage,
    public db:DbserviceProvider,public constant:ConstantProvider,public toastCtrl:ToastController) {
   this.uploadUrl = constant.upload_url1 + 'gift_gallery/';
    this.gift_id = this.navParams.get('gift_id');
    this.gift_type = this.navParams.get('gift_type');
    
    if(this.gift_type == 'Cash'){
      this.data = this.navParams.data;
      console.log('====================================');
      console.log(this.data);
      console.log('====================================');
    }
    
    // this.service.presentLoading();
    this.getOtpDetail('');
    this.getGiftDetail(this.gift_id);
  }
  
  ionViewDidLoad() {
  }
  
  
  
  otpvalidation() 
  {
    this.otp_value=true;
    if(this.data.otp==this.otp)
    {
      this.otp_value=false;
    }
  }
  
  
  
  maxtime: any=30;
  maxTime:any =0;
  time:boolean = false;
  timer:any;
  StartTimer(){
    this.timer = setTimeout((x) => 
    {
      if(this.maxtime <= 0) { }
      this.maxTime -= 1;
      
      if(this.maxTime>0){
        this.time = true;
        this.StartTimer();
      }
      else{
        this.maxtime = 30;
        this.time = false;
      }
    }, 1000);
  }
  
  
  
  
  getOtpDetail(type)
  {
    
    if(type == 'resend'){
      this.maxTime = 30;
      this.StartTimer();
    }
    
    this.service.addData({},'AppGiftTracker/otpSend').then((r)=>
    {
      this.otp=r['data'];
      this.time = false;
      this.data.otp = this.otp;
    });
  }
  
  goTOPage(){
    this.navCtrl.push(CancelationPolicyPage)
  }
  
  
  
  
  getGiftDetail(gift_id)
  {
    this.service.addData({'id' :gift_id},'AppGiftGallery/giftGalleryDetail').then( (result) =>
    {
      
      if(result['statusCode'] == 200){
        this.gift_detail=result['gift_master_list'];
        this.karigar_detail=result['detail'];
        this.service.dismissLoading();
        this.data.gift_name= this.gift_detail.title;
        this.data.redeem_type= this.gift_detail.gift_type;
        this.data.point= this.gift_detail.gift_point;
        
        if(this.gift_type == 'Gift'){
          this.currentPointBalcance = this.karigar_detail.wallet_point - this.gift_detail.gift_point;
          this.currentPointBalcance_round = Math.round(this.currentPointBalcance);
        }
        
        if(this.gift_type == 'Cash'){
          this.currentPointBalcance = this.karigar_detail.wallet_point - parseFloat(this.data.cash_point);
          this.currentPointBalcance_round = Math.round(this.currentPointBalcance);
        }
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
  
  
  address()
  {
    console.log(this.data);
    if(this.data.check1==true)
    {
      this.data.shipping_address=this.karigar_detail.address + ' ,'+this.karigar_detail.city + ' ,'+this.karigar_detail.district +' ,'+ this.karigar_detail.state +' ,'+ this.karigar_detail.pincode;
    }
    else{
      this.data.shipping_address='';
    }
    
    
  }
  
  
  
  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
  
  submit()
  {
    
    if(!this.data.otp){
      this.service.errorToast('Please enter OTP');
      return;
    }

    if(this.gift_type == 'Gift' && !this.data.shipping_address){
      this.service.errorToast('Shipping address required');
      return;
    }
   
    if((this.gift_type == 'Cash') && ((this.karigar_detail.account_holder_name == '' || this.karigar_detail.bank_name == '') || (this.karigar_detail.account_no == '' || this.karigar_detail.ifsc_code == ''))){
      this.service.errorToast('Bank details not updated yet. Update bank details and retry');
      return;
    }
    if(this.gift_type == 'Cash'){
      this.data.point = parseFloat(this.data.cash_point);
      this.data.account_holder_name = this.karigar_detail.account_holder_name
      this.data.bank_name = this.karigar_detail.bank_name
      this.data.account_no = this.karigar_detail.account_no
      this.data.ifsc_code = this.karigar_detail.ifsc_code
      // this.data.point_range_value = this.gift_detail.point_range_value;
    }
    if(!this.data.check){
      this.service.errorToast('Accept Cancellation Policy');
      return;
    }
    this.data.gift_id = this.gift_id,
    this.saveFlag = true;
    this.service.presentLoading();
    
    this.service.addData( {'data':this.data},'AppGiftTracker/addRedeemRequest').then( (result) =>
    {
      if(result['statusCode'] == 200){
        this.service.dismissLoading();
        if(result['user_type'] == 'retailer'){
          this.navCtrl.push(DealerHomePage)
        }
        else{
          this.navCtrl.push(LoyaltyHomePage);
        }
        this.saveFlag = false;
        
        this.service.successToast(result['statusMsg']);
      }
      else{
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg']);
        this.saveFlag = false;
      }
      // if(result['msg']=="success")
      // {
      //   if(result['user_type'] == 'retailer'){
      //     this.navCtrl.push(DealerHomePage)
      //   }
      //   else{
      //     this.navCtrl.push(LoyaltyHomePage);
      //   }
      //   this.saveFlag = false;
      // }
      // else if(r['status']=="EXIST")
      // {
      //   this.saveFlag = false;
      // }
    });
  }
  
  
}
