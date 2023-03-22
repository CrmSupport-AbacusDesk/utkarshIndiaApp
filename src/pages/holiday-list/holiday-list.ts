import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the HolidayListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-holiday-list',
  templateUrl: 'holiday-list.html',
})
export class HolidayListPage {
  holidayList:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:MyserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HolidayListPage');
  }

ionViewWillEnter(){
 this.getHolidayList()
}
  
  getHolidayList() {
    
    this.dbService.presentLoading();
    this.dbService.addData({}, "AppAttendence/holidayList").then(resp => {
      if (resp['statusCode']==200) {
        this.dbService.dismissLoading();
        this.holidayList = resp['result_array'];
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
    this.getHolidayList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
