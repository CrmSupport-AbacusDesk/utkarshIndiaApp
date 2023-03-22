import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { DistributorDetailPage } from '../sales-app/distributor-detail/distributor-detail';
import { ViewProfilePage } from '../view-profile/view-profile';
import { DealerExecutiveAppPage } from '../dealer-executive-app/dealer-executive-app';

@IonicPage()
@Component({
    selector: 'page-dealer-dealer-list',
    templateUrl: 'dealer-dealer-list.html',
})
export class DealerDealerListPage
{
    
    today_checkin:any=[];
    user_data:any={};
    start:any=0;
    limit:any=10;
    flag:any='';
    filter:any={};
    load_data:any
    constructor( private app:App,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams,public storage:Storage,public serve:MyserviceProvider,public constant:ConstantProvider,public loadingCtrl: LoadingController)
    {
    }
    ionViewWillEnter()
    {
        this.user_data = this.constant.UserLoggedInData;
        this.get_assign_dr()
    }
    
    viewProfiePic(src)
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": "http://phpstack-83335-1970078.cloudwaysapps.com/uploads/"+src}).present();
    }
    dr_list:any=[];
    get_assign_dr()
    {
        this.serve.presentLoading();
        this.serve.addData({user_data:this.user_data,"start":this.start,"limit":this.limit,"search":this.filter},"AppCustomerNetwork/getAssignDr")
        .then(resp=>{
            if(resp['statusCode']==200){
                this.dr_list = resp['dr_list'];
                this.serve.dismissLoading()
            }else{
                this.serve.errorToast(resp['statusMsg'])
                this.serve.dismissLoading()
            }
        }, error => {
            this.serve.Error_msg(error);
            this.serve.dismiss();
        })
    }
    get_assign_drsearch()
    {
        this.serve.addData({user_data:this.user_data,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_assign_dr")
        .then(resp=>{
            this.dr_list = resp['dr_list'];
        },
        err=>
        {
            this.serve.errToasr()
        })
    }
    
    loadData(infiniteScroll)
    {
        this.start = this.dr_list.length;
        this.serve.addData({user_data:this.user_data,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_assign_dr")
        .then((r) =>{
            if(r['dr_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.dr_list=this.dr_list.concat(r['dr_list']);
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
    
    dealer_details:any = [];
    dealer_checkin:any = [];
    dealer_order:any = [];
    
    edit_dis:boolean = false;
    dealer_detail(dr_id)
    {
        if(this.constant.UserLoggedInData.all_data.type==1)
        {
            
            let loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            }); 
            this.serve.addData({'dr_id':dr_id},'Distributor/dealer_detail')
            .then((result)=>{
                this.dealer_details = result['result'];
                this.dealer_checkin = result['total_checkin'];
                this.dealer_order = result['total_order'];
                loading.dismiss();
                
                if(this.user_data.type == '1')
                {
                    this.edit_dis = true;
                }
                this.navCtrl.push(DistributorDetailPage,{'dr_id':dr_id,'edit_discount':this.edit_dis,'dealer_data':this.dealer_details, 'dealer_checkin': this.dealer_checkin,'dealer_order':this.dealer_order});
            });
            loading.present();
        }
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
            if((previuosView=='DealerExecutiveAppPage')) 
            {
                this.navCtrl.popToRoot();
            }
        }
    }
    
    
    delaerexecutive(type) {
        this.navCtrl.push(DealerExecutiveAppPage, { "type": type });
    }
}
