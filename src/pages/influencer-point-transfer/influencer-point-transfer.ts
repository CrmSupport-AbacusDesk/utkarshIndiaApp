import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the InfluencerPointTransferPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-influencer-point-transfer',
  templateUrl: 'influencer-point-transfer.html',
})

export class InfluencerPointTransferPage {
  filter:any={};
  coupon_list:any=[];
  otherPoints:any=[];
  ledger_list:any =[];
  loading:Loading;
  SafeResourceUrl;
  tokenInfo:any={};
  lang:any='';
  ok:any="";
  influencer_point:any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider,public loadingCtrl:LoadingController) {
    this.getLedger('');
    this.presentLoading();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoyaltyVideoPage');
  }
  
  presentLoading() 
  {
    this.loading = this.loadingCtrl.create({
      content:"Please wait...",
      dismissOnPageChange: false
    });
    this.loading.present();
  }
  
  doRefresh(refresher) 
  {
    this.getPointList(); 
    refresher.complete();
  }
  
  
  getLedger(bonus)
  {
    this.filter.limit=10;
    this.filter.start=0;
    this.filter.ledger = bonus;
    this.service.addData({'filter' : this.filter},'Influencer/distributor_ledger').then( r =>
      {
        this.ledger_list = r['distributor_ledger'];
        this.loading.dismiss();
      });
    }
    
    
    getPointList()
    {
      this.filter.limit=10;
      this.filter.start=0;
      this.service.addData({'filter' : this.filter},'Influencer/coupon_scan_list').then( r =>
        {
          this.loading.dismiss();
          this.influencer_point=r['detail'];
          this.coupon_list = r['coupon_scan_list'];
        });
      }
      
      flag:any='';
      
      loadData(infiniteScroll, type)
      {
        if(type == 'scanned'){
          this.filter.start=this.coupon_list.length;
          this.service.addData( {'filter':this.filter},'Influencer/coupon_scan_list').then( r =>
            {
              console.log(r);
              if(r['coupon_scan_list'] == '')
              { this.flag=1;}
              else
              {
                setTimeout(()=>{
                  this.coupon_list=this.coupon_list.concat(r['coupon_scan_list']);
                  console.log('Asyn operation has stop')
                  infiniteScroll.complete();
                },1000);
              }
            });
          }
          
          else{
            this.filter.start=this.ledger_list.length;
            this.filter.ledger
            this.service.addData( {'filter':this.filter},'Influencer/influencer_ledger').then( r =>
              {
                if(r['influencer_ledger'] == '')
                { this.flag=1;}
                else
                {
                  setTimeout(()=>{
                    this.ledger_list=this.ledger_list.concat(r['influencer_ledger']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                  },1000);
                }
              });
            }
            
          }
        }
        