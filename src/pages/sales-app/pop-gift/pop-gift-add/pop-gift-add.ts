import { Component,ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { ConstantProvider } from '../../../../providers/constant/constant';
import { IonicSelectableComponent } from 'ionic-selectable';

@IonicPage()
@Component({
  selector: 'page-pop-gift-add',
  templateUrl: 'pop-gift-add.html',
})
export class PopGiftAddPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  pop_list:any=[];
  network_list:any=[];
  pop_data:any={};
  local_data:any={};
  view_section:any='submit';
  checkin_id:any=0;
  items:any=[];
  user_data:any = {};
  spinLoader:boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serve: MyserviceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public constant : ConstantProvider) 
    {
      this.user_data = this.constant.UserLoggedInData
      this.checkin_id=this.navParams.get('checkin_id');
      if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
       
        this.pop_data.networkType=this.navParams.get('dr_type');
        this.get_network_list( this.pop_data.networkType);
      }
      
      if(this.user_data.type == '1'){
        this.pop_data.networkType = '3'
        this.get_network_list('3');
      }
    }
    
    ionViewDidLoad() 
    {
    }
    
    get_network_list(network_type)
    {
      let dr_name 
      if(network_type == '1'){
        dr_name = 'Distributor'
      }
      if(network_type == '3'){
        dr_name = 'Retailer'
      }
      if(network_type == '7'){
        dr_name = 'Direct Dealer '
      }
      
      
      this.serve.presentLoading();
      this.serve.addData({'type_name':dr_name, 'dr_type':network_type},'AppFollowup/followupCustomer').then((result)=>{
        
        if(result['statusCode'] == 200){
          this.network_list = result['result'];
          if(this.navParams.get('dr_name'))
          {
            this.pop_data.dr_id= this.network_list.filter(row=>row.company_name == this.navParams.get('dr_name'));
            this.pop_data.dr_id=this.pop_data.dr_id[0].id;
            this.getPopList();
          }
          this.serve.dismissLoading();
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }
    
    getPopList()
    {
      this.serve.addData({"Mode": "My"},'AppPopGift/executivePopGift').then((response)=>
      {
        
        if(response['statusCode'] == 200){
          this.pop_list = response['result'];
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(response['statusMsg'])
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }
    
    stockValue(id)
    {
      let index = this.pop_list.findIndex(row=>row.pop_id == id.pop_id)
      this.pop_data.item_name = (this.pop_list[index].item_name);
      this.pop_data.pop_id = id.pop_id;
      this.local_data.qty = parseInt(this.pop_list[index].qty)
    }
    
    addToList()
    {
      let secondary_index = this.pop_list.findIndex(row=>row.pop_id ==this.pop_data.pop_id)
      this.pop_list[secondary_index].qty = parseInt(this.pop_list[secondary_index].qty) - parseInt(this.pop_data.qty)
      let index = this.items.findIndex(row=>row.pop_id ==this.pop_data.pop_id)
      
      if(index==-1)
      {
        this.items.push({'item_name':this.pop_data.item_name,  'qty':this.pop_data.qty, 'pop_id' : this.pop_data.pop_id
      })
    }
    else
    { 
      this.items[index].qty = parseInt(this.items[index].qty) + parseInt(this.pop_data.qty);
    }
    this.pop_data.item_name =''
    this.pop_data.qty =''
    this.pop_data.pop_id =''
    this.local_data.qty ='' 
  }
  
  sendOtp()
  {
    let index = this.network_list.findIndex(row=>row.id ==this.pop_data.dr_id.id)
    this.local_data.otp = Math.floor(100000 + Math.random() * 900000);
    this.local_data.mobile = this.network_list[index].mobile;
    this.view_section ='otp';
    this.serve.addData(this.local_data,'AppPopGift/sendOtp').then((response)=>
    {
      // if(response['statusCode'] == 200){
      //   this.serve.successToast(response['statusMsg'])
      // }else{
      //   this.serve.dismissLoading();
      //   this.serve.errorToast(response['statusMsg'])
      // }
    })

    // let alert=this.alertCtrl.create({
    //   title:'Are You Sure?',
    //   subTitle: 'You want to save this ?',
    //   cssClass:'action-close',
    //   buttons: [{
    //     text: 'Cancel',
    //     role: 'cancel',
    //     handler: () => {
    //     }
    //   },
    //   {
    //     text:'Confirm',
    //     cssClass: 'close-action-sheet',
    //     handler:()=>
    //     {
    //       this.view_section ='otp';
    //       this.serve.addData(this.local_data,'Pop_gift/send_otp').then((response)=>
    //       {
    //         // if(response['statusCode'] == 200){
    //         //   this.serve.successToast(response['statusMsg'])
    //         // }else{
    //         //   this.serve.dismissLoading();
    //         //   this.serve.errorToast(response['statusMsg'])
    //         // }
    //       },
    //       er=>
    //       {
    //       });
    //     }
    //   }]
    // });
    // alert.present();
  }
  
  checkOtp()
  {
    this.spinLoader = true;
    if(this.local_data.otp == this.pop_data.otp)
    {
      this.pop_data.checkin_id=this.checkin_id;
      this.pop_data.items=this.items;
      let toast = this.toastCtrl.create({
        message: 'Saved Successfully!',
        duration: 3000
      });
      this.serve.addData(this.pop_data,'AppPopGift/transferPopGift').then((response)=>
      {
        if(response['statusCode'] == 200){
          this.serve.dismissLoading();
          this.spinLoader = false;
          this.serve.successToast(response['statusMsg'])
          this.navCtrl.pop();
        }else{
          this.serve.dismissLoading();
          this.spinLoader = false;
          this.serve.errorToast(response['statusMsg'])
        }
      },
      error=>
      {
        this.spinLoader = false;
        this.serve.Error_msg(error);
        this.serve.dismissLoading();
      });
    }
    else
    {
      let alert = this.alertCtrl.create({
        subTitle: 'OTP do not match',
        buttons: ['Try Again']
      });
      alert.present();
      this.spinLoader = false;
    }
  }
  
  delete_from_list(index){
    let secondary_index = this.pop_list.findIndex(row=>row.pop_id ==this.items[index].pop_id)
    this.pop_list[secondary_index].qty = parseInt(this.pop_list[secondary_index].qty)+parseInt(this.items[index].qty)
    this.items.splice(index,1);
  }
}