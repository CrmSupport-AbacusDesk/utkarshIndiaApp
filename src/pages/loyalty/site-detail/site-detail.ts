import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';

/**
 * Generated class for the SiteDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-detail',
  templateUrl: 'site-detail.html',
})
export class SiteDetailPage {
start:any;
limit:any;
id:any;
flag:any;
siteDetail:any = {}
  constructor(public navCtrl: NavController, public navParams: NavParams,public service : MyserviceProvider) {
    this.id =  this.navParams.get('id')
   this.Site_Detail()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteDetailPage');
  }
  Site_Detail() {
    this.service.presentLoading()
    this.limit = 20
    this.start = 0
    this.service.addData({'id':this.id, 'limit': this.limit, 'start': this.start }, 'AppInfluencer/siteDetail').then(result => {
      if (result['statusCode'] == 200) {
        this.siteDetail = result['result'];
        this.service.dismissLoading()
        this.start = this.siteDetail.coupon_scan_list.length
      }
      else {
        this.service.dismissLoading()
        this.service.errorToast(result['statusMsg'])
      }
    });


  }
  loadData(infiniteScroll) {
    this.start = this.siteDetail.coupon_scan_list.length
    this.service.addData({ 'id':this.id,'limit': this.limit, 'start': this.start }, 'AppInfluencerSignup/siteDetail').then(result => {
      if (result['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.siteDetail = this.siteDetail.concat(result['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }
}
