import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Navbar, Platform, Nav, App,PopoverController } from 'ionic-angular';
import { AddOrderPage } from '../add-order/add-order';
import { OrderDetailPage } from '../order-detail/order-detail';
import { SecondaryOrderDetailPage } from '../secondary-order-detail/secondary-order-detail';

import { MyserviceProvider } from '../../providers/myservice/myservice';
// import { OrderTypeModalPage } from '../order-type-modal/order-type-modal';
import { ViewChild } from '@angular/core';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import moment from 'moment';
import { ExecutiveOrderDetailPage } from '../executive-order-detail/executive-order-detail';
import { SecondaryOrderAddPage } from '../secondary-order-add/secondary-order-add';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
@IonicPage()
@Component({
  selector: 'page-secondary-order-main',
  templateUrl: 'secondary-order-main.html',
})
export class SecondaryOrderMainPage {
    
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild(Nav) nav: Nav;
    user_id:any=0;
    date:any
    target_Type:any='My'
    order_type:any='';
    searchData:any='';
    tabSelected:any
    start:any=0;
    limit:any=10;
    flag:any='';
    user_data:any={};
    filter:any={}
    count:any={}
    userId :any;
    order_list:any=[];
    sendRequest:any=false
    order_status : any = 'Pending'
    constructor( 
                private app:App,
                public navCtrl: NavController,
                public constant :ConstantProvider,
                public loadingCtrl: LoadingController, 
                public navParams: NavParams,
                public db:MyserviceProvider, 
                public popoverCtrl: PopoverController,
                public modalCtrl: ModalController, 
                public storage: Storage, 
                public platform: Platform, 
                public appCtrl: App) 
    {
        this.date = moment(this.date).format('YYYY-MM-DD');
        this.userId = navParams.get('userId')
        
    }

    ionViewWillEnter()
    {
        this.get_orders()
        this.searchData = this.navParams.get("dr_name");

        if(this.searchData){
            // this.filter.order_status='Pending'
            this.order_type = this.navParams.get("type");

            this.filter.master=this.searchData;
            // this.get_orders();
            this.order_type = this.navParams.get("type");
        }
        else{
            // this.filter.order_status='Pending'
            this.order_type = this.navParams.get("type");

            
            // this.get_orders();
            this.order_type = this.navParams.get("type");
        }


    }
    
    change_tab(type)
    {
        this.order_type = type;
        this.order_list = [];
        this.start = 0;
        this.filter = {};
        this.get_orders();
    }
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'SecondaryOrd' });
    
        popover.present({
          ev: myEvent
        });
    
        popover.onDidDismiss(resultData => {
    

          if (resultData) {
            this.target_Type = resultData.TabStatus;

           this.get_orders()
      
          }
        })
    
      }
   
    get_orders()
    {
        this.limit =20
        this.start = 0
        this.filter.type = this.order_type;
        this.sendRequest=false
        this.db.presentLoading();
        this.order_list=[];
        this.db.addData({"Status":this.order_status,"Mode": this.target_Type,'filter':this.filter},"AppOrder/secondaryOrdersList").then(resp=>
        {
            if(resp['statusCode']==200){
            this.order_list = resp['result']['result'];
            this.count = resp['count'];
            this.flag=''
            if(this.order_list.length>0){
                this.order_list.map((item)=>{
                    item.order_grand_total = Math.round(item.order_grand_total);
                }) 
            }
            // this.order_list.map((item)=>{
            //     item.order_grand_total = Math.round(item.order_grand_total);
            // })
            // if(!this.filter.master)
            this.sendRequest=true
            this.db.dismissLoading()
        }
        else{
            this.db.errorToast(resp['statusMsg'])
            this.sendRequest=true;
            this.db.dismissLoading()
        }
        },err=>
        {
            this.db.dismissLoading()
            this.db.errToasr()
        })
        setTimeout(() => {
            this.db.dismiss();
            
          }, 2000);
    }
    
    loadData(infiniteScroll) {
        this.start = this.order_list.length;
        this.filter.type = this.order_type;

        this.db.addData({ "Status": this.order_status,'limit':this.limit,'start':this.start, "Mode": this.target_Type,'filter':this.filter }, "AppOrder/secondaryOrdersList").then((r) => {
            if (r['result']['result'] == '') {
                this.flag = 1;
            }
            else {
                setTimeout(() => {
                    this.order_list = this.order_list.concat(r['result']['result']);
                    infiniteScroll.complete();
                }, 1000);
            }
        });
    }

    get_orderssearch()
    {
        this.start=0
        
        this.db.addData({"Status":this.order_status,"Mode":this.target_Type,'filter':this.filter},"AppOrder/secondaryOrdersList").then(resp=>
        {
            if(resp['statusCode']==200){
            this.order_list = resp['result']['result'];
            this.count = resp['count'];
            this.order_list.map((item)=>{
                item.order_grand_total = Math.round(item.order_grand_total);
            })
        }else{
            this.db.errorToast(resp['statusMsg'])
        }
        },err=>
        {
        })
    }

    
    
    goOnOrderDetail(id)
    {
        this.navCtrl.push(SecondaryOrderDetailPage,{id:id , login:'Employee'})
    }

    goOnOrderDetailFromDrLogin(id)
    {
        this.navCtrl.push(SecondaryOrderDetailPage ,{id:id})
    }

    doRefresh (refresher)
    {   
        this.start=0
        this.filter.master='';
        // this.filter.date = '';
        this.get_orders() 
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }

    add_order()
    {
        this.navCtrl.push(SecondaryOrderAddPage,{"type":this.order_type});
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

            if((previuosView=='AddOrderPage')) 
            {
                this.navCtrl.popToRoot();
            }
        }
    }
}

