import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';


@IonicPage()
@Component({
  selector: 'page-distributor-pop-history',
  templateUrl: 'distributor-pop-history.html',
})
export class DistributorPopHistoryPage {
  flag: any;
  pop_list: any = [];
  load_data: any = "0";
  pop_gift_id: any = '';
  pop_gift_name: any = '';
  dr_id: any = ''
  Navtype: any
  limit: any;
  start: any;
  DrType: any
  drCode: any
  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: MyserviceProvider) {
    this.Navtype = this.navParams.get('type')
    this.DrType = this.navParams.get('dr_type')
    this.dr_id = this.navParams.get('dr_id')
    this.drCode = this.navParams.get('dr_code');
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode, 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => { })

  }
  ionViewDidLoad() {
    this.pop_gift_id = this.navParams.get('id');
    this.pop_gift_name = this.navParams.get('name');
    this.dr_id = this.navParams.get('dr_id')
  }

  ionViewWillEnter() {
    this.getPopList();
  }

  getPopList() {
    this.service.presentLoading();
    this.limit = 20
    this.start = 0

    this.service.addData({ 'dr_id': this.dr_id, 'limit': this.limit, 'start': this.start }, 'AppCustomerNetwork/outgoingHistory').then((response) => {

      if (response['statusCode'] == 200) {
        this.pop_list = response['pop_list'];
        if (this.pop_list.length == 0) {
          this.load_data = "1";
        }
        this.service.dismissLoading();
      }
      else {
        this.service.dismissLoading();
        this.service.errorToast(response['statusMsg'])
      }
    },
      er => {
        this.service.dismissLoading();
        this.service.errorToast('Something went wrong');
      });

  }
  loadData(infiniteScroll) {
    this.start = this.pop_list.length
    this.service.addData({ "dr_id": this.dr_id, limit: this.limit, start: this.start }, 'AppCustomerNetwork/outgoingHistory').then(resp => {
      if (resp['pop_list'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.pop_list = this.pop_list.concat(resp['pop_list']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }

}
