import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { TravelPopOverPage } from '../../../travel-pop-over/travel-pop-over';


@IonicPage()
@Component({
  selector: 'page-pop-gift-outgoing',
  templateUrl: 'pop-gift-outgoing.html',
})
export class PopGiftOutgoingPage {

  pop_list: any = [];
  load_data: any = "0";
  pop_gift_id: any = '';
  pop_gift_name: any = '';
  dr_id: any = ''
  Navtype: any
  DrType: any
  drCode: any
  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public serve: MyserviceProvider) {
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
    this.serve.presentLoading();

    if (this.navParams.get('dr_id')) {
      this.serve.addData({ 'dr_id': this.dr_id }, 'AppPopGift/outgoingHistory').then((response) => {
        
        if(response['statusCode'] == 200){
          this.pop_list = response['result'];
        if (this.pop_list.length == 0) {
          this.load_data = "1";
        }
        this.serve.dismissLoading();
        }else{
        this.serve.dismissLoading();
        this.serve.errorToast(response['statusMsg'])
      }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    } else {

      
      this.serve.addData({ 'pop_gift_id': this.pop_gift_id }, 'AppPopGift/outgoingHistory').then((response) => {
        
        if(response['statusCode'] == 200){
        this.pop_list = response['result'];
        if (this.pop_list.length == 0) {
          this.load_data = "1";
        }
        this.serve.dismissLoading();
        }else{
        this.serve.dismissLoading();
        this.serve.errorToast(response['statusMsg'])
      }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }
  }

}
