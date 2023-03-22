import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { AddRetailerPage } from '../add-retailer/add-retailer';
import { RetailerDetailPage } from '../retailer-detail/retailer-detail';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { MyserviceProvider } from '../../providers/myservice/myservice';

@IonicPage()
@Component({
  selector: 'page-retailer-list',
  templateUrl: 'retailer-list.html',
})
export class RetailerListPage {
  retailer_list = []
  search: any;
  flag: any;
  Type: any = 'My';
  limit: any;
  start: any;
  filter: any = {}
  DrType: any = '3'
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public serve: MyserviceProvider, private alertController: AlertController) {

  }

  
  ionViewDidEnter(){
    this.retailer_data()
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Retailers', 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {

      if (resultData) {
        this.Type = resultData.TabStatus;
        this.retailer_data()
      }
    })

  }
  error_msg: any = ''
  presentAlert() {
    let alert = this.alertController.create({
      title: 'Alert',
      subTitle: this.error_msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  data_status: boolean;
  retailer_data() {
    this.serve.presentLoading();
    this.limit = 20
    this.start = 0
    this.retailer_list=[];
    this.serve.addData({ 'Mode': this.Type, 'Master_Search': this.search, 'limit': this.limit, 'start': this.start }, "AppCustomerNetwork/dealerLists").then(resp => {
      if (resp['statusCode'] == 200) {
        this.data_status = resp['status']
        this.retailer_list = resp['result'];
        this.start = this.retailer_list.length
        this.serve.dismissLoading()
      } else {
        this.serve.errorToast(resp['statusMsg'])
        this.serve.dismissLoading()
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    })

  }

  loadData(infiniteScroll) {
    this.start = this.retailer_list.length
    this.serve.addData({ 'Mode': this.Type, 'Master_Search': this.search, 'limit': this.limit, 'start': this.start }, "AppCustomerNetwork/dealerLists").then(resp => {
      if (resp['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.retailer_list = this.retailer_list.concat(resp['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  doRefresh(refresher) {
    if (this.search)
      this.search = {}
    this.retailer_data()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  addretailer() {
    this.navCtrl.push(AddRetailerPage, {})
  }
  retailer_detail(id) {
    this.navCtrl.push(RetailerDetailPage, { 'id': id })
  }
}
