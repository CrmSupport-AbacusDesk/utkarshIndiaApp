import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { PopGiftAddPage } from '../pop-gift-add/pop-gift-add';
import { PopGiftOutgoingPage } from '../pop-gift-outgoing/pop-gift-outgoing';
import { TravelPopOverPage } from '../../../travel-pop-over/travel-pop-over';
import { ConstantProvider } from '../../../../providers/constant/constant';
import { filter } from 'rxjs/operator/filter';

@IonicPage()
@Component({
  selector: 'page-pop-gift-list',
  templateUrl: 'pop-gift-list.html',
})
export class PopGiftListPage {
  
  pop_list:any=[];
  load_data:any = "0";
  pop_dr_data:any = {}
  Navtype : any = ''
  filter:any={}
  DrType:any;
  drCode:any;
  dr_id:any;
  user_data:any= {}
  flag: number=0;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serve: MyserviceProvider,
    public popoverCtrl: PopoverController,
    public constant : ConstantProvider,) 
    {
      this.user_data = this.constant.UserLoggedInData
      this.Navtype = this.navParams.get('type')
      this.DrType = this.navParams.get('dr_type')
      this.dr_id = this.navParams.get('dr_id')
      this.drCode = this.navParams.get('dr_code');
    }
    
    ionViewDidLoad() 
    {
      
      
    }
    
    ionViewWillEnter()
    {
      this.getPopList();
      
    }
    
    popGift()
    {
      this.navCtrl.push(PopGiftAddPage);
    }
    
    popOutgoing(id,name)
    {
      this.navCtrl.push(PopGiftOutgoingPage,{id,name});
    }
    
    presentPopover(myEvent) {
      
      let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode ,'dr_type':this.DrType});
      popover.present({
        ev: myEvent
      });
      
      popover.onDidDismiss(resultData => {
        
        
      })
      
    }
    getPopList()
    {
      this.serve.presentLoading();
      
      this.filter.limit=20;
      this.filter.start=0;
      
      this.serve.addData({"Mode": "My", 'filter':this.filter},'AppPopGift/executivePopGift').then((response)=>
      {
        
        if(response['statusCode'] == 200){
          this.serve.dismissLoading();
          this.pop_list = response['result'];
          if(this.pop_list.length == 0)
          {
            this.load_data = "1";
          }
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(response['statusMsg'])
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }
    
    loadData(infiniteScroll)
    {
      this.filter.start=this.pop_list.length;
      
      this.serve.addData({"Mode": "My", 'filter':this.filter},'AppPopGift/executivePopGift').then( (r) =>
      {
        console.log(r);
        if(r=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.pop_list=this.pop_list.concat(r['gift_master_list']);
            infiniteScroll.complete();
          },1000);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }
    
  }
  