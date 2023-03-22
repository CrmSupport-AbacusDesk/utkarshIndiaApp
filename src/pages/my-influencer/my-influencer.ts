import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { MyInfluencerDetailPage } from '../my-influencer-detail/my-influencer-detail';

/**
* Generated class for the MyInfluencerPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-my-influencer',
  templateUrl: 'my-influencer.html',
})
export class MyInfluencerPage {
  user_data:any={};
  start:any=0;
  limit:any=10;
  flag:any='';
  filter:any={};
  load_data:any
  
  constructor( private app:App,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams,public storage:Storage,public serve:MyserviceProvider,public constant:ConstantProvider,public loadingCtrl: LoadingController)
  {
    this.getInfluencer('');
  }
  
  ionViewDidLoad() {
  }
  
  
  doRefresh(refresher) {
    this.limit = 0
    this.getInfluencer('')
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  
  
  influencer_list:any=[];
  getInfluencer(search)
  {
    this.filter.limit=20;
    this.filter.start=0;
    this.filter.search=search;
    this.serve.presentLoading();
    this.serve.addData({"start":this.start,"limit":this.limit,"search":this.filter},"AppInfluencer/influencerListForTransfer")
    .then(result=>{
      if(result['statusCode'] == 200){
        this.influencer_list = result['influencer'];
        if (this.influencer_list.length == 0) {
          this.load_data = "1";
        }
        this.serve.dismissLoading();
      }
      else{
        this.serve.errorToast(result['statusMsg']);
        this.serve.dismissLoading();
      }

    }, err => {
      this.serve.Error_msg(err);
      this.serve.dismiss();
    });
  }



  loadData(infiniteScroll)
  {
    this.filter.start=this.influencer_list.length;
    
    this.serve.addData({'filter' : this.filter},'Influencer/influencerListForTransfer').then( (r) =>
    {
      console.log(r);
      if(r=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.influencer_list=this.influencer_list.concat(r['influencer']);
          infiniteScroll.complete();
        },1000);
      }
    });
  }


  goOnDetail(id){
    this.navCtrl.push(MyInfluencerDetailPage,{'id':id})
  }
  
}
