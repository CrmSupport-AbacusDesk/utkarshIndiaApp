import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { OrderDetailPage } from '../order-detail/order-detail';
import { ConstantProvider } from '../../providers/constant/constant';
import { DealerExecutiveAppPage } from '../dealer-executive-app/dealer-executive-app';
// import { ExecutivDetailPage } from '../executiv-detail/executiv-detail';


@IonicPage()
@Component({
    selector: 'page-dealer-executive-list',
    templateUrl: 'dealer-executive-list.html',
})
export class DealerExecutiveListPage {
    
    user_id:any=0;
    tabSelected:any
    start:any=0;
    limit:any=10;
    flag:any='';
    user_data:any={};
    filter:any={}
    mediaData:any=[];
    
    constructor(public navCtrl: NavController, private app:App,public constant:ConstantProvider, public navParams: NavParams,public serve:MyserviceProvider,public storage:Storage)
    {
    }
    ionViewWillEnter(){
        this.storage.get("loginData")
        .then(resp=>{
            this.user_data = resp;
            this.user_id = resp.id;
            
            this.get_executives();
        })

    }
    ionViewDidLoad(){
    }
    
    change_tab(type)
    {
        this.executive_list = [];
        this.start = 0;
        this.filter = {};
        this.get_executives();
    }
    
    executive_list:any=[];
    my_cn:any=0;
    company_cn:any=0;   
    
    loadDataa:any=1;
    get_executives()
    {
        this.loadDataa=1;
      
        
        if(!this.filter.master)
        {
            this.serve.presentLoading();
        }
        this.serve.addData({"search":this.filter,"dr_id":this.user_id,"start":this.start,"limit":this.limit},"AppCustomerNetwork/getExecutives")
        .then(resp=>{
            if(resp['statusCode'] == 200){
            this.executive_list = resp['executive_list'];
            this.company_cn = resp['company_count'];
            this.my_cn = resp['my_count'];
            this.serve.dismissLoading()
            this.loadDataa=0
            }else{
            this.serve.dismissLoading()
            this.serve.errorToast(resp['statusMsg'])
            }
        }, error => {
            this.serve.Error_msg(error);
            this.serve.dismiss();
          })
    }
    get_executivessearch()
    {
        this.loadDataa=1;        
        this.serve.addData({"search":this.filter,"dr_id":this.user_id,"start":this.start,"limit":this.limit},"dealerData/get_executives")
        .then(resp=>{
            this.executive_list = resp['executive_list'];
            this.company_cn = resp['company_count'];
            this.my_cn = resp['my_count'];
            this.loadDataa=0

        },err=>
        {
            this.serve.errToasr()
        })
    }
    
    loadData(infiniteScroll)
    {
        this.start = this.executive_list.length;
        
        this.serve.addData({"search":this.filter,"user_id":this.user_id,"start":this.start,"limit":this.limit},"dealerData/get_executives")
        .then((r) =>{
            if(r['executive_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.executive_list=this.executive_list.concat(r['executive_list']);
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
    
    add_order()
    {
        this.navCtrl.push(DealerAddorderPage);
    }
    
    goOnOrderDetail(id){
        this.navCtrl.push(OrderDetailPage,{id:id})
    }
    doRefresh (refresher)
    {   
        this.filter.master='';
        this.filter.date = '';
        this.get_executives() 
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }

    add_exe()
    {
        this.navCtrl.push(DealerExecutiveAppPage);
    }
    ionViewDidLeave()
    {
        let nav = this.app.getActiveNav();
        
        if(nav && nav.getActive()) 
        {
            let activeView = nav.getActive().name;
            
            let previuosView = '';
            
            if(nav.getPrevious() && nav.getPrevious().name)
            {
                previuosView = nav.getPrevious().name;
            }  
          
        }
    }
}
