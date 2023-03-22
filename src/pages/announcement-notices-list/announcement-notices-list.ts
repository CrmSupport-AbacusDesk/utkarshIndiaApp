import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
// import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';

/**
 * Generated class for the AnnouncementNoticesListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-announcement-notices-list',
  templateUrl: 'announcement-notices-list.html',
})
export class AnnouncementNoticesListPage {

  announcementList: any = [];
  flag:any='0';
  filter:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: MyserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnouncementListPage');
  }

  ionViewWillEnter() {
    this.getAnnouncementList();
  }



  getAnnouncementList() {
    this.filter.limit=15;
    this.filter.start=0;
    this.dbService.presentLoading();
    this.dbService.addData({'filter' : this.filter}, "AppAnnouncement/inAppNotificationList").then(resp => {
      if (resp['statusCode'] == 200) {
        this.dbService.dismissLoading();
        this.announcementList = resp['result'];
      } else {
        this.dbService.dismissLoading();
        this.dbService.errorToast(resp['statusMsg'])
      }
    }, error => {
      this.dbService.Error_msg(error);
      this.dbService.dismiss();
    })
  }


  doRefresh(refresher) {
    this.getAnnouncementList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  loadData(infiniteScroll)
  {
    this.filter.start=this.announcementList.length;

    this.dbService.addData({'filter' : this.filter},'AppAnnouncement/inAppNotificationList').then( (r) =>
    {
      if(r['result']=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.announcementList=this.announcementList.concat(r['result']);
          infiniteScroll.complete();
        },1000);
      }
    }, error => {
      this.dbService.Error_msg(error);
      this.dbService.dismiss();
    });
  }




  back() {
    console.log(window)
    window.history.back();
  }

}
