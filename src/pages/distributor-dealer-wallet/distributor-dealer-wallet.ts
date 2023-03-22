import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the DistributorDealerWalletPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-distributor-dealer-wallet',
  templateUrl: 'distributor-dealer-wallet.html',
})

export class DistributorDealerWalletPage {
  filter:any={};
  coupon_list:any=[];
  otherPoints:any=[];
  ledger_list:any =[];
  SafeResourceUrl;
  tokenInfo:any={};
  lang:any='';
  ok:any="";
  history: string = "Ledger";
  influencer_point:any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider) {
    this.service.presentLoading();
    this.getLedger();
  }
  
  ionViewDidLoad() {
  }
  
  
  
  doRefresh(refresher) 
  {
    this.getLedger()
    refresher.complete();
  }
  
  
  getLedger()
  {
    this.filter.limit=10;
    this.filter.start=0;
    this.service.addData({'filter' : this.filter},'AppScanHistory/networkLedger').then(result =>
      {
        console.log('====================================');
        console.log(result);
        console.log('====================================');
        
        if(result['statusCode'] == 200){
          this.ledger_list = result['network_ledger'];
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
    
    
    
    flag:any='';
    
    loadData(infiniteScroll, type)
    {
      this.filter.start=this.ledger_list.length;
      this.filter.ledger
      this.service.addData( {'filter':this.filter},'AppScanHistory/networkLedger').then( r =>
        {
          if(r['network_ledger'] == '')
          { this.flag=1;}
          else
          {
            setTimeout(()=>{
              this.ledger_list=this.ledger_list.concat(r['network_ledger']);
              infiniteScroll.complete();
            },1000);
          }
        }, error => {
          this.service.Error_msg(error);
          this.service.dismiss();
        });
      }
    }
    