import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SiteAddPage } from '../site-add/site-add';
import { SiteDetailPage } from '../site-detail/site-detail';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ConstantProvider } from '../../../providers/constant/constant';
/**
 * Generated class for the SiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-list',
  templateUrl: 'site-list.html',
})
export class SiteListPage {
  site_list: any = []
  limit: any;
  flag: any;
  start: any;
  lastPageData:any ={};
  filter:any ={};
  userType:any;
  constant:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public serve: ConstantProvider) {
    this.lastPageData = this.navParams.data;
    this.constant = serve.UserLoggedInData.loggedInUserType
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
  }
  ionViewWillEnter() {
    
    this.getInfluencer()
  }

  getInfluencer() {
    this.service.presentLoading()
    this.limit = 20;
    this.start = 0;
    this.service.addData({'filter':this.filter, 'limit': this.limit, 'type':this.lastPageData.type, 'start': this.start }, 'AppInfluencer/allInfluencerList').then(result => {
      if (result['statusCode'] == 200) {
        this.userType = result['login_type'];
        this.site_list = result['result'];

        this.service.dismissLoading()
        this.start = this.site_list.length
      }
      else {
        this.service.dismissLoading()
        this.service.errorToast(result['statusMsg'])
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });


  }

  loadData(infiniteScroll) {
    this.start = this.site_list.length
    this.service.addData({'filter':this.filter, 'limit': this.limit, 'type':this.lastPageData.type, 'start': this.start }, 'AppInfluencer/allInfluencerList').then(result => {
      if (result['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.site_list = this.site_list.concat(result['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  doRefresh(refresher)
  {
    this.getInfluencer();
    refresher.complete();
  }
  siteDetail(id) {
    this.navCtrl.push(SiteDetailPage,{'id':id})
  }
  SiteAdd() {
    this.navCtrl.push(SiteAddPage, {'moduleName':this.lastPageData.moduleName, 'scanRight':this.lastPageData.scanRight, 'pointsRight':this.lastPageData.pointsRight, 'type': this.lastPageData.type})
  }
}
