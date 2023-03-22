import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';

/**
* Generated class for the LoyaltyVideoPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-video',
  templateUrl: 'loyalty-video.html',
})
export class LoyaltyVideoPage {
  filter:any={};
  video_list:any=[];
  SafeResourceUrl;
  tokenInfo:any={};
  lang:any='';
  ok:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider,public dom:DomSanitizer,private app:App) {
    this.getVideoList();
  }
  
  ionViewDidLoad() {
  }
  
  
  doRefresh(refresher) 
  {
    this.getVideoList(); 
    refresher.complete();
  }
  
  
  getVideoList()
  {
    this.filter.limit=20;
    this.filter.start=0;
    this.service.presentLoading();
    this.service.addData({'filter' : this.filter},'AppVideos/videoList').then( result =>
      {
        if(result['statusCode'] == 200){
          this.video_list=result['video_list'];
          for (let i = 0; i < this.video_list.length; i++) {
            this.video_list[i].video = this.dom.bypassSecurityTrustResourceUrl( this.video_list[i].video);
          }
          this.service.dismissLoading();
        }
        else{
          this.service.errorToast(result['statusMsg']);
          this.service.dismissLoading();
        }
      });
    }
    
    flag:any='';
    
    loadData(infiniteScroll)
    {
      this.filter.start=this.video_list.length;
      this.service.addData({'filter' : this.filter},'AppVideos/videoList').then( r =>
        {
          if(r['video_list'] == '')
          {
            this.flag=1;
          }
          else 
          {
            setTimeout(()=>{
              for (let i = 0; i < r['video_list'].length; i++) {
                r['video'][i].video = this.dom.bypassSecurityTrustResourceUrl( r['video'][i].video);
              }
              this.video_list=this.video_list.concat(r['video_list']);
              infiniteScroll.complete();
            },1000);
          }
        });
      }
      
    }
    