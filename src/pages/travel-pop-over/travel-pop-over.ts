import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, } from 'ionic-angular';
import { PrimaryOrderPage } from '../primary-order/primary-order';
import { PaymentPage } from '../payment/payment';
import { DealerNetworkPage } from '../dealer-network/dealer-network';
import { InvoiceListPage } from '../invoice-list/invoice-list';
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list';
import { LedgerPage } from '../ledger/ledger';
import { SecondaryOrderPage } from '../secondary-order/secondary-order';
import { TargetPage } from '../target/target';
import { DistributorSaleTargetPage } from '../distributor-sale-target/distributor-sale-target';
import { PopGiftListPage } from '../sales-app/pop-gift/pop-gift-list/pop-gift-list';
import { LeadsDetailPage } from '../leads-detail/leads-detail';
import { MenuController } from 'ionic-angular';
import { PopGiftOutgoingPage } from '../sales-app/pop-gift/pop-gift-outgoing/pop-gift-outgoing';
import { DistributorPopHistoryPage } from '../distributor-pop-history/distributor-pop-history';
import { MyserviceProvider } from '../../providers/myservice/myservice';
/**
 * Generated class for the TravelPopOverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({

  selector: 'page-travel-pop-over',
  templateUrl: 'travel-pop-over.html',
})
export class TravelPopOverPage {
  NavType: any = {};
  dr_id: any;
  dr_code: any;
  DrType: any;
  rootPage: any = LeadsDetailPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private menu: MenuController,public serve:MyserviceProvider) {
    console.log(serve.userData);
    console.log(this.navParams);
    this.NavType = this.navParams.get('from');
    this.DrType = this.navParams.get('dr_type');
    console.log('NavType', this.navParams.data.from);
    console.log('NavType', this.navParams.get('from'));
    this.dr_id = this.navParams.get('dr_id');
    this.dr_code = this.navParams.get('dr_code');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');

  }

  close(type) {
    // return type
    this.viewCtrl.dismiss({ 'TabStatus': type });
  }
  go_to(type) {
    console.log("Type", type)
    this.viewCtrl.dismiss({ 'TabStatus': type });
    if (type == 'Primary') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(PrimaryOrderPage, { 'comes_from_which_page': 'leads-detail', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType });
      //  this.navCtrl.pop({animate:false})
    } else if (type == 'Secondary') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(SecondaryOrderPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })
      //  this.navCtrl.pop({animate:false})
    } else if (type == 'Detail') {
      this.navCtrl.setRoot(this.rootPage, { 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })
      this.navCtrl.pop({ animate: false })
    } else if (type == 'Payment') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(PaymentPage, { 'dr_id': this.dr_id, 'type': type, 'dr_code': this.dr_code, 'dr_type': this.DrType })
      //  this.navCtrl.pop()

    } else if (type == 'Dealer') {

      console.log(this.navCtrl.getViews().length)
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(DealerNetworkPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })
    } else if (type == 'Invoice') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(InvoiceListPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })
    } else if (type == 'Checkin') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(CheckinListPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })

    } else if (type == 'DistTarget') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(DistributorSaleTargetPage, { 'comes_from_which_page': 'Travel-pop', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })

    } else if (type == 'POP') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      // this.navCtrl.push(DistributorPopHistoryPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })
      this.navCtrl.push(PopGiftListPage,{'comes_from_which_page': 'leads-details','dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType });

    } else if (type == 'Ledger') {
      if (this.navCtrl.getViews().length >= 2) {
        this.navCtrl.remove(1, 1, { animate: false })
        this.navCtrl.pop({ animate: false })
      }
      this.navCtrl.push(LedgerPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.dr_code, 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType })
    }
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
}
